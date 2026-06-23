/** Maps Warda API auth error codes to dashboard i18n keys. */
export function authErrorMessageKey(payload: unknown): string {
  const body = payload as Record<string, unknown> | null | undefined;
  const error =
    (body?.['error'] as Record<string, unknown> | undefined) ??
    (typeof body?.['error'] === 'string' ? { message: body['error'] } : undefined);

  const code = error?.['code'];
  if (typeof code === 'string') {
    switch (code) {
      case 'Auth.InvalidDeviceId':
        return 'login.errors.invalid_device_id';
      case 'Auth.InvalidOtp':
        return 'login.errors.invalid_otp';
      case 'Auth.OtpVerifyLocked':
        return 'login.errors.otp_locked';
      case 'Auth.OtpCooldownBetweenSends':
        return 'login.errors.otp_cooldown';
      case 'Auth.CaptchaRequired':
      case 'CaptchaRequired':
        return 'login.captcha_required';
      case 'Auth.CaptchaFailed':
      case 'CaptchaFailed':
        return 'login.errors.captcha_failed';
      case 'Auth.InvalidDomesticMobileFormat':
        return 'validation_message.phoneInvalid_validation';
      case 'Auth.OtpRiskDenied':
        return 'login.errors.otp_risk_denied';
      case 'Auth.DashboardAccessDenied':
      case 'Auth.PhoneNotRegisteredForDashboard':
        return 'login.errors.dashboard_access_denied';
      default:
        break;
    }
  }

  const message = error?.['message'];
  if (typeof message === 'string' && message.trim()) {
    return message.trim();
  }

  return 'login.errors.generic';
}
