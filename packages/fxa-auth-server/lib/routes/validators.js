/* eslint-disable no-useless-escape,no-control-regex */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const { URL } = require('url');
const punycode = require('punycode.js');
const isA = require('@hapi/joi');
const { MozillaSubscriptionTypes } = require('fxa-shared/subscriptions/types');

// Match any non-empty hex-encoded string.
const HEX_STRING = /^(?:[a-fA-F0-9]{2})+$/;
module.exports.HEX_STRING = HEX_STRING;

module.exports.BASE_36 = /^[a-zA-Z0-9]*$/;
module.exports.BASE_10 = /^[0-9]*$/;

// RFC 4648, section 5
module.exports.URL_SAFE_BASE_64 = /^[A-Za-z0-9_-]+$/;

// RFC 7636, section 4.1
module.exports.PKCE_CODE_VERIFIER = /^[A-Za-z0-9-\._~]{43,128}$/;

// Crude phone number validation. The handler code does it more thoroughly.
exports.E164_NUMBER = /^\+[1-9]\d{1,14}$/;

exports.DIGITS = /^[0-9]+$/;

exports.DEVICE_COMMAND_NAME = /^[a-zA-Z0-9._\/\-:]{1,100}$/;

exports.IP_ADDRESS = isA.string().ip();

// Match display-safe unicode characters.
// We're pretty liberal with what's allowed in a unicode string,
// but we exclude the following classes of characters:
//
//   \u0000-\u001F  - C0 (ascii) control characters
//   \u007F         - ascii DEL character
//   \u0080-\u009F  - C1 (ansi escape) control characters
//   \u2028-\u2029  - unicode line/paragraph separator
//   \uD800-\uDFFF  - non-BMP surrogate pairs
//   \uE000-\uF8FF  - BMP private use area
//   \uFFF9-\uFFFC  - unicode specials prior to the replacement character
//   \uFFFE-\uFFFF  - unicode this-is-not-a-character specials
//
// Note that the unicode replacement character \uFFFD is explicitly allowed,
// and clients may use it to replace other disallowed characters.
//
// We might tweak this list in future.

const DISPLAY_SAFE_UNICODE =
  /^(?:[^\u0000-\u001F\u007F\u0080-\u009F\u2028-\u2029\uD800-\uDFFF\uE000-\uF8FF\uFFF9-\uFFFC\uFFFE-\uFFFF])*$/;
module.exports.DISPLAY_SAFE_UNICODE = DISPLAY_SAFE_UNICODE;

// Similar display-safe match but includes non-BMP characters
const DISPLAY_SAFE_UNICODE_WITH_NON_BMP =
  /^(?:[^\u0000-\u001F\u007F\u0080-\u009F\u2028-\u2029\uE000-\uF8FF\uFFF9-\uFFFC\uFFFE-\uFFFF])*$/;
module.exports.DISPLAY_SAFE_UNICODE_WITH_NON_BMP =
  DISPLAY_SAFE_UNICODE_WITH_NON_BMP;

// Bearer auth header regex
const BEARER_AUTH_REGEX = /^Bearer\s+([a-z0-9+\/]+)$/i;
module.exports.BEARER_AUTH_REGEX = BEARER_AUTH_REGEX;

// Joi validator to match any valid email address.
// This is different to Joi's builtin email validator, and
// requires a custom validation function.

// The custom validators below need to either return the value
// or create an error object using `createError`.
// see examples here: https://github.com/hapijs/joi/blob/master/lib/string.js

module.exports.email = function () {
  const email = isA.string().max(255).regex(DISPLAY_SAFE_UNICODE);
  // Imma add a custom test to this Joi object using internal
  // properties because I can't find a nice API to do that.
  email._tests.push({
    func: function (value, state, options) {
      if (value !== undefined && value !== null) {
        if (module.exports.isValidEmailAddress(value)) {
          return value;
        }
      }

      return email.createError('string.base', { value }, state, options);
    },
  });

  return email;
};

module.exports.service = isA
  .string()
  .max(16)
  .regex(/^[a-zA-Z0-9\-]*$/);
module.exports.hexString = isA.string().regex(HEX_STRING);
module.exports.clientId = module.exports.hexString.length(16);
module.exports.clientSecret = module.exports.hexString;
module.exports.idToken = module.exports.jwt;
module.exports.refreshToken = module.exports.hexString.length(64);
module.exports.sessionToken = module.exports.hexString.length(64);
module.exports.sessionTokenId = module.exports.hexString.length(64);
module.exports.authorizationCode = module.exports.hexString.length(64);
// Note that the empty string is a valid scope value (meaning "no permissions").
const scope = isA
  .string()
  .max(256)
  .regex(/^[a-zA-Z0-9 _\/.:-]*$/)
  .allow('');
module.exports.scope = scope;
module.exports.assertion = isA
  .string()
  .min(50)
  .max(10240)
  .regex(/^[a-zA-Z0-9_\-\.~=]+$/);
module.exports.pkceCodeChallengeMethod = isA.string().valid('S256');
module.exports.pkceCodeChallenge = isA
  .string()
  .length(43)
  .regex(module.exports.URL_SAFE_BASE_64);
module.exports.pkceCodeVerifier = isA
  .string()
  .min(43)
  .max(128)
  .regex(module.exports.PKCE_CODE_VERIFIER);
module.exports.jwe = isA
  .string()
  .max(1024)
  // JWE token format: 'protectedheader.encryptedkey.iv.cyphertext.authenticationtag'
  .regex(
    /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
  );

module.exports.jwt = isA
  .string()
  .max(1024)
  // JWT format: 'header.payload.signature'
  .regex(/^([a-zA-Z0-9\-_]+)\.([a-zA-Z0-9\-_]+)\.([a-zA-Z0-9\-_]+)$/);

module.exports.accessToken = isA
  .alternatives()
  .try([module.exports.hexString.length(64), module.exports.jwt]);

// Function to validate an email address.
//
// Uses regexes based on the ones in fxa-email-service, tweaked slightly
// because Node's support for unicode regexes is hidden behind a harmony
// flag. As soon as we have default support for unicode regexes, we should
// be able to just use the regex from there directly (and ditch the punycode
// transformation).
//
// https://github.com/mozilla/fxa-email-service/blob/6fc6c31043598b246102cd1fdd27fc325f4514fb/src/validate/mod.rs#L28-L30

const EMAIL_USER = /^[A-Z0-9.!#$%&'*+\/=?^_`{|}~-]{1,64}$/i;
const EMAIL_DOMAIN =
  /^[A-Z0-9](?:[A-Z0-9-]{0,253}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,253}[A-Z0-9])?)+$/i;

module.exports.isValidEmailAddress = function (value) {
  if (!value) {
    return false;
  }

  const parts = value.split('@');
  if (parts.length !== 2 || parts[1].length > 255) {
    return false;
  }

  if (!EMAIL_USER.test(punycode.toASCII(parts[0]))) {
    return false;
  }

  if (!EMAIL_DOMAIN.test(punycode.toASCII(parts[1]))) {
    return false;
  }

  return true;
};

module.exports.redirectTo = function redirectTo(base) {
  const validator = isA.string().max(512);
  let hostnameRegex = null;
  if (base) {
    hostnameRegex = new RegExp(`(?:\\.|^)${base.replace('.', '\\.')}$`);
  }
  validator._tests.push({
    func: (value, state, options) => {
      if (value !== undefined && value !== null) {
        if (isValidUrl(value, hostnameRegex)) {
          return value;
        }
      }

      return validator.createError('string.base', { value }, state, options);
    },
  });
  return validator;
};

module.exports.url = function url(options) {
  const validator = isA.string().uri(options);
  validator._tests.push({
    func: (value, state, options) => {
      if (value !== undefined && value !== null) {
        if (isValidUrl(value)) {
          return value;
        }
      }

      return validator.createError('string.base', { value }, state, options);
    },
  });
  return validator;
};

// resourceUrls must *not* contain a hash fragment.
// See https://tools.ietf.org/html/draft-ietf-oauth-resource-indicators-02#section-2
module.exports.resourceUrl = module.exports.url().regex(/#/, { invert: true });

module.exports.pushCallbackUrl = function pushUrl(options) {
  const validator = isA.string().uri(options);
  validator._tests.push({
    func: (value, state, options) => {
      if (value !== undefined && value !== null) {
        let normalizedValue = value;
        // Fx Desktop registers https push urls with a :443 which causes `isValidUrl`
        // to fail because the :443 is expected to have been normalized away.
        if (/^https:\/\/[a-zA-Z0-9._-]+(:443)($|\/)/.test(value)) {
          normalizedValue = value.replace(':443', '');
        }

        if (isValidUrl(normalizedValue)) {
          return value;
        }
      }

      return validator.createError('string.base', { value }, state, options);
    },
  });
  return validator;
};

function isValidUrl(url, hostnameRegex) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch (err) {
    return false;
  }
  if (hostnameRegex && !hostnameRegex.test(parsed.hostname)) {
    return false;
  }
  if (!/^https?:$/.test(parsed.protocol)) {
    return false;
  }
  // Reject anything that won't round-trip unambiguously
  // through a parse.  This puts the onus on the requestor
  // to e.g. escape special characters, normalize ports, etc.
  // The only trick here is that `new URL()` will add a trailing
  // slash if there's no path component, which is why we also
  // compare to `origin` below.
  if (parsed.href !== url && parsed.origin !== url) {
    return false;
  }
  return parsed.href;
}

module.exports.verificationMethod = isA.string().valid([
  'email', // Verification by email link
  'email-otp', // Verification by email otp code using account long code (`emailCode`) as secret
  'email-2fa', // Verification by email code using randomly generated code (used in login flow)
  'email-captcha', // Verification by email code using randomly generated code (used in unblock flow)
  'totp-2fa', // Verification by TOTP authenticator device code, secret is randomly generated
]);

module.exports.authPW = isA.string().length(64).regex(HEX_STRING).required();
module.exports.wrapKb = isA.string().length(64).regex(HEX_STRING);

module.exports.recoveryKeyId = isA.string().regex(HEX_STRING).max(32);
module.exports.recoveryData = isA
  .string()
  .regex(/[a-zA-Z0-9.]/)
  .max(1024)
  .required();

module.exports.recoveryCode = function (len, base) {
  const regex = base || module.exports.BASE_36;
  return isA.string().regex(regex).min(8).max(len);
};
module.exports.recoveryCodes = function (codeCount, codeLen, base) {
  return isA.object({
    recoveryCodes: isA
      .array()
      .min(1)
      .max(codeCount)
      .unique()
      .items(module.exports.recoveryCode(codeLen, base))
      .required(),
  });
};

module.exports.stripePaymentMethodId = isA.string().max(30);
module.exports.paypalPaymentToken = isA.string().max(30);
module.exports.subscriptionsSubscriptionId = isA.string().max(255);
module.exports.subscriptionsPlanId = isA.string().max(255);
module.exports.subscriptionsProductId = isA.string().max(255);
module.exports.subscriptionsProductName = isA.string().max(255);
module.exports.subscriptionsPaymentToken = isA.string().max(255);
module.exports.subscriptionPaymentCountryCode = isA
  .string()
  .length(2)
  .allow(null);

// This is fxa-auth-db-mysql's perspective on an active subscription
module.exports.activeSubscriptionValidator = isA.object({
  uid: isA.string().required(),
  subscriptionId: module.exports.subscriptionsSubscriptionId.required(),
  productId: module.exports.subscriptionsProductId.required(),
  createdAt: isA.number().required(),
  cancelledAt: isA.alternatives(isA.number(), isA.any().allow(null)),
});

module.exports.subscriptionsSetupIntent = isA
  .object({
    client_secret: isA.string().required(),
  })
  .unknown(true);

// This is a Stripe subscription object with latest_invoice.payment_intent expanded
module.exports.subscriptionsSubscriptionExpandedValidator = isA
  .object({
    id: isA.string().required(),
    object: isA.string().allow('subscription').required(),
    latest_invoice: isA
      .object({
        id: isA.string().required(),
        object: isA.string().allow('invoice').required(),
        payment_intent: isA
          .object({
            id: isA.string().required(),
            object: isA.string().allow('payment_intent').required(),
            client_secret: isA.string().required(),
          })
          .unknown(true)
          .required(),
      })
      .unknown(true)
      .required(),
  })
  .unknown(true);

module.exports.subscriptionsInvoicePIExpandedValidator = isA
  .object({
    id: isA.string().required(),
    object: isA.string().allow('invoice').required(),
    payment_intent: isA
      .object({
        id: isA.string().required(),
        object: isA.string().allow('payment_intent').required(),
        client_secret: isA.string().required(),
      })
      .unknown(true)
      .required(),
  })
  .unknown(true);

module.exports.subscriptionsSubscriptionValidator = isA.object({
  _subscription_type: MozillaSubscriptionTypes.WEB,
  created: isA.number().required(),
  current_period_end: isA.number().required(),
  current_period_start: isA.number().required(),
  cancel_at_period_end: isA.boolean().required(),
  end_at: isA.alternatives(isA.number(), isA.any().allow(null)),
  failure_code: isA.string().optional(),
  failure_message: isA.string().optional(),
  latest_invoice: isA.string().required(),
  plan_id: module.exports.subscriptionsPlanId.required(),
  product_id: module.exports.subscriptionsProductId.required(),
  product_name: isA.string().required(),
  status: isA.string().required(),
  subscription_id: module.exports.subscriptionsSubscriptionId.required(),
  promotion_code: isA.string().optional().allow(null),
  promotion_duration: isA.string().optional().allow(null),
  promotion_end: isA.number().optional().allow(null),
});

// This is support-panel's perspective on a subscription
module.exports.subscriptionsWebSubscriptionSupportValidator = isA.object({
  created: isA.number().required(),
  current_period_end: isA.number().required(),
  current_period_start: isA.number().required(),
  plan_changed: isA.alternatives(isA.number(), isA.any().allow(null)),
  previous_product: isA.alternatives(isA.string(), isA.any().allow(null)),
  product_name: isA.string().required(),
  status: isA.string().required(),
  subscription_id: module.exports.subscriptionsSubscriptionId.required(),
});
module.exports.subscriptionsPlaySubscriptionSupportValidator = isA.object({
  _subscription_type: MozillaSubscriptionTypes.IAP_GOOGLE,
  auto_renewing: isA.bool().required(),
  cancel_reason: isA.number().optional(),
  expiry_time_millis: isA.number().required(),
  package_name: isA.string().optional(),
  sku: isA.string().optional(),
  product_id: isA.string().optional(),
  product_name: isA.string().required(),
});
module.exports.subscriptionsSubscriptionSupportValidator = isA.object({
  [MozillaSubscriptionTypes.WEB]: isA
    .array()
    .items(module.exports.subscriptionsWebSubscriptionSupportValidator),
  [MozillaSubscriptionTypes.IAP_GOOGLE]: isA
    .array()
    .items(module.exports.subscriptionsPlaySubscriptionSupportValidator),
});

module.exports.subscriptionsSubscriptionListValidator = isA.object({
  subscriptions: isA
    .array()
    .items(module.exports.subscriptionsSubscriptionValidator),
});

// https://mana.mozilla.org/wiki/pages/viewpage.action?spaceKey=COPS&title=SP+Tiered+Product+Support#SPTieredProductSupport-MetadataAgreements
// Trying to be a bit flexible in validation here:
// - subhub may not yet be including product / plan metadata in responses
// - metadata can contain arbitrary keys that we don't expect (e.g. used by other systems)
// - but we can make a good effort at validating what we expect to see when we see it
module.exports.subscriptionPlanMetadataValidator = isA.object().unknown(true);

const capabilitiesClientIdPattern = /^capabilities/;
const legalResourceDomainPattern =
  /^https:\/\/accounts-static\.cdn\.mozilla\.net\/legal\/(.*)/;

module.exports.subscriptionProductMetadataBaseValidator = isA
  .object({
    webIconURL: isA.string().uri().required(),
    upgradeCTA: isA.string().optional(),
    downloadURL: isA.string().uri().required(),
    appStoreLink: isA.string().uri().optional(),
    playStoreLink: isA.string().uri().optional(),
    productSet: isA.string().optional(),
    productOrder: isA.number().optional(),
    'product:termsOfServiceDownloadURL': isA
      .string()
      .regex(legalResourceDomainPattern)
      .required(),
    'product:termsOfServiceURL': isA.string().uri().required(),
    'product:privacyNoticeDownloadURL': isA
      .string()
      .regex(legalResourceDomainPattern)
      .optional(),
    'product:privacyNoticeURL': isA.string().uri().required(),
    'product:cancellationSurveyURL': isA.string().uri().optional(),
  })
  .pattern(capabilitiesClientIdPattern, isA.string(), {
    fallthrough: true,
  })
  .unknown(true);

module.exports.subscriptionProductMetadataValidator = {
  validate: function (metadata) {
    const hasCapability = Object.keys(metadata).some((k) =>
      capabilitiesClientIdPattern.test(k)
    );

    if (!hasCapability) {
      return {
        error: 'Capability missing from metadata',
      };
    }
    return module.exports.subscriptionProductMetadataBaseValidator.validate(
      metadata,
      {
        abortEarly: false,
      }
    );
  },
  async validateAsync(metadata) {
    const hasCapability = Object.keys(metadata).some((k) =>
      capabilitiesClientIdPattern.test(k)
    );

    if (!hasCapability) {
      return {
        error: 'Capability missing from metadata',
      };
    }

    try {
      const value = await isA.validate(
        metadata,
        module.exports.subscriptionProductMetadataBaseValidator,
        {
          abortEarly: false,
        }
      );
      return { value };
    } catch (error) {
      return { error };
    }
  },
};

module.exports.subscriptionsPlanValidator = isA.object({
  plan_id: module.exports.subscriptionsPlanId.required(),
  plan_metadata: module.exports.subscriptionPlanMetadataValidator.optional(),
  product_id: module.exports.subscriptionsProductId.required(),
  product_name: isA.string().required(),
  plan_name: isA.string().allow('').optional(),
  product_metadata:
    module.exports.subscriptionProductMetadataBaseValidator.optional(),
  interval: isA.string().required(),
  interval_count: isA.number().required(),
  amount: isA.number().required(),
  currency: isA.string().required(),
});

module.exports.subscriptionsCustomerValidator = isA.object({
  customerId: isA.string().optional(),
  billing_name: isA
    .alternatives(isA.string(), isA.any().allow(null))
    .optional(),
  exp_month: isA.number().optional(),
  exp_year: isA.number().optional(),
  last4: isA.string().optional(),
  payment_provider: isA.string().optional(),
  payment_type: isA.string().optional(),
  paypal_payment_error: isA.string().optional(),
  brand: isA.string().optional(),
  billing_agreement_id: isA
    .alternatives(isA.string(), isA.any().allow(null))
    .optional(),
  subscriptions: isA
    .array()
    .items(module.exports.subscriptionsSubscriptionValidator)
    .optional(),
});

module.exports.subscriptionsStripeIntentValidator = isA
  .object({
    client_secret: isA.string().optional(),
    created: isA.number().required(),
    payment_method: isA
      .alternatives(isA.string(), isA.object({}).unknown(true))
      .optional()
      .allow(null),
    source: isA.alternatives().when('payment_method', {
      // cannot be that strict here since this validator is used in two routes
      is: null,
      then: isA.string().optional(),
      otherwise: isA.any().optional().allow(null),
    }),
    status: isA.string().required(),
  })
  .unknown(true);

module.exports.subscriptionsStripeSourceValidator = isA
  .object({
    id: isA.string().required(),
    object: isA.string().required(),
    brand: isA.string().optional(),
    exp_month: isA.string().optional(),
    exp_year: isA.string().optional(),
    last4: isA.string().optional(),
  })
  .unknown(true);

module.exports.subscriptionsStripeInvoiceValidator = isA
  .object({
    id: isA.string().required(),
    payment_intent: isA
      .alternatives(
        isA.string().allow(null),
        module.exports.subscriptionsStripeIntentValidator
      )
      .optional(),
  })
  .unknown(true);

module.exports.subscriptionsStripePriceValidator = isA
  .object({
    id: isA.string().required(),
  })
  .unknown(true);

module.exports.subscriptionsStripeSubscriptionItemValidator = isA
  .object({
    id: isA.string().required(),
    created: isA.number().required(),
    price: module.exports.subscriptionsStripePriceValidator.required(),
  })
  .unknown(true);

module.exports.subscriptionsStripeSubscriptionValidator = isA
  .object({
    id: isA.string().required(),
    cancel_at: isA.alternatives(isA.number(), isA.any().valid(null)),
    canceled_at: isA.alternatives(isA.number(), isA.any().valid(null)),
    cancel_at_period_end: isA.bool().required(),
    created: isA.number().required(),
    current_period_end: isA.number().required(),
    current_period_start: isA.number().required(),
    ended_at: isA.alternatives(isA.number(), isA.any().valid(null)),
    items: isA
      .object({
        data: isA
          .array()
          .items(module.exports.subscriptionsStripeSubscriptionItemValidator)
          .required(),
      })
      .unknown(true)
      .optional(),
    latest_invoice: isA
      .alternatives(
        isA.string(),
        module.exports.subscriptionsStripeInvoiceValidator
      )
      .optional(),
    status: isA.string().required(),
  })
  .unknown(true);

module.exports.subscriptionsGooglePlaySubscriptionValidator = isA.object({
  _subscription_type: MozillaSubscriptionTypes.IAP_GOOGLE,
  auto_renewing: isA.bool().required(),
  cancel_reason: isA.number().optional(),
  expiry_time_millis: isA.number().required(),
  package_name: isA.string().required(),
  product_id: isA.string().required(),
  product_name: isA.string().required(),
  price_id: isA.string().required(),
  sku: isA.string().required(),
});

module.exports.subscriptionsStripeCustomerValidator = isA
  .object({
    invoices_settings: isA
      .object({
        default_payment_method: isA.string().optional(),
      })
      .unknown(true)
      .optional(),
    subscriptions: isA
      .object({
        data: isA
          .array()
          .items(module.exports.subscriptionsStripeSubscriptionValidator)
          .required(),
      })
      .unknown(true)
      .optional(),
  })
  .unknown(true);

module.exports.subscriptionsMozillaSubscriptionsValidator = isA
  .object({
    customerId: isA.string().optional(),
    billing_name: isA
      .alternatives(isA.string(), isA.any().allow(null))
      .optional(),
    exp_month: isA.number().optional(),
    exp_year: isA.number().optional(),
    last4: isA.string().optional(),
    payment_provider: isA.string().optional(),
    payment_type: isA.string().optional(),
    paypal_payment_error: isA.string().optional(),
    brand: isA.string().optional(),
    billing_agreement_id: isA
      .alternatives(isA.string(), isA.any().allow(null))
      .optional(),
    subscriptions: isA
      .array()
      .items(
        module.exports.subscriptionsSubscriptionValidator,
        module.exports.subscriptionsGooglePlaySubscriptionValidator
      )
      .required(),
  })
  .unknown(true);

module.exports.ppidSeed = isA.number().integer().min(0).max(1024);

module.exports.scopes = isA.array().items(scope).default([]).optional();

module.exports.newsletters = isA
  .array()
  .items(
    isA
      .string()
      .valid(
        'firefox-accounts-journey',
        'knowledge-is-power',
        'take-action-for-the-internet',
        'test-pilot',
        'mozilla-and-you'
      )
  )
  .default([])
  .optional();

module.exports.thirdPartyProvider = isA
  .string()
  .max(256)
  .allow(['google', 'apple'])
  .required();

module.exports.thirdPartyIdToken = module.exports.jwt.optional();
module.exports.thirdPartyOAuthCode = isA.string().optional();
