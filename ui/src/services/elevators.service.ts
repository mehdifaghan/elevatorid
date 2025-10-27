import { apiRequest, PaginatedResponse } from '../lib/api-client';
import { 
  Elevator,
  ElevatorDetails,
  ElevatorCreate,
  ElevatorSearchParams,
  ElevatorPart,
  DocumentCreated
} from '../types/api';

export const elevatorsService = {
  // Elevators CRUD
  getAll: (page: number = 1, limit: number = 10, params?: ElevatorSearchParams) =>
    apiRequest.get<PaginatedResponse<Elevator>>('/elevators', { page, limit, ...params }),

  getElevators: (params?: ElevatorSearchParams) =>
    apiRequest.get<PaginatedResponse<Elevator>>('/elevators', params),

  getElevator: (id: number) =>
    apiRequest.get<ElevatorDetails>(`/elevators/${id}`),

  createElevator: (data: ElevatorCreate) =>
    apiRequest.post<{ success: boolean; data: ElevatorDetails; message: string }>('/elevators', data),

  updateElevator: (id: number, data: {
    municipalityZone?: string;
    buildPermitNo?: string;
    registryPlate?: string;
    province?: string;
    city?: string;
    address?: string;
    postalCode?: string;
  }) =>
    apiRequest.put(`/elevators/${id}`, data),

  // Parts management
  installPart: (elevatorId: number, data: {
    partId: number;
    installedAt?: string;
  }) =>
    apiRequest.post<ElevatorPart>(`/elevators/${elevatorId}/parts`, data),

  replacePart: (elevatorId: number, partId: number, data?: {
    replaceWithPartId?: number;
    removedAt?: string;
  }) =>
    apiRequest.put(`/elevators/${elevatorId}/parts/${partId}`, data),

  // Document generation
  generateElevatorPDF: (id: number) =>
    apiRequest.post<DocumentCreated>(`/elevators/${id}/pdf`),

  generateCertificate: (id: string) =>
    apiRequest.post<{ success: boolean; certificateUrl: string }>(`/elevators/${id}/certificate`),

  generateQRCode: (id: string) =>
    apiRequest.post<{ success: boolean; qrCode: string }>(`/elevators/${id}/qr`),

  updateStatus: (id: string, status: 'active' | 'maintenance' | 'out_of_order' | 'suspended') =>
    apiRequest.put(`/elevators/${id}/status`, { status }),
};