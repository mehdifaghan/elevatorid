import { apiRequest, PaginatedResponse } from '../lib/api-client';
import { 
  RequestCreate,
  RequestItem,
  ComplaintCreate,
  ComplaintItem,
  PaymentCreate,
  Payment
} from '../types/api';

export const userService = {
  // Users management
  getAllUsers: (page: number = 1, limit: number = 10, params?: any) =>
    apiRequest.get<PaginatedResponse<any>>('/admin/users', { page, limit, ...params }),

  updateUserStatus: (userId: string, status: 'active' | 'inactive' | 'suspended') =>
    apiRequest.put(`/admin/users/${userId}`, { status }),

  deleteUser: (userId: string) =>
    apiRequest.delete(`/admin/users/${userId}`),

  // Requests
  getMyRequests: (params?: {
    type?: 'activation' | 'upgrade';
    status?: 'pending' | 'approved' | 'rejected';
    page?: number;
    size?: number;
  }) =>
    apiRequest.get<PaginatedResponse<RequestItem>>('/requests', params),

  createRequest: (data: RequestCreate) =>
    apiRequest.post('/requests', data),

  // Complaints
  getMyComplaints: (params?: {
    status?: 'pending' | 'in_review' | 'resolved' | 'rejected';
    page?: number;
    size?: number;
  }) =>
    apiRequest.get<PaginatedResponse<ComplaintItem>>('/complaints', params),

  createComplaint: (data: ComplaintCreate) =>
    apiRequest.post('/complaints', data),

  // Payments (if payment module is enabled)
  initiatePayment: (data: PaymentCreate) =>
    apiRequest.post<Payment>('/payments', data),

  verifyPayment: (id: number, data: {
    RefId: string;
    ResCode: string;
    SaleOrderId?: string;
    SaleReferenceId?: string;
  }) =>
    apiRequest.post<Payment>(`/payments/${id}/verify`, data),
};