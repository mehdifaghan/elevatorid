import { apiRequest } from '../lib/api-client';
import { 
  SendOtpRequest, 
  VerifyOtpRequest, 
  TokenResponse,
  MeResponse,
  MeUpdateRequest
} from '../types/api';

export const authService = {
  // Send OTP
  sendOtp: (data: SendOtpRequest) =>
    apiRequest.post<{ success: boolean; message: string }>('/auth/send-otp', data),

  // Verify OTP and get tokens
  verifyOtp: (data: VerifyOtpRequest) =>
    apiRequest.post<TokenResponse>('/auth/verify-otp', data),

  // Refresh access token
  refreshToken: () =>
    apiRequest.post<TokenResponse>('/auth/refresh'),

  // Logout
  logout: () =>
    apiRequest.post<void>('/auth/logout'),

  // Get current user info
  getMe: () =>
    apiRequest.get<MeResponse>('/me'),

  // Update user profile/company info
  updateMe: (data: MeUpdateRequest) =>
    apiRequest.put<MeResponse>('/me', data),

  // Upload profile documents
  uploadProfileDocuments: (profileId: number, docType: string, file: File) => {
    const formData = new FormData();
    formData.append('docType', docType);
    formData.append('file', file);
    return apiRequest.upload<{ success: boolean; message: string }>(
      `/profiles/${profileId}/documents`, 
      formData
    );
  },
};