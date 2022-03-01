/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const emailUtils = require('../email/utils/helpers');
const moment = require('moment-timezone');
const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const safeUserAgent = require('../userAgent/safe');
const url = require('url');
const i18n = require('i18n-abide');
const { URL } = url;
const { productDetailsFromPlan } = require('fxa-shared').subscriptions.metadata;
const Renderer = require('./renderer').default;
const { NodeRendererBindings } = require('./renderer/bindings-node');

const TEMPLATE_VERSIONS = require('./emails/templates/_versions.json');

const DEFAULT_LOCALE = 'en';
const DEFAULT_TIMEZONE = 'Etc/UTC';
const UTM_PREFIX = 'fx-';

const X_SES_CONFIGURATION_SET = 'X-SES-CONFIGURATION-SET';
const X_SES_MESSAGE_TAGS = 'X-SES-MESSAGE-TAGS';

module.exports = function (log, config, bounces) {
  const oauthClientInfo = require('./oauth_client_info')(log, config);
  const verificationReminders = require('../verification-reminders')(
    log,
    config
  );
  const cadReminders = require('../cad-reminders')(config, log);
  const subscriptionAccountReminders =
    require('../subscription-account-reminders')(log, config);

  const paymentsServerURL = new URL(config.subscriptions.paymentsServer.url);

  // Email template to UTM campaign map, each of these should be unique and
  // map to exactly one email template.
  const templateNameToCampaignMap = {
    subscriptionAccountFinishSetup: 'subscription-account-finish-setup',
    subscriptionReactivation: 'subscription-reactivation',
    subscriptionRenewalReminder: 'subscription-renewal-reminder',
    subscriptionUpgrade: 'subscription-upgrade',
    subscriptionDowngrade: 'subscription-downgrade',
    subscriptionPaymentExpired: 'subscription-payment-expired',
    subscriptionsPaymentExpired: 'subscriptions-payment-expired',
    subscriptionPaymentProviderCancelled:
      'subscription-payment-provider-cancelled',
    subscriptionsPaymentProviderCancelled:
      'subscriptions-payment-provider-cancelled',
    subscriptionPaymentFailed: 'subscription-payment-failed',
    subscriptionAccountDeletion: 'subscription-account-deletion',
    subscriptionCancellation: 'subscription-cancellation',
    subscriptionFailedPaymentsCancellation:
      'subscription-failed-payments-cancellation',
    subscriptionSubsequentInvoice: 'subscription-subsequent-invoice',
    subscriptionSubsequentInvoiceDiscount:
      'subscription-subsequent-invoice-discount',
    subscriptionFirstInvoice: 'subscription-first-invoice',
    subscriptionFirstInvoiceDiscount: 'subscription-first-invoice-discount',
    downloadSubscription: 'new-subscription',
    lowRecoveryCodes: 'low-recovery-codes',
    newDeviceLogin: 'new-device-signin',
    passwordChangeRequired: 'password-change-required',
    passwordChanged: 'password-changed-success',
    passwordReset: 'password-reset-success',
    passwordResetAccountRecovery: 'password-reset-account-recovery-success',
    postAddLinkedAccount: 'account-linked',
    postRemoveSecondary: 'account-email-removed',
    postVerify: 'account-verified',
    postChangePrimary: 'account-email-changed',
    postVerifySecondary: 'account-email-verified',
    postAddTwoStepAuthentication: 'account-two-step-enabled',
    postRemoveTwoStepAuthentication: 'account-two-step-disabled',
    postConsumeRecoveryCode: 'account-consume-recovery-code',
    postNewRecoveryCodes: 'account-replace-recovery-codes',
    postAddAccountRecovery: 'account-recovery-generated',
    postRemoveAccountRecovery: 'account-recovery-removed',
    recovery: 'forgot-password',
    unblockCode: 'new-unblock',
    verify: 'welcome',
    verifyShortCode: 'welcome',
    verifyLogin: 'new-signin',
    verifyLoginCode: 'new-signin-verify-code',
    verifyPrimary: 'welcome-primary',
    verifySecondaryCode: 'welcome-secondary',
  };

  // Email template to UTM content, this is typically the main call out link/button
  // in template.
  // Please create a DB migration to add the new templates into `emailTypes`
  // when you add new templates.
  const templateNameToContentMap = {
    subscriptionAccountFinishSetup: 'subscriptions',
    subscriptionReactivation: 'subscriptions',
    subscriptionRenewalReminder: 'subscriptions',
    subscriptionUpgrade: 'subscriptions',
    subscriptionDowngrade: 'subscriptions',
    subscriptionPaymentExpired: 'subscriptions',
    subscriptionsPaymentExpired: 'subscriptions',
    subscriptionPaymentProviderCancelled: 'subscriptions',
    subscriptionsPaymentProviderCancelled: 'subscriptions',
    subscriptionPaymentFailed: 'subscriptions',
    subscriptionAccountDeletion: 'subscriptions',
    subscriptionCancellation: 'subscriptions',
    subscriptionFailedPaymentsCancellation: 'subscriptions',
    subscriptionSubsequentInvoice: 'subscriptions',
    subscriptionSubsequentInvoiceDiscount: 'subscriptions',
    subscriptionFirstInvoice: 'subscriptions',
    subscriptionFirstInvoiceDiscount: 'subscriptions',
    downloadSubscription: 'subscriptions',
    lowRecoveryCodes: 'recovery-codes',
    newDeviceLogin: 'manage-account',
    passwordChanged: 'password-change',
    passwordChangeRequired: 'password-change',
    passwordReset: 'password-reset',
    passwordResetAccountRecovery: 'create-recovery-key',
    postAddLinkedAccount: 'manage-account',
    postRemoveSecondary: 'account-email-removed',
    postVerify: 'connect-device',
    postChangePrimary: 'account-email-changed',
    postVerifySecondary: 'manage-account',
    postAddTwoStepAuthentication: 'manage-account',
    postRemoveTwoStepAuthentication: 'manage-account',
    postConsumeRecoveryCode: 'manage-account',
    postNewRecoveryCodes: 'manage-account',
    postAddAccountRecovery: 'manage-account',
    postRemoveAccountRecovery: 'manage-account',
    recovery: 'reset-password',
    unblockCode: 'unblock-code',
    verify: 'activate',
    verifyShortCode: 'activate',
    verifyLogin: 'confirm-signin',
    verifyLoginCode: 'new-signin-verify-code',
    verifyPrimary: 'activate',
    verifySecondaryCode: 'activate',
  };

  function extend(target, source) {
    for (const key in source) {
      target[key] = source[key];
    }

    return target;
  }

  // helper used to ensure strings are extracted
  function gettext(txt) {
    return txt;
  }

  function linkAttributes(url) {
    // Not very nice to have presentation code in here, but this is to help l10n
    // contributors not deal with extraneous noise in strings.
    return `href="${url}" style="color: #0a84ff; text-decoration: none; font-family: sans-serif;"`;
  }

  function constructLocalTimeString(timeZone, locale) {
    // if no timeZone is passed, use DEFAULT_TIMEZONE
    moment.tz.setDefault(DEFAULT_TIMEZONE);
    // if no locale is passed, use DEFAULT_LOCALE
    locale = locale || DEFAULT_LOCALE;
    moment.locale(locale);
    let timeMoment = moment();
    if (timeZone) {
      timeMoment = timeMoment.tz(timeZone);
    }
    // return a locale-specific time
    // if date or time is passed, return it as the current date or time
    const timeNow = timeMoment.format('LTS (z)');
    const dateNow = timeMoment.format('dddd, ll');
    return [timeNow, dateNow];
  }

  function constructLocalDateString(timeZone, locale, date) {
    // if no timeZone is passed, use DEFAULT_TIMEZONE
    moment.tz.setDefault(DEFAULT_TIMEZONE);
    // if no locale is passed, use DEFAULT_LOCALE
    locale = locale || DEFAULT_LOCALE;
    moment.locale(locale);
    let time = moment(date);
    if (timeZone) {
      time = time.tz(timeZone);
    }
    // return a locale-specific date
    return time.format('L');
  }

  // Borrowed from fxa-payments-server/src/lib/formats.ts
  // TODO: Would be nice to share this if/when TypeScript conversion reaches here.
  const baseCurrencyOptions = {
    style: 'currency',
    currencyDisplay: 'symbol',
  };

  /**
   * This returns a string that is formatted according to the given locale.
   *
   * Borrowed from fxa-payments-server/src/lib/formats.ts
   * TODO: Would be nice to share this if/when TypeScript conversion reaches here.
   *
   * @param {number} amountInCents
   * @param {string} currency
   * @param {string} locale
   */
  function getLocalizedCurrencyString(
    amountInCents,
    currency = 'usd',
    locale = 'en-US'
  ) {
    const decimal = amountInCents / 100;
    const options = { ...baseCurrencyOptions, currency };

    try {
      return new Intl.NumberFormat(locale, options).format(decimal);
    } catch (e) {
      // The exception could be a verror wrapped one.
      const cause = e.cause ? e.cause() : e;
      // If the language tag is not something Intl can handle, use 'en-US'.
      if (cause.message.endsWith('Incorrect locale information provided')) {
        return getLocalizedCurrencyString(amountInCents, currency, 'en-US');
      }
      throw e;
    }
  }

  function sesMessageTagsHeaderValue(templateName, serviceName) {
    return `messageType=fxa-${templateName}, app=fxa, service=${serviceName}`;
  }

  // These are brand names, so they probably don't need l10n.
  const CARD_TYPE_TO_TEXT = {
    amex: 'American Express',
    diners: 'Diners Club',
    discover: 'Discover',
    jcb: 'JCB',
    mastercard: 'MasterCard',
    unionpay: 'UnionPay',
    visa: 'Visa',
    unknown: 'Unknown',
  };

  function cardTypeToText(cardType) {
    if (typeof cardType !== 'string') {
      return null;
    }
    return (
      CARD_TYPE_TO_TEXT[cardType.toLowerCase()] || CARD_TYPE_TO_TEXT.unknown
    );
  }

  function Mailer(translator, mailerConfig, sender) {
    let options = {
      host: mailerConfig.host,
      secure: mailerConfig.secure,
      ignoreTLS: !mailerConfig.secure,
      port: mailerConfig.port,
      pool: mailerConfig.pool,
      maxConnections: mailerConfig.maxConnections,
      maxMessages: mailerConfig.maxMessages,
    };

    if (mailerConfig.user && mailerConfig.password) {
      options.auth = {
        user: mailerConfig.user,
        pass: mailerConfig.password,
      };
    } else {
      const ses = new AWS.SES({ apiVersion: '2010-12-01' });
      options = {
        SES: { ses },
        sendingRate: 5,
        maxConnections: 10,
      };
    }

    this.accountSettingsUrl = mailerConfig.accountSettingsUrl;
    this.accountRecoveryCodesUrl = mailerConfig.accountRecoveryCodesUrl;
    this.androidUrl = mailerConfig.androidUrl;
    this.createAccountRecoveryUrl = mailerConfig.createAccountRecoveryUrl;
    this.accountFinishSetupUrl = mailerConfig.accountFinishSetupUrl;
    this.initiatePasswordChangeUrl = mailerConfig.initiatePasswordChangeUrl;
    this.initiatePasswordResetUrl = mailerConfig.initiatePasswordResetUrl;
    this.iosUrl = mailerConfig.iosUrl;
    this.iosAdjustUrl = mailerConfig.iosAdjustUrl;
    this.mailer = sender || nodemailer.createTransport(options);
    this.passwordManagerInfoUrl = mailerConfig.passwordManagerInfoUrl;
    this.passwordResetUrl = mailerConfig.passwordResetUrl;
    this.prependVerificationSubdomain =
      mailerConfig.prependVerificationSubdomain;
    this.privacyUrl = mailerConfig.privacyUrl;
    this.reportSignInUrl = mailerConfig.reportSignInUrl;
    this.revokeAccountRecoveryUrl = mailerConfig.revokeAccountRecoveryUrl;
    this.sender = mailerConfig.sender;
    this.sesConfigurationSet = mailerConfig.sesConfigurationSet;
    this.subscriptionSettingsUrl = mailerConfig.subscriptionSettingsUrl;
    this.subscriptionSupportUrl = mailerConfig.subscriptionSupportUrl;
    this.subscriptionTermsUrl = mailerConfig.subscriptionTermsUrl;
    this.supportUrl = mailerConfig.supportUrl;
    this.syncUrl = mailerConfig.syncUrl;
    this.translator = translator.getTranslator;
    this.verificationUrl = mailerConfig.verificationUrl;
    this.verifyLoginUrl = mailerConfig.verifyLoginUrl;
    this.verifyPrimaryEmailUrl = mailerConfig.verifyPrimaryEmailUrl;
    this.renderer = new Renderer(new NodeRendererBindings());
    this.metricsEnabled = true;
  }

  Mailer.prototype.stop = function () {
    this.mailer.close();
  };

  Mailer.prototype._supportLinkAttributes = function (templateName) {
    return linkAttributes(this.createSupportLink(templateName));
  };

  Mailer.prototype._passwordResetLinkAttributes = function (
    email,
    templateName,
    emailToHashWith
  ) {
    return linkAttributes(
      this.createPasswordResetLink(email, templateName, emailToHashWith)
    );
  };

  Mailer.prototype._passwordChangeLinkAttributes = function (
    email,
    templateName
  ) {
    return linkAttributes(this.createPasswordChangeLink(email, templateName));
  };

  Mailer.prototype._formatUserAgentInfo = function (message) {
    // Build a first cut at a device description,
    // without using any new strings.
    // Future iterations can localize this better.
    const translator = this.translator(message.acceptLanguage);
    const uaBrowser = safeUserAgent.name(message.uaBrowser);
    const uaOS = safeUserAgent.name(message.uaOS);
    const uaOSVersion = safeUserAgent.version(message.uaOSVersion);

    if (uaBrowser && uaOS && uaOSVersion) {
      return translator.format(
        translator.gettext('%(uaBrowser)s on %(uaOS)s %(uaOSVersion)s'),
        { uaBrowser: uaBrowser, uaOS: uaOS, uaOSVersion: uaOSVersion }
      );
    } else if (uaBrowser && uaOS) {
      return translator.format(
        translator.gettext('%(uaBrowser)s on %(uaOS)s'),
        { uaBrowser: uaBrowser, uaOS: uaOS }
      );
    } else {
      if (uaBrowser) {
        return uaBrowser;
      } else if (uaOS) {
        if (uaOSVersion) {
          const parts = `${uaOS} ${uaOSVersion}`;
          return parts;
        } else {
          return uaOS;
        }
      } else {
        return '';
      }
    }
  };

  Mailer.prototype._constructLocationString = function (message) {
    const translator = this.translator(message.acceptLanguage);
    const location = message.location;
    // construct the location string from the location object
    if (location) {
      if (location.city && location.stateCode) {
        return translator.format(
          translator.gettext(
            '%(city)s, %(stateCode)s, %(country)s (estimated)'
          ),
          location
        );
      } else if (location.city) {
        return translator.format(
          translator.gettext('%(city)s, %(country)s (estimated)'),
          location
        );
      } else if (location.stateCode) {
        return translator.format(
          translator.gettext('%(stateCode)s, %(country)s (estimated)'),
          location
        );
      } else {
        return translator.format(
          translator.gettext('%(country)s (estimated)'),
          location
        );
      }
    }
    return '';
  };

  Mailer.prototype._constructLocalTimeString = function (
    timeZone,
    acceptLanguage
  ) {
    return constructLocalTimeString(timeZone, acceptLanguage);
  };

  Mailer.prototype._constructLocalDateString = function (
    timeZone,
    acceptLanguage,
    date
  ) {
    const translator = this.translator(acceptLanguage);
    return constructLocalDateString(timeZone, translator.language, date);
  };

  Mailer.prototype._getLocalizedCurrencyString = function (
    amountInCents,
    currency,
    acceptLanguage
  ) {
    return getLocalizedCurrencyString(
      amountInCents,
      currency,
      // parse outputs them in 'quality' sorted order
      i18n.parseAcceptLanguage(acceptLanguage).map((a) => a.lang)
    );
  };

  Mailer.prototype.localize = async function (message) {
    const translator = this.translator(message.acceptLanguage);
    message.layout = message.layout || 'fxa';

    const { html, text, subject } = await this.renderer.renderEmail(message);

    return {
      html,
      language: translator.language,
      subject,
      text,
    };
  };

  Mailer.prototype.send = async function (message) {
    log.trace(`mailer.${message.template}`, {
      email: message.email,
      uid: message.uid,
    });
    const localized = await this.localize(message);

    const template = message.template;
    let templateVersion = TEMPLATE_VERSIONS[template];
    if (!templateVersion) {
      log.error('emailTemplateVersion.missing', { template });
      templateVersion = 1;
    }
    message.templateVersion = templateVersion;

    const headers = {
      'Content-Language': localized.language,
      'X-Template-Name': template,
      'X-Template-Version': templateVersion,
      ...message.headers,
      ...optionalHeader('X-Device-Id', message.deviceId),
      ...optionalHeader('X-Flow-Id', message.flowId),
      ...optionalHeader('X-Flow-Begin-Time', message.flowBeginTime),
      ...optionalHeader('X-Service-Id', message.service),
      ...optionalHeader('X-Uid', message.uid),
    };

    const to = message.email;

    try {
      await bounces.check(to, template);
    } catch (err) {
      log.error('email.bounce.limit', {
        err: err.message,
        errno: err.errno,
        to,
        template,
      });
      throw err;
    }

    if (this.sesConfigurationSet) {
      // Note on SES Event Publishing: The X-SES-CONFIGURATION-SET and
      // X-SES-MESSAGE-TAGS email headers will be stripped by SES from the
      // actual outgoing email messages.
      headers[X_SES_CONFIGURATION_SET] = this.sesConfigurationSet;
      headers[X_SES_MESSAGE_TAGS] = sesMessageTagsHeaderValue(
        message.metricsTemplate || template,
        'fxa-auth-server'
      );
    }

    log.debug('mailer.send', {
      email: to,
      template,
      headers: Object.keys(headers).join(','),
    });

    const emailConfig = {
      sender: this.sender,
      from: this.sender,
      to,
      subject: localized.subject,
      text: localized.text,
      html: localized.html,
      xMailer: false,
      headers,
    };

    if (message.ccEmails) {
      emailConfig.cc = message.ccEmails;
    }

    await new Promise((resolve, reject) => {
      this.mailer.sendMail(emailConfig, (err, status) => {
        if (err) {
          log.error('mailer.send.error', {
            err: err.message,
            code: err.code,
            errno: err.errno,
            message: status && status.message,
            to: emailConfig && emailConfig.to,
            template,
          });

          return reject(err);
        }

        log.debug('mailer.send.1', {
          status: status && status.message,
          id: status && status.messageId,
          to: emailConfig && emailConfig.to,
        });

        emailUtils.logEmailEventSent(log, {
          ...message,
          headers,
        });

        return resolve(status);
      });
    });
  };

  Mailer.prototype.verifyEmail = async function (message) {
    log.trace('mailer.verifyEmail', { email: message.email, uid: message.uid });

    const templateName = 'verify';
    const query = {
      uid: message.uid,
      code: message.code,
    };

    if (message.service) {
      query.service = message.service;
    }
    if (message.redirectTo) {
      query.redirectTo = message.redirectTo;
    }
    if (message.resume) {
      query.resume = message.resume;
    }
    if (message.style) {
      query.style = message.style;
    }

    const links = this._generateLinks(
      this.verificationUrl,
      message,
      query,
      templateName
    );

    const headers = {
      'X-Link': links.link,
      'X-Verify-Code': message.code,
    };

    const clientInfo = await oauthClientInfo.fetch(message.service);
    const serviceName = clientInfo.name;

    return this.send({
      ...message,
      headers,
      template: templateName,
      templateValues: {
        device: this._formatUserAgentInfo(message),
        email: message.email,
        ip: message.ip,
        link: links.link,
        location: this._constructLocationString(message),
        oneClickLink: links.oneClickLink,
        privacyUrl: links.privacyUrl,
        serviceName: serviceName,
        style: message.style,
        supportLinkAttributes: links.supportLinkAttributes,
        supportUrl: links.supportUrl,
        sync: message.service === 'sync',
      },
    });
  };

  Mailer.prototype.verifyShortCodeEmail = async function (message) {
    log.trace('mailer.verifyShortCodeEmail', {
      email: message.email,
      uid: message.uid,
    });

    const templateName = 'verifyShortCode';
    const metricsTemplateName = 'verify';
    const code = message.code;
    const subject = gettext('Verification code: %(code)s');

    const links = this._generateLinks(
      this.verificationUrl,
      message,
      {},
      templateName
    );
    const [time, date] = this._constructLocalTimeString(
      message.timeZone,
      message.acceptLanguage
    );

    const headers = {
      'X-Verify-Short-Code': code,
    };

    return this.send({
      ...message,
      headers,
      metricsTemplate: metricsTemplateName,
      subject,
      template: templateName,
      templateValues: {
        code,
        date,
        device: this._formatUserAgentInfo(message),
        email: message.email,
        ip: message.ip,
        location: this._constructLocationString(message),
        privacyUrl: links.privacyUrl,
        subject,
        supportLinkAttributes: links.supportLinkAttributes,
        supportUrl: links.supportUrl,
        time,
        preHeader: 'Copy/paste this code into your registration form.',
      },
    });
  };

  verificationReminders.keys.forEach((key, index) => {
    // Template names are generated in the form `verificationReminderFirstEmail`,
    // where `First` is the key derived from config, with an initial capital letter.
    const template = `verificationReminder${key[0].toUpperCase()}${key.substr(
      1
    )}`;
    let subject;
    if (index < verificationReminders.keys.length - 1) {
      subject = gettext('Reminder: Finish creating your account');
    } else {
      subject = gettext('Final reminder: Activate your account');
    }

    templateNameToCampaignMap[template] = `${key}-verification-reminder`;
    templateNameToContentMap[template] = 'confirm-email';

    Mailer.prototype[`${template}Email`] = async function (message) {
      const { code, email, uid } = message;

      log.trace(`mailer.${template}`, { code, email, uid });

      const query = { code, reminder: key, uid };
      const links = this._generateLinks(
        this.verificationUrl,
        message,
        query,
        template
      );
      const action = gettext('Confirm email');
      const headers = {
        'X-Link': links.link,
        'X-Verify-Code': code,
      };

      return this.send({
        ...message,
        headers,
        subject,
        template,
        templateValues: {
          action,
          email,
          link: links.link,
          oneClickLink: links.oneClickLink,
          privacyUrl: links.privacyUrl,
          subject,
          supportUrl: links.supportUrl,
          supportLinkAttributes: links.supportLinkAttributes,
        },
      });
    };
  });

  subscriptionAccountReminders.keys.forEach((key, index) => {
    // Template names are generated in the form `verificationReminderFirstEmail`,
    // where `First` is the key derived from config, with an initial capital letter.
    const template = `subscriptionAccountReminder${key[0].toUpperCase()}${key.substr(
      1
    )}`;
    let subject;
    if (index < subscriptionAccountReminders.keys.length - 1) {
      subject = gettext('Reminder: Finish setting up your account');
    } else {
      subject = gettext('Final reminder: Setup your account');
    }

    templateNameToCampaignMap[
      template
    ] = `${key}-subscription-account-reminder`;
    templateNameToContentMap[template] = 'subscription-account-create-email';

    Mailer.prototype[`${template}Email`] = async function (message) {
      const {
        email,
        uid,
        productId,
        productName,
        token,
        flowId,
        flowBeginTime,
        deviceId,
      } = message;

      log.trace(`mailer.${template}`, { email, uid });

      const query = {
        email,
        product_name: productName,
        token,
        product_id: productId,
        flowId,
        flowBeginTime,
        deviceId,
      };

      const links = this._generateLinks(
        this.accountFinishSetupUrl,
        message,
        query,
        template
      );
      const headers = {
        'X-Link': links.link,
      };

      const action = gettext('Create a password');

      return this.send({
        ...message,
        headers,
        layout: 'subscription',
        subject,
        template,
        templateValues: {
          action,
          email,
          ...links,
          oneClickLink: links.oneClickLink,
          privacyUrl: links.privacyUrl,
          termsOfServiceDownloadURL: links.termsOfServiceDownloadURL,
          subject,
          supportUrl: links.supportUrl,
          supportLinkAttributes: links.supportLinkAttributes,
          reminderShortForm: true,
        },
      });
    };
  });

  Mailer.prototype.unblockCodeEmail = function (message) {
    log.trace('mailer.unblockCodeEmail', {
      email: message.email,
      uid: message.uid,
    });

    const templateName = 'unblockCode';
    const query = {
      unblockCode: message.unblockCode,
      email: message.email,
      uid: message.uid,
    };
    const subject = gettext('Account authorization code');

    const links = this._generateLinks(null, message, query, templateName);
    const [time, date] = this._constructLocalTimeString(
      message.timeZone,
      message.acceptLanguage
    );

    const headers = {
      'X-Unblock-Code': message.unblockCode,
      'X-Report-SignIn-Link': links.reportSignInLink,
    };

    return this.send({
      ...message,
      headers,
      subject,
      template: templateName,
      templateValues: {
        date,
        device: this._formatUserAgentInfo(message),
        email: message.email,
        ip: message.ip,
        location: this._constructLocationString(message),
        privacyUrl: links.privacyUrl,
        reportSignInLink: links.reportSignInLink,
        reportSignInLinkAttributes: links.reportSignInLinkAttributes,
        subject,
        time,
        unblockCode: message.unblockCode,
      },
    });
  };

  Mailer.prototype.verifyLoginEmail = function (message) {
    log.trace('mailer.verifyLoginEmail', {
      email: message.email,
      uid: message.uid,
    });

    const templateName = 'verifyLogin';
    const query = {
      code: message.code,
      uid: message.uid,
    };
    const translator = this.translator(message.acceptLanguage);

    if (message.service) {
      query.service = message.service;
    }
    if (message.redirectTo) {
      query.redirectTo = message.redirectTo;
    }
    if (message.resume) {
      query.resume = message.resume;
    }

    const links = this._generateLinks(
      this.verifyLoginUrl,
      message,
      query,
      templateName
    );

    const headers = {
      'X-Link': links.link,
      'X-Verify-Code': message.code,
    };

    return oauthClientInfo.fetch(message.service).then((clientInfo) => {
      const clientName = clientInfo.name;
      const subject = translator.gettext(
        'Confirm new sign-in to %(clientName)s'
      );
      const action = gettext('Confirm sign-in');
      const [time, date] = this._constructLocalTimeString(
        message.timeZone,
        message.acceptLanguage
      );

      return this.send({
        ...message,
        headers,
        subject,
        template: templateName,
        templateValues: {
          action,
          clientName,
          date,
          device: this._formatUserAgentInfo(message),
          email: message.email,
          ip: message.ip,
          link: links.link,
          location: this._constructLocationString(message),
          oneClickLink: links.oneClickLink,
          passwordChangeLink: links.passwordChangeLink,
          passwordChangeLinkAttributes: links.passwordChangeLinkAttributes,
          privacyUrl: links.privacyUrl,
          subject,
          supportLinkAttributes: links.supportLinkAttributes,
          supportUrl: links.supportUrl,
          time,
        },
      });
    });
  };

  Mailer.prototype.verifyLoginCodeEmail = async function (message) {
    log.trace('mailer.verifyLoginCodeEmail', {
      email: message.email,
      uid: message.uid,
    });

    const templateName = 'verifyLoginCode';
    const query = {
      code: message.code,
      uid: message.uid,
    };

    if (message.service) {
      query.service = message.service;
    }
    if (message.redirectTo) {
      query.redirectTo = message.redirectTo;
    }
    if (message.resume) {
      query.resume = message.resume;
    }

    const links = this._generateLinks(
      this.verifyLoginUrl,
      message,
      query,
      templateName
    );
    const [time, date] = this._constructLocalTimeString(
      message.timeZone,
      message.acceptLanguage
    );

    const headers = {
      'X-Signin-Verify-Code': message.code,
    };

    const { name: serviceName } = await oauthClientInfo.fetch(message.service);

    return this.send({
      ...message,
      headers,
      template: templateName,
      templateValues: {
        code: message.code,
        date,
        device: this._formatUserAgentInfo(message),
        email: message.email,
        ip: message.ip,
        location: this._constructLocationString(message),
        passwordChangeLink: links.passwordChangeLink,
        passwordChangeLinkAttributes: links.passwordChangeLinkAttributes,
        privacyUrl: links.privacyUrl,
        serviceName,
        supportLinkAttributes: links.supportLinkAttributes,
        supportUrl: links.supportUrl,
        time,
        tokenCode: message.code,
      },
    });
  };

  Mailer.prototype.verifyPrimaryEmail = function (message) {
    log.trace('mailer.verifyPrimaryEmail', {
      email: message.email,
      uid: message.uid,
    });

    const templateName = 'verifyPrimary';
    const query = {
      code: message.code,
      uid: message.uid,
      type: 'primary',
      primary_email_verified: message.email,
    };

    const subject = gettext('Confirm primary email');
    const action = gettext('Verify email');

    if (message.service) {
      query.service = message.service;
    }
    if (message.redirectTo) {
      query.redirectTo = message.redirectTo;
    }
    if (message.resume) {
      query.resume = message.resume;
    }

    const links = this._generateLinks(
      this.verifyPrimaryEmailUrl,
      message,
      query,
      templateName
    );
    const [time, date] = this._constructLocalTimeString(
      message.timeZone,
      message.acceptLanguage
    );

    const headers = {
      'X-Link': links.link,
      'X-Verify-Code': message.code,
    };

    return this.send({
      ...message,
      headers,
      subject,
      template: templateName,
      templateValues: {
        action,
        date,
        device: this._formatUserAgentInfo(message),
        email: message.primaryEmail,
        ip: message.ip,
        link: links.link,
        location: this._constructLocationString(message),
        oneClickLink: links.oneClickLink,
        passwordChangeLink: links.passwordChangeLink,
        passwordChangeLinkAttributes: links.passwordChangeLinkAttributes,
        privacyUrl: links.privacyUrl,
        subject,
        supportLinkAttributes: links.supportLinkAttributes,
        supportUrl: links.supportUrl,
        time,
      },
    });
  };

  Mailer.prototype.verifySecondaryCodeEmail = function (message) {
    log.trace('mailer.verifySecondaryCodeEmail', {
      email: message.email,
      uid: message.uid,
    });

    const templateName = 'verifySecondaryCode';
    const subject = gettext('Confirm secondary email');
    const action = gettext('Verify email');

    const links = this._generateLinks(undefined, message, {}, templateName);
    const [time, date] = this._constructLocalTimeString(
      message.timeZone,
      message.acceptLanguage
    );

    const headers = {
      'X-Verify-Code': message.code,
    };

    return this.send({
      ...message,
      headers,
      subject,
      template: templateName,
      templateValues: {
        action,
        code: message.code,
        date,
        device: this._formatUserAgentInfo(message),
        email: message.email,
        ip: message.ip,
        location: this._constructLocationString(message),
        passwordChangeLink: links.passwordChangeLink,
        passwordChangeLinkAttributes: links.passwordChangeLinkAttributes,
        primaryEmail: message.primaryEmail,
        privacyUrl: links.privacyUrl,
        subject,
        supportLinkAttributes: links.supportLinkAttributes,
        supportUrl: links.supportUrl,
        time,
      },
    });
  };

  Mailer.prototype.recoveryEmail = function (message) {
    const templateName = 'recovery';
    const query = {
      uid: message.uid,
      token: message.token,
      code: message.code,
      email: message.email,
    };
    if (message.service) {
      query.service = message.service;
    }
    if (message.redirectTo) {
      query.redirectTo = message.redirectTo;
    }
    if (message.resume) {
      query.resume = message.resume;
    }
    if (message.emailToHashWith) {
      query.emailToHashWith = message.emailToHashWith;
    }
    const subject = gettext('Reset your password');
    const action = gettext('Create new password');

    const links = this._generateLinks(
      this.passwordResetUrl,
      message,
      query,
      templateName
    );
    const [time, date] = this._constructLocalTimeString(
      message.timeZone,
      message.acceptLanguage
    );

    const headers = {
      'X-Link': links.link,
      'X-Recovery-Code': message.code,
    };

    return this.send({
      ...message,
      headers,
      subject,
      template: templateName,
      templateValues: {
        action,
        code: message.code,
        date,
        device: this._formatUserAgentInfo(message),
        email: message.email,
        ip: message.ip,
        link: links.link,
        location: this._constructLocationString(message),
        privacyUrl: links.privacyUrl,
        subject,
        supportLinkAttributes: links.supportLinkAttributes,
        supportUrl: links.supportUrl,
        time,
      },
    });
  };

  Mailer.prototype.passwordChangedEmail = function (message) {
    const templateName = 'passwordChanged';
    const subject = gettext('Password updated');

    const links = this._generateLinks(
      this.initiatePasswordResetUrl,
      message,
      {},
      templateName
    );
    const [time, date] = this._constructLocalTimeString(
      message.timeZone,
      message.acceptLanguage
    );

    const headers = {
      'X-Link': links.resetLink,
    };

    return this.send({
      ...message,
      headers,
      subject,
      template: templateName,
      templateValues: {
        date,
        device: this._formatUserAgentInfo(message),
        ip: message.ip,
        location: this._constructLocationString(message),
        privacyUrl: links.privacyUrl,
        resetLink: links.resetLink,
        resetLinkAttributes: links.resetLinkAttributes,
        subject,
        supportLinkAttributes: links.supportLinkAttributes,
        supportUrl: links.supportUrl,
        time,
      },
    });
  };

  Mailer.prototype.passwordChangeRequiredEmail = function (message) {
    const templateName = 'passwordChangeRequired';
    const subject = gettext('Suspicious activity detected');
    const links = this._generateLinks(
      this.initiatePasswordChangeUrl,
      message,
      {},
      templateName
    );

    const headers = {
      'X-Link': links.passwordChangeLink,
    };

    return this.send({
      ...message,
      headers,
      subject,
      template: templateName,
      templateValues: {
        passwordManagerInfoUrl: links.passwordManagerInfoUrl,
        privacyUrl: links.privacyUrl,
        resetLink: links.resetLink,
        supportUrl: links.supportUrl,
        subject,
      },
    });
  };

  Mailer.prototype.passwordResetEmail = function (message) {
    const templateName = 'passwordReset';
    const subject = gettext('Password updated');
    const links = this._generateLinks(
      this.initiatePasswordResetUrl,
      message,
      {},
      templateName
    );

    const headers = {
      'X-Link': links.resetLink,
    };

    return this.send({
      ...message,
      headers,
      subject,
      template: templateName,
      templateValues: {
        privacyUrl: links.privacyUrl,
        resetLink: links.resetLink,
        resetLinkAttributes: links.resetLinkAttributes,
        subject,
        supportLinkAttributes: links.supportLinkAttributes,
        supportUrl: links.supportUrl,
      },
    });
  };

  Mailer.prototype.postAddLinkedAccountEmail = function (message) {
    log.trace('mailer.postAddLinkedAccountEmail', {
      email: message.email,
      uid: message.uid,
    });

    const templateName = 'postAddLinkedAccount';
    const links = this._generateSettingLinks(message, templateName);
    const translator = this.translator(message.acceptLanguage);

    const subject = translator.gettext('New account linked to Firefox');
    const action = gettext('Manage account');
    const [time, date] = this._constructLocalTimeString(
      message.timeZone,
      message.acceptLanguage
    );

    const headers = {
      'X-Link': links.passwordChangeLink,
      'X-Linked-Account-Provider-Id': message.providerName,
    };

    return this.send({
      ...message,
      headers,
      subject,
      template: templateName,
      templateValues: {
        action,
        date,
        device: this._formatUserAgentInfo(message),
        ip: message.ip,
        link: links.link,
        location: this._constructLocationString(message),
        passwordChangeLink: links.passwordChangeLink,
        passwordChangeLinkAttributes: links.passwordChangeLinkAttributes,
        privacyUrl: links.privacyUrl,
        providerName: message.providerName,
        subject,
        supportLinkAttributes: links.supportLinkAttributes,
        supportUrl: links.supportUrl,
        time,
      },
    });
  };

  Mailer.prototype.newDeviceLoginEmail = function (message) {
    log.trace('mailer.newDeviceLoginEmail', {
      email: message.email,
      uid: message.uid,
    });
    const templateName = 'newDeviceLogin';
    const links = this._generateSettingLinks(message, templateName);
    const translator = this.translator(message.acceptLanguage);

    const headers = {
      'X-Link': links.passwordChangeLink,
    };

    return oauthClientInfo.fetch(message.service).then((clientInfo) => {
      const clientName = clientInfo.name;
      const subject = translator.gettext('New sign-in to %(clientName)s');
      const action = gettext('Manage account');
      const [time, date] = this._constructLocalTimeString(
        message.timeZone,
        message.acceptLanguage
      );

      return this.send({
        ...message,
        headers,
        subject,
        template: templateName,
        templateValues: {
          action,
          clientName,
          date,
          device: this._formatUserAgentInfo(message),
          ip: message.ip,
          link: links.link,
          location: this._constructLocationString(message),
          passwordChangeLink: links.passwordChangeLink,
          passwordChangeLinkAttributes: links.passwordChangeLinkAttributes,
          privacyUrl: links.privacyUrl,
          subject,
          supportLinkAttributes: links.supportLinkAttributes,
          supportUrl: links.supportUrl,
          time,
        },
      });
    });
  };

  Mailer.prototype.postVerifyEmail = function (message) {
    log.trace('mailer.postVerifyEmail', {
      email: message.email,
      uid: message.uid,
    });
    const onDesktopOrTabletDevice = !message.onMobileDevice;
    const templateName = 'postVerify';
    const subject = gettext(
      'Account verified. Next, sync another device to finish setup'
    );
    const query = {};

    const action = gettext('Set up next device');

    const links = this._generateLinks(
      this.syncUrl,
      message,
      query,
      templateName
    );

    const headers = {
      'X-Link': links.link,
    };

    return this.send({
      ...message,
      headers,
      subject,
      template: templateName,
      templateValues: {
        action,
        onDesktopOrTabletDevice,
        androidLinkAttributes: linkAttributes(links.androidLink),
        androidUrl: links.androidLink,
        cadLinkAttributes: linkAttributes(links.link),
        desktopLink: config.smtp.firefoxDesktopUrl,
        desktopLinkAttributes: linkAttributes(config.smtp.firefoxDesktopUrl),
        iosLinkAttributes: linkAttributes(links.iosLink),
        iosUrl: links.iosLink,
        link: links.link,
        privacyUrl: links.privacyUrl,
        style: message.style,
        subject,
        supportLinkAttributes: links.supportLinkAttributes,
        supportUrl: links.supportUrl,
      },
    });
  };

  Mailer.prototype.postVerifySecondaryEmail = function (message) {
    log.trace('mailer.postVerifySecondaryEmail', {
      email: message.email,
      uid: message.uid,
    });

    const templateName = 'postVerifySecondary';
    const links = this._generateSettingLinks(message, templateName);
    const subject = gettext('Secondary email added');
    const action = gettext('Manage account');

    const headers = {
      'X-Link': links.link,
    };

    return this.send({
      ...message,
      headers,
      subject,
      template: templateName,
      templateValues: {
        action,
        androidLink: links.androidLink,
        iosLink: links.iosLink,
        link: links.link,
        passwordChangeLink: links.passwordChangeLink,
        passwordChangeLinkAttributes: links.passwordChangeLinkAttributes,
        privacyUrl: links.privacyUrl,
        secondaryEmail: message.secondaryEmail,
        subject,
        supportLinkAttributes: links.supportLinkAttributes,
        supportUrl: links.supportUrl,
      },
    });
  };

  Mailer.prototype.postChangePrimaryEmail = function (message) {
    log.trace('mailer.postChangePrimaryEmail', {
      email: message.email,
      uid: message.uid,
    });

    const templateName = 'postChangePrimary';
    const links = this._generateSettingLinks(message, templateName);
    const subject = gettext('Primary email updated');
    const action = gettext('Manage account');

    const headers = {
      'X-Link': links.link,
    };

    return this.send({
      ...message,
      headers,
      subject,
      template: templateName,
      templateValues: {
        action,
        androidLink: links.androidLink,
        email: message.email,
        iosLink: links.iosLink,
        link: links.link,
        passwordChangeLink: links.passwordChangeLink,
        passwordChangeLinkAttributes: links.passwordChangeLinkAttributes,
        privacyUrl: links.privacyUrl,
        subject,
        supportLinkAttributes: links.supportLinkAttributes,
        supportUrl: links.supportUrl,
      },
    });
  };

  Mailer.prototype.postRemoveSecondaryEmail = function (message) {
    log.trace('mailer.postRemoveSecondaryEmail', {
      email: message.email,
      uid: message.uid,
    });

    const templateName = 'postRemoveSecondary';
    const links = this._generateSettingLinks(message, templateName);
    const subject = gettext('Secondary email removed');
    const action = gettext('Manage account');

    const headers = {
      'X-Link': links.link,
    };

    return this.send({
      ...message,
      headers,
      subject,
      template: templateName,
      templateValues: {
        action,
        androidLink: links.androidLink,
        iosLink: links.iosLink,
        link: links.link,
        privacyUrl: links.privacyUrl,
        secondaryEmail: message.secondaryEmail,
        subject,
        supportLinkAttributes: links.supportLinkAttributes,
        supportUrl: links.supportUrl,
      },
    });
  };

  Mailer.prototype.postAddTwoStepAuthenticationEmail = function (message) {
    log.trace('mailer.postAddTwoStepAuthenticationEmail', {
      email: message.email,
      uid: message.uid,
    });

    const templateName = 'postAddTwoStepAuthentication';
    const links = this._generateSettingLinks(message, templateName);
    const subject = gettext('Two-step authentication enabled');
    const action = gettext('Manage account');
    const [time, date] = this._constructLocalTimeString(
      message.timeZone,
      message.acceptLanguage
    );

    const headers = {
      'X-Link': links.link,
    };

    return this.send({
      ...message,
      headers,
      subject,
      template: templateName,
      templateValues: {
        action,
        androidLink: links.androidLink,
        date,
        device: this._formatUserAgentInfo(message),
        email: message.email,
        ip: message.ip,
        iosLink: links.iosLink,
        link: links.link,
        location: this._constructLocationString(message),
        passwordChangeLink: links.passwordChangeLink,
        passwordChangeLinkAttributes: links.passwordChangeLinkAttributes,
        privacyUrl: links.privacyUrl,
        subject,
        supportLinkAttributes: links.supportLinkAttributes,
        supportUrl: links.supportUrl,
        time,
      },
    });
  };

  Mailer.prototype.postRemoveTwoStepAuthenticationEmail = function (message) {
    log.trace('mailer.postRemoveTwoStepAuthenticationEmail', {
      email: message.email,
      uid: message.uid,
    });

    const templateName = 'postRemoveTwoStepAuthentication';
    const links = this._generateSettingLinks(message, templateName);
    const [time, date] = this._constructLocalTimeString(
      message.timeZone,
      message.acceptLanguage
    );

    const headers = {
      'X-Link': links.link,
    };

    return this.send({
      ...message,
      headers,
      template: templateName,
      templateValues: {
        androidLink: links.androidLink,
        date,
        device: this._formatUserAgentInfo(message),
        email: message.email,
        iosLink: links.iosLink,
        ip: message.ip,
        link: links.link,
        location: this._constructLocationString(message),
        passwordChangeLink: links.passwordChangeLink,
        passwordChangeLinkAttributes: links.passwordChangeLinkAttributes,
        privacyUrl: links.privacyUrl,
        supportLinkAttributes: links.supportLinkAttributes,
        supportUrl: links.supportUrl,
        time,
      },
    });
  };

  Mailer.prototype.postNewRecoveryCodesEmail = function (message) {
    log.trace('mailer.postNewRecoveryCodesEmail', {
      email: message.email,
      uid: message.uid,
    });

    const templateName = 'postNewRecoveryCodes';
    const links = this._generateSettingLinks(message, templateName);
    const subject = gettext('New recovery codes generated');
    const action = gettext('Manage account');
    const [time, date] = this._constructLocalTimeString(
      message.timeZone,
      message.acceptLanguage
    );

    const headers = {
      'X-Link': links.link,
    };

    return this.send({
      ...message,
      headers,
      subject,
      template: templateName,
      templateValues: {
        action,
        androidLink: links.androidLink,
        date,
        device: this._formatUserAgentInfo(message),
        email: message.email,
        iosLink: links.iosLink,
        ip: message.ip,
        link: links.link,
        location: this._constructLocationString(message),
        passwordChangeLink: links.passwordChangeLink,
        passwordChangeLinkAttributes: links.passwordChangeLinkAttributes,
        privacyUrl: links.privacyUrl,
        subject,
        supportLinkAttributes: links.supportLinkAttributes,
        supportUrl: links.supportUrl,
        time,
      },
    });
  };

  Mailer.prototype.postConsumeRecoveryCodeEmail = function (message) {
    log.trace('mailer.postConsumeRecoveryCodeEmail', {
      email: message.email,
      uid: message.uid,
    });

    const templateName = 'postConsumeRecoveryCode';
    const links = this._generateSettingLinks(message, templateName);
    const subject = gettext('Recovery code used');
    const action = gettext('Manage account');
    const [time, date] = this._constructLocalTimeString(
      message.timeZone,
      message.acceptLanguage
    );

    const headers = {
      'X-Link': links.link,
    };

    return this.send({
      ...message,
      headers,
      subject,
      template: templateName,
      templateValues: {
        action,
        androidLink: links.androidLink,
        date,
        device: this._formatUserAgentInfo(message),
        email: message.email,
        iosLink: links.iosLink,
        ip: message.ip,
        link: links.link,
        location: this._constructLocationString(message),
        passwordChangeLink: links.passwordChangeLink,
        passwordChangeLinkAttributes: links.passwordChangeLinkAttributes,
        privacyUrl: links.privacyUrl,
        subject,
        supportLinkAttributes: links.supportLinkAttributes,
        supportUrl: links.supportUrl,
        time,
      },
    });
  };

  Mailer.prototype.lowRecoveryCodesEmail = function (message) {
    const { numberRemaining } = message;

    log.trace('mailer.lowRecoveryCodesEmail', {
      email: message.email,
      uid: message.uid,
      numberRemaining,
    });

    const templateName = 'lowRecoveryCodes';
    const links = this._generateLowRecoveryCodesLinks(message, templateName);

    const headers = {
      'X-Link': links.link,
    };

    // For now, passing down the subject using gettext since email.js tests were failing
    // Fluent is still going to conditionally render the subject
    // based on numberRemaining var for the new templates
    let subject;
    if (numberRemaining === 1) {
      subject = gettext('1 recovery code remaining');
    } else {
      subject = gettext('%(numberRemaining)s recovery codes remaining');
    }

    const action = gettext('Generate codes');

    return this.send({
      ...message,
      headers,
      subject,
      template: templateName,
      templateValues: {
        action,
        androidLink: links.androidLink,
        email: message.email,
        iosLink: links.iosLink,
        link: links.link,
        numberRemaining,
        passwordChangeLink: links.passwordChangeLink,
        passwordChangeLinkAttributes: links.passwordChangeLinkAttributes,
        privacyUrl: links.privacyUrl,
        subject,
        supportLinkAttributes: links.supportLinkAttributes,
        supportUrl: links.supportUrl,
      },
    });
  };

  Mailer.prototype.postAddAccountRecoveryEmail = function (message) {
    log.trace('mailer.postAddAccountRecoveryEmail', {
      email: message.email,
      uid: message.uid,
    });

    const templateName = 'postAddAccountRecovery';
    const links = this._generateSettingLinks(message, templateName);
    const subject = gettext('Account recovery key generated');
    const action = gettext('Manage account');
    const [time, date] = this._constructLocalTimeString(
      message.timeZone,
      message.acceptLanguage
    );

    const headers = {
      'X-Link': links.link,
    };

    return this.send({
      ...message,
      headers,
      subject,
      template: templateName,
      templateValues: {
        action,
        androidLink: links.androidLink,
        date,
        device: this._formatUserAgentInfo(message),
        email: message.email,
        iosLink: links.iosLink,
        ip: message.ip,
        link: links.link,
        location: this._constructLocationString(message),
        passwordChangeLink: links.passwordChangeLink,
        passwordChangeLinkAttributes: links.passwordChangeLinkAttributes,
        privacyUrl: links.privacyUrl,
        revokeAccountRecoveryLink: links.revokeAccountRecoveryLink,
        revokeAccountRecoveryLinkAttributes:
          links.revokeAccountRecoveryLinkAttributes,
        subject,
        supportLinkAttributes: links.supportLinkAttributes,
        supportUrl: links.supportUrl,
        time,
      },
    });
  };

  Mailer.prototype.postRemoveAccountRecoveryEmail = function (message) {
    log.trace('mailer.postRemoveAccountRecoveryEmail', {
      email: message.email,
      uid: message.uid,
    });

    const templateName = 'postRemoveAccountRecovery';
    const links = this._generateSettingLinks(message, templateName);
    const subject = gettext('Account recovery key removed');
    const action = gettext('Manage account');
    const [time, date] = this._constructLocalTimeString(
      message.timeZone,
      message.acceptLanguage
    );

    const headers = {
      'X-Link': links.link,
    };

    return this.send({
      ...message,
      headers,
      subject,
      template: templateName,
      templateValues: {
        action,
        androidLink: links.androidLink,
        date,
        device: this._formatUserAgentInfo(message),
        email: message.email,
        iosLink: links.iosLink,
        ip: message.ip,
        link: links.link,
        location: this._constructLocationString(message),
        passwordChangeLink: links.passwordChangeLink,
        passwordChangeLinkAttributes: links.passwordChangeLinkAttributes,
        privacyUrl: links.privacyUrl,
        subject,
        supportLinkAttributes: links.supportLinkAttributes,
        supportUrl: links.supportUrl,
        time,
      },
    });
  };

  Mailer.prototype.passwordResetAccountRecoveryEmail = function (message) {
    log.trace('mailer.passwordResetAccountRecoveryEmail', {
      email: message.email,
      uid: message.uid,
    });

    const templateName = 'passwordResetAccountRecovery';
    const links = this._generateCreateAccountRecoveryLinks(
      message,
      templateName
    );
    const subject = gettext('Password updated using recovery key');
    const action = gettext('Create new recovery key');
    const [time, date] = this._constructLocalTimeString(
      message.timeZone,
      message.acceptLanguage
    );

    const headers = {
      'X-Link': links.link,
    };

    return this.send({
      ...message,
      headers,
      subject,
      template: templateName,
      templateValues: {
        action,
        androidLink: links.androidLink,
        date,
        device: this._formatUserAgentInfo(message),
        email: message.email,
        iosLink: links.iosLink,
        ip: message.ip,
        link: links.link,
        location: this._constructLocationString(message),
        privacyUrl: links.privacyUrl,
        passwordChangeLink: links.passwordChangeLink,
        passwordChangeLinkAttributes: links.passwordChangeLinkAttributes,
        subject,
        supportLinkAttributes: links.supportLinkAttributes,
        supportUrl: links.supportUrl,
        time,
      },
    });
  };

  Mailer.prototype.subscriptionAccountFinishSetupEmail = async function (
    message
  ) {
    const {
      email,
      uid,
      productId,
      productName,
      invoiceNumber,
      invoiceTotalInCents,
      invoiceTotalCurrency,
      planEmailIconURL,
      invoiceDate,
      nextInvoiceDate,
      token,
      flowId,
      flowBeginTime,
      deviceId,
    } = message;

    const enabled = config.subscriptions.transactionalEmails.enabled;

    log.trace('mailer.subscriptionAccountFinishSetupEmail', {
      enabled,
      email,
      productId,
      uid,
    });
    if (!enabled) {
      return;
    }

    const query = {
      email,
      product_name: productName,
      token,
      product_id: productId,
      flowId,
      flowBeginTime,
      deviceId,
    };
    const template = 'subscriptionAccountFinishSetup';
    const translator = this.translator(message.acceptLanguage);

    const links = this._generateLinks(
      this.accountFinishSetupUrl,
      message,
      query,
      template
    );
    const headers = {
      'X-Link': links.link,
    };

    const action = gettext('Create a password');
    const translatorParams = { productName };
    const subject = translator.format(
      translator.gettext(
        'Welcome to %(productName)s: Please set your password.'
      ),
      translatorParams
    );

    return this.send({
      ...message,
      headers,
      layout: 'subscription',
      subject,
      template,
      templateValues: {
        action,
        ...links,
        uid,
        email,
        productName,
        invoiceNumber,
        invoiceTotal: this._getLocalizedCurrencyString(
          invoiceTotalInCents,
          invoiceTotalCurrency,
          message.acceptLanguage
        ),
        invoiceDateOnly: this._constructLocalDateString(
          message.timeZone,
          message.acceptLanguage,
          invoiceDate
        ),
        nextInvoiceDateOnly: this._constructLocalDateString(
          message.timeZone,
          message.acceptLanguage,
          nextInvoiceDate
        ),
        icon: planEmailIconURL,
        product: productName,
        subject,
      },
    });
  };

  Mailer.prototype.subscriptionUpgradeEmail = async function (message) {
    const {
      email,
      uid,
      productId,
      planId,
      productIconURLNew,
      productIconURLOld,
      productNameOld,
      productNameNew,
      paymentAmountOldInCents,
      paymentAmountOldCurrency,
      paymentAmountNewInCents,
      paymentAmountNewCurrency,
      paymentProratedInCents,
      paymentProratedCurrency,
      productPaymentCycleNew,
      productPaymentCycleOld,
    } = message;

    const enabled = config.subscriptions.transactionalEmails.enabled;
    log.trace('mailer.subscriptionUpgrade', { enabled, email, productId, uid });
    if (!enabled) {
      return;
    }

    const query = { plan_id: planId, product_id: productId, uid };
    const template = 'subscriptionUpgrade';
    const translator = this.translator(message.acceptLanguage);

    const links = this._generateLinks(null, message, query, template);
    const headers = {};
    const translatorParams = { productNameNew };
    const subject = translator.gettext(
      'You have upgraded to %(productNameNew)s'
    );

    return this.send({
      ...message,
      headers,
      layout: 'subscription',
      subject,
      template,
      templateValues: {
        ...links,
        ...translatorParams,
        uid,
        email,
        productIconURLNew,
        productIconURLOld,
        productName: productNameNew,
        productNameOld,
        paymentAmountOld: this._getLocalizedCurrencyString(
          paymentAmountOldInCents,
          paymentAmountOldCurrency,
          message.acceptLanguage
        ),
        paymentAmountNew: this._getLocalizedCurrencyString(
          paymentAmountNewInCents,
          paymentAmountNewCurrency,
          message.acceptLanguage
        ),
        paymentProrated: this._getLocalizedCurrencyString(
          paymentProratedInCents,
          paymentProratedCurrency,
          message.acceptLanguage
        ),
        productPaymentCycleNew,
        productPaymentCycleOld,
        icon: productIconURLNew,
        product: productNameNew,
        subject: translator.format(subject, translatorParams),
      },
    });
  };

  Mailer.prototype.subscriptionDowngradeEmail = async function (message) {
    const {
      email,
      uid,
      productId,
      planId,
      productIconURLNew,
      productIconURLOld,
      productNameOld,
      productNameNew,
      paymentAmountOldInCents,
      paymentAmountOldCurrency,
      paymentAmountNewInCents,
      paymentAmountNewCurrency,
      paymentProratedInCents,
      paymentProratedCurrency,
      productPaymentCycleNew,
      productPaymentCycleOld,
    } = message;

    const enabled = config.subscriptions.transactionalEmails.enabled;
    log.trace('mailer.subscriptionDowngrade', {
      enabled,
      email,
      productId,
      uid,
    });
    if (!enabled) {
      return;
    }

    const query = { plan_id: planId, product_id: productId, uid };
    const template = 'subscriptionDowngrade';
    const translator = this.translator(message.acceptLanguage);

    const links = this._generateLinks(null, message, query, template);
    const headers = {};
    const translatorParams = { productNameNew };
    const subject = translator.gettext(
      'You have switched to %(productNameNew)s'
    );

    return this.send({
      ...message,
      headers,
      layout: 'subscription',
      subject,
      template,
      templateValues: {
        ...links,
        ...translatorParams,
        uid,
        email,
        productIconURLNew,
        productIconURLOld,
        productName: productNameNew,
        productNameOld,
        paymentAmountOld: this._getLocalizedCurrencyString(
          paymentAmountOldInCents,
          paymentAmountOldCurrency,
          message.acceptLanguage
        ),
        paymentAmountNew: this._getLocalizedCurrencyString(
          paymentAmountNewInCents,
          paymentAmountNewCurrency,
          message.acceptLanguage
        ),
        paymentProrated: this._getLocalizedCurrencyString(
          paymentProratedInCents,
          paymentProratedCurrency,
          message.acceptLanguage
        ),
        productPaymentCycleNew,
        productPaymentCycleOld,
        icon: productIconURLNew,
        product: productNameNew,
        subject: translator.format(subject, translatorParams),
      },
    });
  };

  Mailer.prototype.subscriptionPaymentExpiredEmail = async function (message) {
    const { email, uid, subscriptions } = message;

    const enabled = config.subscriptions.transactionalEmails.enabled;
    log.trace('mailer.subscriptionPaymentExpired', {
      enabled,
      email,
      uid,
    });
    if (!enabled) {
      return;
    }

    const headers = {};
    const translator = this.translator(message.acceptLanguage);

    let subject;
    let productName;
    let template = 'subscriptionPaymentExpired';
    let links = {};

    if (subscriptions.length === 1) {
      productName = subscriptions[0].productName;
      subject = translator.gettext(
        'Credit card for %(productName)s expiring soon'
      );
      links = this._generateLinks(
        null,
        message,
        {
          plan_id: subscriptions[0].planId,
          product_id: subscriptions[0].productId,
          uid,
        },
        template
      );
    } else {
      subject = translator.gettext(
        'Credit card for your subscriptions is expiring soon'
      );
      template = 'subscriptionsPaymentExpired';
      links = this._generateLinks(null, message, {}, template);
    }

    return this.send({
      ...message,
      headers,
      layout: 'subscription',
      subject,
      template,
      templateValues: {
        ...links,
        uid,
        email,
        subject,
        subscriptions,
        productName,
      },
    });
  };

  Mailer.prototype.subscriptionPaymentProviderCancelledEmail = async function (
    message
  ) {
    const { email, uid, subscriptions } = message;

    const enabled = config.subscriptions.transactionalEmails.enabled;
    log.trace('mailer.subscriptionPaymentProviderCancelled', {
      enabled,
      email,
      uid,
    });
    if (!enabled) {
      return;
    }

    const headers = {};
    const translator = this.translator(message.acceptLanguage);

    let subject;
    let productName;
    let template = 'subscriptionPaymentProviderCancelled';
    let links = {};

    if (subscriptions.length === 1) {
      productName = subscriptions[0].productName;
      const translatorParams = { productName };
      subject = translator.format(
        translator.gettext(
          'Payment information update required for %(productName)s'
        ),
        translatorParams
      );
      links = this._generateLinks(
        null,
        message,
        {
          plan_id: subscriptions[0].planId,
          product_id: subscriptions[0].productId,
          uid,
        },
        template
      );
    } else {
      subject = translator.gettext(
        'Payment information update required for Mozilla subscriptions'
      );
      template = 'subscriptionsPaymentProviderCancelled';
      links = this._generateLinks(null, message, {}, template);
    }

    return this.send({
      ...message,
      headers,
      layout: 'subscription',
      subject,
      template,
      templateValues: {
        ...links,
        uid,
        email,
        subject,
        subscriptions,
        productName,
      },
    });
  };

  Mailer.prototype.subscriptionPaymentFailedEmail = async function (message) {
    const { email, uid, productId, planId, planEmailIconURL, productName } =
      message;

    const enabled = config.subscriptions.transactionalEmails.enabled;
    log.trace('mailer.subscriptionPaymentFailed', {
      enabled,
      email,
      productId,
      uid,
    });
    if (!enabled) {
      return;
    }

    const query = { plan_id: planId, product_id: productId, uid };
    const template = 'subscriptionPaymentFailed';
    const translator = this.translator(message.acceptLanguage);

    const links = this._generateLinks(null, message, query, template);
    const headers = {};
    const translatorParams = { productName };
    const subject = translator.gettext('%(productName)s payment failed');

    return this.send({
      ...message,
      headers,
      layout: 'subscription',
      subject,
      template,
      templateValues: {
        ...links,
        ...translatorParams,
        uid,
        email,
        icon: planEmailIconURL,
        product: productName,
        subject: translator.format(subject, translatorParams),
      },
    });
  };

  Mailer.prototype.subscriptionAccountDeletionEmail = async function (message) {
    const {
      email,
      uid,
      productId,
      planId,
      planEmailIconURL,
      productName,
      invoiceDate,
      invoiceTotalInCents,
      invoiceTotalCurrency,
    } = message;

    const enabled = config.subscriptions.transactionalEmails.enabled;
    log.trace('mailer.subscriptionAccountDeletion', {
      enabled,
      email,
      productId,
      uid,
    });
    if (!enabled) {
      return;
    }

    const query = { plan_id: planId, product_id: productId, uid };
    const template = 'subscriptionAccountDeletion';
    const translator = this.translator(message.acceptLanguage);

    const links = this._generateLinks(null, message, query, template);
    const headers = {};
    const translatorParams = { productName };
    const subject = translator.gettext(
      'Your %(productName)s subscription has been cancelled'
    );

    return this.send({
      ...message,
      headers,
      layout: 'subscription',
      subject,
      template,
      templateValues: {
        ...links,
        ...translatorParams,
        uid,
        email,
        isCancellationEmail: true,
        invoiceDateOnly: this._constructLocalDateString(
          message.timeZone,
          message.acceptLanguage,
          invoiceDate
        ),
        icon: planEmailIconURL,
        product: productName,
        subject: translator.format(subject, translatorParams),
        invoiceTotal: this._getLocalizedCurrencyString(
          invoiceTotalInCents,
          invoiceTotalCurrency,
          message.acceptLanguage
        ),
      },
    });
  };

  Mailer.prototype.subscriptionCancellationEmail = async function (message) {
    const {
      email,
      uid,
      productId,
      planId,
      planEmailIconURL,
      productName,
      invoiceDate,
      invoiceTotalInCents,
      invoiceTotalCurrency,
      serviceLastActiveDate,
    } = message;

    const enabled = config.subscriptions.transactionalEmails.enabled;
    log.trace('mailer.subscriptionCancellation', {
      enabled,
      email,
      productId,
      uid,
    });
    if (!enabled) {
      return;
    }

    const query = { plan_id: planId, product_id: productId, uid };
    const template = 'subscriptionCancellation';
    const translator = this.translator(message.acceptLanguage);

    const links = this._generateLinks(null, message, query, template);
    const headers = {};
    const translatorParams = { productName };
    const subject = translator.gettext(
      'Your %(productName)s subscription has been cancelled'
    );

    return this.send({
      ...message,
      headers,
      layout: 'subscription',
      subject,
      template,
      templateValues: {
        ...links,
        ...translatorParams,
        uid,
        email,
        isCancellationEmail: true,
        invoiceDateOnly: this._constructLocalDateString(
          message.timeZone,
          message.acceptLanguage,
          invoiceDate
        ),
        serviceLastActiveDateOnly: this._constructLocalDateString(
          message.timeZone,
          message.acceptLanguage,
          serviceLastActiveDate
        ),
        icon: planEmailIconURL,
        product: productName,
        subject: translator.format(subject, translatorParams),
        invoiceTotal: this._getLocalizedCurrencyString(
          invoiceTotalInCents,
          invoiceTotalCurrency,
          message.acceptLanguage
        ),
      },
    });
  };

  Mailer.prototype.subscriptionFailedPaymentsCancellationEmail =
    async function (message) {
      const { email, uid, productId, planId, planEmailIconURL, productName } =
        message;

      const enabled = config.subscriptions.transactionalEmails.enabled;
      log.trace('mailer.subscriptionFailedPaymentsCancellation', {
        enabled,
        email,
        productId,
        uid,
      });
      if (!enabled) {
        return;
      }

      const query = { plan_id: planId, product_id: productId, uid };
      const template = 'subscriptionFailedPaymentsCancellation';
      const translator = this.translator(message.acceptLanguage);

      const links = this._generateLinks(null, message, query, template);
      const headers = {};
      const translatorParams = { productName };
      const subject = translator.gettext(
        'Your %(productName)s subscription has been cancelled'
      );

      return this.send({
        ...message,
        headers,
        layout: 'subscription',
        subject,
        template,
        templateValues: {
          ...links,
          ...translatorParams,
          uid,
          email,
          isCancellationEmail: true,
          icon: planEmailIconURL,
          product: productName,
          subject: translator.format(subject, translatorParams),
        },
      });
    };

  Mailer.prototype.subscriptionReactivationEmail = async function (message) {
    const {
      email,
      uid,
      productId,
      planId,
      planEmailIconURL,
      productName,
      invoiceTotalInCents,
      invoiceTotalCurrency,
      cardType,
      lastFour,
      nextInvoiceDate,
      payment_provider,
    } = message;

    const enabled = config.subscriptions.transactionalEmails.enabled;
    log.trace('mailer.subscriptionReactivation', {
      enabled,
      email,
      productId,
      uid,
    });
    if (!enabled) {
      return;
    }

    const query = { plan_id: planId, product_id: productId, uid };
    const template = 'subscriptionReactivation';
    const translator = this.translator(message.acceptLanguage);

    const links = this._generateLinks(null, message, query, template);
    const headers = {};
    const translatorParams = { productName };
    const subject = translator.gettext(
      '%(productName)s subscription reactivated'
    );

    return this.send({
      ...message,
      headers,
      layout: 'subscription',
      subject,
      template,
      templateValues: {
        ...links,
        ...translatorParams,
        uid,
        email,
        nextInvoiceDateOnly: this._constructLocalDateString(
          message.timeZone,
          message.acceptLanguage,
          nextInvoiceDate
        ),
        icon: planEmailIconURL,
        product: productName,
        subject: translator.format(subject, translatorParams),
        invoiceTotal: this._getLocalizedCurrencyString(
          invoiceTotalInCents,
          invoiceTotalCurrency,
          message.acceptLanguage
        ),
        payment_provider,
        cardType: cardTypeToText(cardType),
        lastFour,
        nextInvoiceDate,
      },
    });
  };

  Mailer.prototype.subscriptionRenewalReminderEmail = async function (message) {
    const { email, uid, subscription } = message;

    const enabled = config.subscriptions.transactionalEmails.enabled;
    log.trace('mailer.subscriptionRenewalReminderEmail', {
      enabled,
      email,
      uid,
    });
    if (!enabled) {
      return;
    }

    const headers = {};
    const translator = this.translator(message.acceptLanguage);

    const template = 'subscriptionRenewalReminder';

    const productName = subscription.productName;
    const translatorParams = { productName };
    const subject = translator.gettext(
      '%(productName)s automatic renewal notice'
    );
    const links = this._generateLinks(
      null,
      message,
      {
        plan_id: subscription.planId,
        product_id: subscription.productId,
        uid,
      },
      template
    );

    return this.send({
      ...message,
      headers,
      layout: 'subscription',
      subject,
      template,
      templateValues: {
        ...links,
        uid,
        email,
        subject: translator.format(subject, translatorParams),
        subscription,
        productName,
        reminderLength: message.reminderLength,
        planIntervalCount: message.planIntervalCount,
        planInterval: message.planInterval,
        invoiceTotal: this._getLocalizedCurrencyString(
          message.invoiceTotalInCents,
          message.invoiceTotalCurrency,
          message.acceptLanguage
        ),
      },
    });
  };

  Mailer.prototype.subscriptionSubsequentInvoiceEmail = async function (
    message
  ) {
    const {
      email,
      uid,
      productId,
      planId,
      planEmailIconURL,
      productName,
      invoiceLink,
      invoiceNumber,
      invoiceDate,
      invoiceTotalInCents,
      invoiceTotalCurrency,
      cardType,
      lastFour,
      nextInvoiceDate,
      payment_provider,
      paymentProratedInCents,
      paymentProratedCurrency,
      showPaymentMethod,
    } = message;

    const enabled = config.subscriptions.transactionalEmails.enabled;
    log.trace('mailer.subscriptionSubsequentInvoice', {
      enabled,
      email,
      productId,
      uid,
    });
    if (!enabled) {
      return;
    }

    const query = { plan_id: planId, product_id: productId, uid };
    const template = 'subscriptionSubsequentInvoice';
    const translator = this.translator(message.acceptLanguage);

    const links = this._generateLinks(null, message, query, template);
    const headers = {};
    const translatorParams = { productName };
    const subject = translator.gettext('%(productName)s payment received');

    let paymentProrated;
    let showProratedAmount = false;
    if (typeof paymentProratedInCents !== 'undefined') {
      showProratedAmount = true;
      paymentProrated = this._getLocalizedCurrencyString(
        paymentProratedInCents,
        paymentProratedCurrency,
        message.acceptLanguage
      );
    }

    return this.send({
      ...message,
      headers,
      layout: 'subscription',
      subject,
      template,
      templateValues: {
        ...links,
        ...translatorParams,
        uid,
        email,
        invoiceDateOnly: this._constructLocalDateString(
          message.timeZone,
          message.acceptLanguage,
          invoiceDate
        ),
        nextInvoiceDateOnly: this._constructLocalDateString(
          message.timeZone,
          message.acceptLanguage,
          nextInvoiceDate
        ),
        icon: planEmailIconURL,
        product: productName,
        subject: translator.format(subject, translatorParams),
        invoiceLink,
        invoiceNumber,
        invoiceDate,
        invoiceTotal: this._getLocalizedCurrencyString(
          invoiceTotalInCents,
          invoiceTotalCurrency,
          message.acceptLanguage
        ),
        payment_provider,
        cardType: cardTypeToText(cardType),
        lastFour,
        nextInvoiceDate,
        paymentProrated,
        showProratedAmount,
        showPaymentMethod,
      },
    });
  };

  Mailer.prototype.subscriptionSubsequentInvoiceDiscountEmail = async function (
    message
  ) {
    const {
      email,
      uid,
      productId,
      planId,
      planEmailIconURL,
      productName,
      invoiceLink,
      invoiceNumber,
      invoiceDate,
      invoiceTotalInCents,
      invoiceTotalCurrency,
      invoiceSubtotalInCents,
      invoiceDiscountAmountInCents,
      cardType,
      lastFour,
      nextInvoiceDate,
      payment_provider,
      paymentProratedInCents,
      paymentProratedCurrency,
      showPaymentMethod,
    } = message;

    const enabled = config.subscriptions.transactionalEmails.enabled;
    log.trace('mailer.subscriptionSubsequentInvoiceDiscount', {
      enabled,
      email,
      productId,
      uid,
    });
    if (!enabled) {
      return;
    }

    const query = { plan_id: planId, product_id: productId, uid };
    const template = 'subscriptionSubsequentInvoiceDiscount';
    const translator = this.translator(message.acceptLanguage);

    const links = this._generateLinks(null, message, query, template);
    const headers = {};
    const translatorParams = { productName };
    const subject = translator.gettext('%(productName)s payment received');

    let paymentProrated;
    let showProratedAmount = false;
    if (typeof paymentProratedInCents !== 'undefined') {
      showProratedAmount = true;
      paymentProrated = this._getLocalizedCurrencyString(
        paymentProratedInCents,
        paymentProratedCurrency,
        message.acceptLanguage
      );
    }

    return this.send({
      ...message,
      headers,
      layout: 'subscription',
      subject,
      template,
      templateValues: {
        ...links,
        ...translatorParams,
        uid,
        email,
        invoiceDateOnly: this._constructLocalDateString(
          message.timeZone,
          message.acceptLanguage,
          invoiceDate
        ),
        nextInvoiceDateOnly: this._constructLocalDateString(
          message.timeZone,
          message.acceptLanguage,
          nextInvoiceDate
        ),
        icon: planEmailIconURL,
        product: productName,
        subject: translator.format(subject, translatorParams),
        invoiceLink,
        invoiceNumber,
        invoiceDate,
        invoiceTotal: this._getLocalizedCurrencyString(
          invoiceTotalInCents,
          invoiceTotalCurrency,
          message.acceptLanguage
        ),
        invoiceSubtotal: this._getLocalizedCurrencyString(
          invoiceSubtotalInCents,
          invoiceTotalCurrency,
          message.acceptLanguage
        ),
        invoiceDiscountAmount: this._getLocalizedCurrencyString(
          invoiceDiscountAmountInCents,
          invoiceTotalCurrency,
          message.acceptLanguage
        ),
        payment_provider,
        cardType: cardTypeToText(cardType),
        lastFour,
        nextInvoiceDate,
        paymentProrated,
        showProratedAmount,
        showPaymentMethod,
      },
    });
  };

  Mailer.prototype.subscriptionFirstInvoiceEmail = async function (message) {
    const {
      email,
      uid,
      productId,
      planId,
      planEmailIconURL,
      productName,
      invoiceNumber,
      invoiceDate,
      invoiceLink,
      invoiceTotalInCents,
      invoiceTotalCurrency,
      payment_provider,
      cardType,
      lastFour,
      nextInvoiceDate,
      showPaymentMethod,
    } = message;

    const enabled = config.subscriptions.transactionalEmails.enabled;
    log.trace('mailer.subscriptionFirstInvoice', {
      enabled,
      email,
      productId,
      uid,
    });
    if (!enabled) {
      return;
    }

    const query = { plan_id: planId, product_id: productId, uid };
    const template = 'subscriptionFirstInvoice';
    const translator = this.translator(message.acceptLanguage);

    const links = this._generateLinks(null, message, query, template);
    const headers = {};
    const translatorParams = { productName };
    const subject = translator.gettext('%(productName)s payment confirmed');

    return this.send({
      ...message,
      headers,
      layout: 'subscription',
      subject,
      template,
      templateValues: {
        ...links,
        ...translatorParams,
        uid,
        email,
        invoiceDateOnly: this._constructLocalDateString(
          message.timeZone,
          message.acceptLanguage,
          invoiceDate
        ),
        nextInvoiceDateOnly: this._constructLocalDateString(
          message.timeZone,
          message.acceptLanguage,
          nextInvoiceDate
        ),
        icon: planEmailIconURL,
        product: productName,
        subject: translator.format(subject, translatorParams),
        invoiceLink,
        invoiceNumber,
        invoiceDate,
        invoiceTotal: this._getLocalizedCurrencyString(
          invoiceTotalInCents,
          invoiceTotalCurrency,
          message.acceptLanguage
        ),
        payment_provider,
        cardType: cardTypeToText(cardType),
        lastFour,
        nextInvoiceDate,
        showPaymentMethod,
      },
    });
  };

  Mailer.prototype.subscriptionFirstInvoiceDiscountEmail = async function (
    message
  ) {
    const {
      email,
      uid,
      productId,
      planId,
      planEmailIconURL,
      productName,
      invoiceNumber,
      invoiceDate,
      invoiceLink,
      invoiceTotalInCents,
      invoiceTotalCurrency,
      invoiceSubtotalInCents,
      invoiceDiscountAmountInCents,
      payment_provider,
      cardType,
      lastFour,
      nextInvoiceDate,
      showPaymentMethod,
    } = message;

    const enabled = config.subscriptions.transactionalEmails.enabled;
    log.trace('mailer.subscriptionFirstInvoiceDiscount', {
      enabled,
      email,
      productId,
      uid,
    });
    if (!enabled) {
      return;
    }

    const query = { plan_id: planId, product_id: productId, uid };
    const template = 'subscriptionFirstInvoiceDiscount';
    const translator = this.translator(message.acceptLanguage);

    const links = this._generateLinks(null, message, query, template);
    const headers = {};
    const translatorParams = { productName };
    const subject = translator.gettext('%(productName)s payment confirmed');

    return this.send({
      ...message,
      headers,
      layout: 'subscription',
      subject,
      template,
      templateValues: {
        ...links,
        ...translatorParams,
        uid,
        email,
        invoiceDateOnly: this._constructLocalDateString(
          message.timeZone,
          message.acceptLanguage,
          invoiceDate
        ),
        nextInvoiceDateOnly: this._constructLocalDateString(
          message.timeZone,
          message.acceptLanguage,
          nextInvoiceDate
        ),
        icon: planEmailIconURL,
        product: productName,
        subject: translator.format(subject, translatorParams),
        invoiceLink,
        invoiceNumber,
        invoiceDate,
        invoiceTotal: this._getLocalizedCurrencyString(
          invoiceTotalInCents,
          invoiceTotalCurrency,
          message.acceptLanguage
        ),
        invoiceSubtotal: this._getLocalizedCurrencyString(
          invoiceSubtotalInCents,
          invoiceTotalCurrency,
          message.acceptLanguage
        ),
        invoiceDiscountAmount: this._getLocalizedCurrencyString(
          invoiceDiscountAmountInCents,
          invoiceTotalCurrency,
          message.acceptLanguage
        ),
        payment_provider,
        cardType: cardTypeToText(cardType),
        lastFour,
        nextInvoiceDate,
        showPaymentMethod,
      },
    });
  };

  Mailer.prototype.downloadSubscriptionEmail = async function (message) {
    const {
      email,
      productId,
      planId,
      productName,
      planEmailIconURL,
      planDownloadURL,
      uid,
      appStoreLink,
      playStoreLink,
    } = message;

    log.trace('mailer.downloadSubscription', { email, productId, uid });

    const query = { plan_id: planId, product_id: productId, uid };
    const template = 'downloadSubscription';
    const links = this._generateLinks(
      planDownloadURL,
      message,
      query,
      template,
      appStoreLink,
      playStoreLink
    );

    const headers = {
      'X-Link': links.link,
    };

    const translatorParams = { productName, uid, email };

    return this.send({
      ...message,
      headers,
      layout: 'subscription',
      template,
      templateValues: {
        ...links,
        ...translatorParams,
        icon: planEmailIconURL,
      },
    });
  };

  cadReminders.keys.forEach((key, index) => {
    // Template names are generated in the form `cadReminderFirstEmail`,
    // where `First` is the key derived from config, with an initial capital letter.
    const template = `cadReminder${key[0].toUpperCase()}${key.substr(1)}`;

    const isFirstCadReminderEmail = index < cadReminders.keys.length - 1;

    const subject = isFirstCadReminderEmail
      ? gettext('Your Friendly Reminder: How To Complete Your Sync Setup')
      : gettext('Final Reminder: Complete Sync Setup');

    const headerText = isFirstCadReminderEmail
      ? gettext("Here's your reminder to sync devices.")
      : gettext('Last reminder to sync devices!');

    const bodyText = isFirstCadReminderEmail
      ? gettext(
          'It takes two to sync. Syncing another device with Firefox privately keeps your bookmarks, passwords and other Firefox data the same everywhere you use Firefox.'
        )
      : gettext(
          'Syncing another device with Firefox privately keeps your bookmarks, passwords and other Firefox data the same everywhere you use Firefox.'
        );

    const action = gettext('Sync another device');
    const query = {};

    templateNameToCampaignMap[template] = `cad-reminder-${key}`;
    templateNameToContentMap[template] = 'connect-device';

    Mailer.prototype[`${template}Email`] = async function (message) {
      const { code, email, uid } = message;

      log.trace(`mailer.${template}`, { code, email, uid });

      const links = this._generateLinks(this.syncUrl, message, query, template);
      const headers = {
        'X-Link': links.link,
      };

      return this.send({
        ...message,
        headers,
        subject,
        template,
        templateValues: {
          action,
          androidLinkAttributes: linkAttributes(links.androidLink),
          androidUrl: links.androidLink,
          cadLinkAttributes: linkAttributes(links.link),
          iosLinkAttributes: linkAttributes(links.iosLink),
          iosUrl: links.iosLink,
          link: links.link,
          privacyUrl: links.privacyUrl,
          style: message.style,
          subject,
          supportLinkAttributes: links.supportLinkAttributes,
          supportUrl: links.supportUrl,
          headerText,
          bodyText,
        },
      });
    };
  });

  Mailer.prototype._legalDocsRedirectUrl = function (url) {
    return `${paymentsServerURL.origin}/legal-docs?url=${encodeURIComponent(
      url
    )}`;
  };

  Mailer.prototype._generateUTMLink = function (
    link,
    query,
    templateName,
    content
  ) {
    const parsedLink = new URL(link);

    Object.keys(query).forEach((key) => {
      const value = typeof query[key] !== 'undefined' ? query[key] : '';
      parsedLink.searchParams.set(key, value);
    });

    if (this.metricsEnabled) {
      parsedLink.searchParams.set('utm_medium', 'email');

      const campaign = templateNameToCampaignMap[templateName];
      if (campaign && !parsedLink.searchParams.has('utm_campaign')) {
        parsedLink.searchParams.set('utm_campaign', UTM_PREFIX + campaign);
      }

      if (content) {
        parsedLink.searchParams.set('utm_content', UTM_PREFIX + content);
      }
    }

    const isAccountOrEmailVerification =
      link === this.verificationUrl || link === this.verifyLoginUrl;
    if (
      this.prependVerificationSubdomain.enabled &&
      isAccountOrEmailVerification
    ) {
      parsedLink.host = `${this.prependVerificationSubdomain.subdomain}.${parsedLink.host}`;
    }

    return parsedLink.toString();
  };

  Mailer.prototype._generateLinks = function (
    primaryLink,
    message,
    query,
    templateName,
    appStoreLink,
    playStoreLink
  ) {
    const { email, uid, metricsEnabled } = message;
    // set this to avoid passing `metricsEnabled` around to all link functions
    this.metricsEnabled = metricsEnabled;

    const translator = this.translator(message.acceptLanguage);
    const {
      termsOfServiceDownloadURL = this.subscriptionTermsUrl,
      privacyNoticeDownloadURL = this.privacyUrl,
    } = productDetailsFromPlan(
      {
        product_metadata: message.productMetadata,
      },
      translator.language
    );

    // Generate all possible links. The option to use a specific link
    // is left up to the template.
    const links = {};

    const utmContent = templateNameToContentMap[templateName];

    if (primaryLink && utmContent) {
      links['link'] = this._generateUTMLink(
        primaryLink,
        query,
        templateName,
        utmContent
      );
    }

    if (appStoreLink && utmContent) {
      links['appStoreLink'] = this._generateUTMLink(
        appStoreLink,
        query,
        templateName,
        utmContent
      );
    }

    if (playStoreLink && utmContent) {
      links['playStoreLink'] = this._generateUTMLink(
        playStoreLink,
        query,
        templateName,
        utmContent
      );
    }

    links['privacyUrl'] = this.createPrivacyLink(templateName);

    links['supportLinkAttributes'] = this._supportLinkAttributes(templateName);
    links['supportUrl'] = this.createSupportLink(templateName);
    links['subscriptionSupportUrl'] = this._generateUTMLink(
      this.subscriptionSupportUrl,
      {},
      templateName,
      'subscription-support'
    );

    links['passwordChangeLink'] = this.createPasswordChangeLink(
      email,
      templateName
    );
    links['passwordChangeLinkAttributes'] = this._passwordChangeLinkAttributes(
      email,
      templateName
    );

    links['resetLink'] = this.createPasswordResetLink(
      email,
      templateName,
      query.emailToHashWith
    );
    links['resetLinkAttributes'] = this._passwordResetLinkAttributes(
      email,
      templateName,
      query.emailToHashWith
    );

    links['androidLink'] = this._generateUTMLink(
      this.androidUrl,
      query,
      templateName,
      'connect-android'
    );
    links['iosLink'] = this._generateUTMLink(
      this.iosUrl,
      query,
      templateName,
      'connect-ios'
    );

    links['passwordManagerInfoUrl'] = this._generateUTMLink(
      this.passwordManagerInfoUrl,
      query,
      templateName,
      'password-info'
    );

    links['reportSignInLink'] = this.createReportSignInLink(
      templateName,
      query
    );
    links['reportSignInLinkAttributes'] = this._reportSignInLinkAttributes(
      email,
      templateName,
      query
    );

    links['revokeAccountRecoveryLink'] =
      this.createRevokeAccountRecoveryLink(templateName);
    links['revokeAccountRecoveryLinkAttributes'] =
      this._revokeAccountRecoveryLinkAttributes(templateName);

    links['createAccountRecoveryLink'] =
      this.createAccountRecoveryLink(templateName);

    links.accountSettingsUrl = this._generateUTMLink(
      this.accountSettingsUrl,
      { ...query, email, uid },
      templateName,
      'account-settings'
    );
    links.accountSettingsLinkAttributes = `href="${links.accountSettingsUrl}" target="_blank" rel="noopener noreferrer" style="color:#ffffff;font-weight:500;"`;

    links.cancellationSurveyUrl =
      'https://survey.alchemer.com/s3/6534408/Privacy-Security-Product-Cancellation-of-Service-Q4-21';

    links.cancellationSurveyLinkAttributes = `href="${links.cancellationSurveyUrl}" style="text-decoration: none; color: #0060DF;"`;

    links.subscriptionTermsUrl = this._legalDocsRedirectUrl(
      this._generateUTMLink(
        termsOfServiceDownloadURL,
        {},
        templateName,
        'subscription-terms'
      )
    );
    links.subscriptionPrivacyUrl = this._legalDocsRedirectUrl(
      this._generateUTMLink(
        privacyNoticeDownloadURL,
        {},
        templateName,
        'subscription-privacy'
      )
    );
    links.cancelSubscriptionUrl = this._generateUTMLink(
      this.subscriptionSettingsUrl,
      { ...query, email, uid },
      templateName,
      'cancel-subscription'
    );
    links.reactivateSubscriptionUrl = this._generateUTMLink(
      this.subscriptionSettingsUrl,
      { ...query, email, uid },
      templateName,
      'reactivate-subscription'
    );
    links.updateBillingUrl = this._generateUTMLink(
      this.subscriptionSettingsUrl,
      { ...query, email, uid },
      templateName,
      'update-billing'
    );

    const queryOneClick = extend(query, { one_click: true });
    if (primaryLink && utmContent) {
      links['oneClickLink'] = this._generateUTMLink(
        primaryLink,
        queryOneClick,
        templateName,
        `${utmContent}-oneclick`
      );
    }

    return links;
  };

  Mailer.prototype._generateSettingLinks = function (
    message,
    templateName,
    link = this.accountSettingsUrl
  ) {
    // Generate all possible links where the primary link is `accountSettingsUrl`.
    const query = {};
    if (message.email) {
      query.email = message.email;
    }
    if (message.uid) {
      query.uid = message.uid;
    }

    return this._generateLinks(link, message, query, templateName);
  };

  Mailer.prototype._generateLowRecoveryCodesLinks = function (
    message,
    templateName
  ) {
    // Generate all possible links where the primary link is `accountRecoveryCodesUrl`.
    const query = { low_recovery_codes: true };
    if (message.email) {
      query.email = message.email;
    }
    if (message.uid) {
      query.uid = message.uid;
    }

    return this._generateLinks(
      this.accountRecoveryCodesUrl,
      message,
      query,
      templateName
    );
  };

  Mailer.prototype._generateCreateAccountRecoveryLinks = function (
    message,
    templateName
  ) {
    // Generate all possible links where the primary link is `createAccountRecoveryUrl`.
    const query = {};
    if (message.email) {
      query.email = message.email;
    }
    if (message.uid) {
      query.uid = message.uid;
    }

    return this._generateLinks(
      this.createAccountRecoveryUrl,
      message,
      query,
      templateName
    );
  };

  Mailer.prototype.createPasswordResetLink = function (
    email,
    templateName,
    emailToHashWith
  ) {
    // Default `reset_password_confirm` to false, to show warnings about
    // resetting password and sync data
    const query = {
      email: email,
      reset_password_confirm: false,
      email_to_hash_with: emailToHashWith,
    };

    return this._generateUTMLink(
      this.initiatePasswordResetUrl,
      query,
      templateName,
      'reset-password'
    );
  };

  Mailer.prototype.createPasswordChangeLink = function (email, templateName) {
    const query = { email: email };

    return this._generateUTMLink(
      this.initiatePasswordChangeUrl,
      query,
      templateName,
      'change-password'
    );
  };

  Mailer.prototype.createReportSignInLink = function (templateName, data) {
    const query = {
      uid: data.uid,
      unblockCode: data.unblockCode,
    };
    return this._generateUTMLink(
      this.reportSignInUrl,
      query,
      templateName,
      'report'
    );
  };

  Mailer.prototype._reportSignInLinkAttributes = function (
    email,
    templateName,
    query
  ) {
    return linkAttributes(this.createReportSignInLink(templateName, query));
  };

  Mailer.prototype.createSupportLink = function (templateName) {
    return this._generateUTMLink(this.supportUrl, {}, templateName, 'support');
  };

  Mailer.prototype.createPrivacyLink = function (templateName) {
    return this._generateUTMLink(this.privacyUrl, {}, templateName, 'privacy');
  };

  Mailer.prototype.createRevokeAccountRecoveryLink = function (templateName) {
    return this._generateUTMLink(
      this.revokeAccountRecoveryUrl,
      {},
      templateName,
      'report'
    );
  };

  Mailer.prototype._revokeAccountRecoveryLinkAttributes = function (
    templateName
  ) {
    return linkAttributes(this.createRevokeAccountRecoveryLink(templateName));
  };

  Mailer.prototype.createAccountRecoveryLink = function (templateName) {
    return this._generateUTMLink(
      this.createAccountRecoveryUrl,
      {},
      templateName
    );
  };

  return Mailer;
};

function optionalHeader(key, value) {
  if (value) {
    return { [key]: value };
  }
}
