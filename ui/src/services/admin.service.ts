import { apiRequest, PaginatedResponse, SearchParams } from '../lib/api-client';
import { 
  Settings,
  SettingsUpdate,
  UserSummary,
  UserDetails,
  RequestItem,
  ComplaintItem,
  OverviewReport
} from '../types/api';

export const adminService = {
  // Dashboard
  getSystemStats: () =>
    apiRequest.get('/admin/dashboard/stats'),

  getDashboardStats: () =>
    apiRequest.get('/admin/dashboard/stats'),

  // Settings management
  getSettings: () =>
    apiRequest.get<Settings>('/admin/settings'),

  updateSettings: (data: SettingsUpdate) =>
    apiRequest.put<Settings>('/admin/settings', data),

  // User management
  getUsers: (params?: SearchParams) =>
    apiRequest.get<PaginatedResponse<UserSummary>>('/admin/users', params),

  getUser: (id: number) =>
    apiRequest.get<UserDetails>(`/admin/users/${id}`),

  createUser: (data: {
    name: string;
    mobile: string;
    scopes?: string[];
  }) =>
    apiRequest.post(`/admin/users`, data),

  updateUser: (id: number, data: {
    status?: 'active' | 'suspended' | 'pending';
    roles?: string[];
    profileTypes?: string[];
    permissions?: {
      mgmtReports?: boolean;
      partsInquiry?: boolean;
      elevatorsInquiry?: boolean;
      transferApproval?: boolean;
      userManagement?: boolean;
    };
  }) =>
    apiRequest.put(`/admin/users/${id}`, data),

  deleteUser: (id: number) =>
    apiRequest.delete(`/admin/users/${id}`),

  sendSmsToUser: (id: number, body: string) =>
    apiRequest.post(`/admin/users/${id}/sms`, { body }),

  createCoworker: (data: {
    orgName: string;
    phone: string;
    access: {
      mgmtReports: boolean;
      partsInquiry: boolean;
      elevatorsInquiry: boolean;
    };
  }) =>
    apiRequest.post('/admin/coworkers', data),

  // Request management
  getRequests: (params?: SearchParams) =>
    apiRequest.get<PaginatedResponse<RequestItem>>('/admin/requests', params),

  reviewRequest: (id: number, data: {
    status: 'approved' | 'rejected';
    rejectReason?: string;
  }) =>
    apiRequest.post(`/admin/requests/${id}/review`, data),

  // Reports
  getOverviewReport: (params?: {
    from?: string;
    to?: string;
  }) =>
    apiRequest.get<OverviewReport>('/admin/reports/overview', params),
};