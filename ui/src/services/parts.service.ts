import { apiRequest, PaginatedResponse } from '../lib/api-client';
import { 
  Part,
  PartDetails,
  PartCreate,
  PartUpdate,
  PartSearchParams,
  PartTransfer,
  TransferRequest,
  DocumentCreated
} from '../types/api';

export const partsService = {
  // Parts CRUD
  getAllParts: () =>
    apiRequest.get<Part[]>('/parts/all'),
    
  getAll: (page: number = 1, limit: number = 10, params?: PartSearchParams) =>
    apiRequest.get<PaginatedResponse<Part>>('/parts', { page, limit, ...params }),
    
  getParts: (params?: PartSearchParams) =>
    apiRequest.get<PaginatedResponse<Part>>('/parts', params),

  getPart: (id: number) =>
    apiRequest.get<PartDetails>(`/parts/${id}`),

  createPart: (data: PartCreate) =>
    apiRequest.post<Part>('/parts', data),

  updatePart: (id: number, data: PartUpdate) =>
    apiRequest.put(`/parts/${id}`, data),

  deletePart: (id: number) =>
    apiRequest.delete(`/parts/${id}`),

  // Transfer management
  transferPart: (id: number, data: TransferRequest) =>
    apiRequest.post<PartTransfer>(`/parts/${id}/transfer`, data),

  getPartTransfers: (id: number, params?: { page?: number; size?: number }) =>
    apiRequest.get<PaginatedResponse<PartTransfer>>(`/parts/${id}/transfers`, params),

  // Document generation
  generatePartPDF: (id: number) =>
    apiRequest.post<DocumentCreated>(`/parts/${id}/pdf`),

  generateQRCode: (id: string) =>
    apiRequest.post<{ success: boolean; qrCode: string }>(`/parts/${id}/qr`),

  create: (data: PartCreate) =>
    apiRequest.post<Part>('/parts', data),

  delete: (id: string) =>
    apiRequest.delete(`/parts/${id}`),
};