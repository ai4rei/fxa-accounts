const CRITICAL_ENDPOINTS = [
  // PORTS: 1111, 1112, 1113
  '/v1/avatar',
  '/v1/profile',
  '/v1/avatar/upload',
  '/v1/display_name',
  '/a/',
  // PORTS: 3000, 3030
  '/',
  '/settings',
  '/settings/two_step_authentication/replace_codes',
  '/sockjs-node',
  '/authorization',
  '/complete_reset_password',
  '/metrics-flow',
  '/settings',
  '/settings/two_step_authentication/replace_codes',
  '/signin',
  '/metrics',
  // PORTS: 4100
  '/',
  // PORTS: 8080
  '/',
  '/api/auth_status',
  '/api/email_first',
  '/api/oauth',
  '/api/todos/get',
  '/api/logout',
  // PORTS: 8290
  '/graphql',
  // PORTS: 9000, 9001
  '/v1/recoveryKey',
  '/v1/account',
  '/v1/account/attached_clients',
  '/v1/account/keys',
  '/v1/account/profile',
  '/v1/client/',
  '/v1/jwks',
  '/v1/oauth/subscriptions/clients',
  '/v1/password/forgot/status',
  '/v1/recovery_email/status',
  '/v1/recoveryKey/',
  '/v1/totp/exists',
  '/v1/account/attached_client/destroy',
  '/v1/account/create',
  '/v1/account/destroy',
  '/v1/account/device',
  '/v1/account/login',
  '/v1/account/login/send_unblock_code',
  '/v1/account/reset',
  '/v1/account/status',
  '/v1/oauth/authorization',
  '/v1/oauth/token',
  '/v1/password/change/finish',
  '/v1/password/change/start',
  '/v1/password/forgot/send_code',
  '/v1/password/forgot/verify_code',
  '/v1/recovery_email',
  '/v1/recovery_email/destroy',
  '/v1/recovery_email/secondary/verify_code',
  '/v1/recovery_email/set_primary',
  '/v1/recoveryKey',
  '/v1/recoveryKey/exists',
  '/v1/session/destroy',
  '/v1/session/reauth',
  '/v1/session/verify/recoveryCode',
  '/v1/session/verify/totp',
  '/v1/token',
  '/v1/totp/create',
  '/v1/totp/destroy',
  '/v1/verify',
  '/v1/recoveryCodes',
  '/mail/',
];

/**
 * Checks to see if the event is for a known critical endpoint. If so,
 * tries to add a critical.
 * @param data
 */
export function tagCriticalEvent(data: any) {
  if (data && data.request && data.request.url) {
    // It's possible value cannot be parsed.
    let url: URL | undefined;
    try {
      url = new URL(data.request.url);
    } catch (_err) {}

    if (
      url &&
      url.pathname &&
      CRITICAL_ENDPOINTS.some((x) => url?.pathname.startsWith(x))
    ) {
      data.tags = data.tags || {};
      data.tags['fxa.endpoint.type'] = 'critical';
    }
  }

  return data;
}

export function tagFxaName(data: any, name?: string) {
  data.tags = data.tags || {};
  data.tags['fxa.name'] = name || 'unknown';
  return data;
}
