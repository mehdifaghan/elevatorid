import { apiRequest } from '../lib/api-client';

export interface CaptchaResponse {
  captchaId: string;
  imageUrl: string;
  expiresIn?: number;
}

export interface CaptchaValidationRequest {
  captchaId: string;
  captchaValue: string;
}

export interface CaptchaValidationResponse {
  valid: boolean;
  message?: string;
}

export const captchaService = {
  // دریافت CAPTCHA جدید
  getCaptcha: () =>
    apiRequest.get<CaptchaResponse>('/captcha'),

  // اعتبارسنجی CAPTCHA
  validateCaptcha: (data: CaptchaValidationRequest) =>
    apiRequest.post<CaptchaValidationResponse>('/captcha/validate', data),
};