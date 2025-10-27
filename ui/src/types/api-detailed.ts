// 🔥 TypeScript Interfaces for All API Endpoints

// ====================================
// 🔐 Authentication Types
// ====================================

export interface SendOtpRequest {
  mobile: string; // Pattern: ^09[0-9]{9}$
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  otpToken: string;
}

export interface VerifyOtpRequest {
  otpToken: string;
  otp: string; // Pattern: ^[0-9]{6}$
}

export interface VerifyOtpResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

// ====================================
// 👤 User Types
// ====================================

export interface User {
  id: string;
  name: string;
  mobile: string;
  role: 'admin' | 'user';
  isActive: boolean;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface CreateUserRequest {
  name: string;
  mobile: string;
  role: 'admin' | 'user';
  isActive?: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
}

export interface UsersListResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: PaginationInfo;
  };
}

export interface UserStatsResponse {
  success: boolean;
  data: {
    totalParts: number;
    totalElevators: number;
    totalTransfers: number;
    stats?: {
      totalParts: number;
      totalElevators: number;
      totalTransfers: number;
    };
  };
}

// ====================================
// 🔧 Parts Types
// ====================================

export interface Part {
  id: string;
  name: string;
  partNumber: string;
  category: string;
  description: string;
  specifications: Record<string, any>;
  status: 'available' | 'installed' | 'maintenance' | 'retired';
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt?: string;
  images: string[];
  qrCode?: string;
}

export interface CreatePartRequest {
  name: string;
  partNumber: string;
  category: string;
  description: string;
  specifications: Record<string, any>;
  images?: string[]; // Base64 encoded images
}

export interface UpdatePartRequest {
  name?: string;
  partNumber?: string;
  category?: string;
  description?: string;
  specifications?: Record<string, any>;
  images?: string[];
}

export interface PartsListResponse {
  success: boolean;
  data: {
    parts: Part[];
    pagination: PaginationInfo;
  };
}

export interface PartCategory {
  id: string;
  name: string;
  description: string;
  count: number;
}

export interface CategoriesListResponse {
  success: boolean;
  data: PartCategory[];
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface TransferPartRequest {
  recipientId: string;
  transferType: 'sale' | 'gift' | 'exchange';
  price?: number;
  notes?: string;
}

// ====================================
// 🔄 Transfer Types
// ====================================

export interface Transfer {
  id: string;
  partId: string;
  partName: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  transferType: 'sale' | 'gift' | 'exchange';
  price?: number;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  adminNotes?: string;
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
}

export interface TransfersListResponse {
  success: boolean;
  data: {
    transfers: Transfer[];
    pagination: PaginationInfo;
  };
}

export interface ApproveTransferRequest {
  adminNotes?: string;
}

export interface RejectTransferRequest {
  reason: string;
  adminNotes?: string;
}

// ====================================
// 🏢 Elevator Types
// ====================================

export interface Elevator {
  id: string;
  serialNumber: string;
  building: {
    name: string;
    address: string;
    province: string;
    city: string;
  };
  specifications: {
    capacity: string;
    floors: number;
    brand: string;
    model: string;
    installationDate: string;
  };
  ownerId: string;
  ownerName: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastInspection?: string;
  parts: ElevatorPart[];
  createdAt: string;
  updatedAt?: string;
}

export interface ElevatorPart {
  partId: string;
  partName: string;
  installedAt: string;
  installationNotes?: string;
}

export interface CreateElevatorRequest {
  serialNumber: string;
  building: {
    name: string;
    address: string;
    province: string;
    city: string;
  };
  specifications: {
    capacity: string;
    floors: number;
    brand: string;
    model: string;
    installationDate: string;
  };
}

export interface UpdateElevatorRequest {
  serialNumber?: string;
  building?: {
    name?: string;
    address?: string;
    province?: string;
    city?: string;
  };
  specifications?: {
    capacity?: string;
    floors?: number;
    brand?: string;
    model?: string;
    installationDate?: string;
  };
  status?: 'active' | 'maintenance' | 'inactive';
}

export interface ElevatorsListResponse {
  success: boolean;
  data: {
    elevators: Elevator[];
    pagination: PaginationInfo;
  };
}

export interface AddPartToElevatorRequest {
  partId: string;
  installationNotes?: string;
}

export interface ReplaceElevatorPartRequest {
  newPartId: string;
  reason: string;
  replacementNotes?: string;
}

// ====================================
// 📝 Request Types
// ====================================

export interface Request {
  id: string;
  title: string;
  description: string;
  type: 'support' | 'complaint' | 'feature_request';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt?: string;
  attachments: string[];
  responses?: RequestResponse[];
}

export interface RequestResponse {
  id: string;
  response: string;
  responderId: string;
  responderName: string;
  createdAt: string;
  internalNotes?: string;
}

export interface CreateRequestRequest {
  title: string;
  description: string;
  type: 'support' | 'complaint' | 'feature_request';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: string[]; // Base64 encoded files
}

export interface UpdateRequestRequest {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'pending' | 'in_progress' | 'resolved' | 'closed';
}

export interface RespondToRequestRequest {
  response: string;
  status?: 'pending' | 'in_progress' | 'resolved' | 'closed';
  internalNotes?: string;
}

export interface RequestsListResponse {
  success: boolean;
  data: {
    requests: Request[];
    pagination: PaginationInfo;
  };
}

// ====================================
// 📊 Dashboard & Reports Types
// ====================================

export interface AdminStatsResponse {
  success: boolean;
  data: {
    totalUsers: number;
    totalParts: number;
    totalElevators: number;
    totalTransfers: number;
    monthlyGrowth: {
      users: number;
      parts: number;
      elevators: number;
    };
    recentActivity: Activity[];
  };
}

export interface UserDashboardResponse {
  success: boolean;
  data: {
    myParts: number;
    myElevators: number;
    myTransfers: number;
    pendingRequests: number;
    recentActivity: Activity[];
  };
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  userId?: string;
  userName?: string;
}

export interface PartsReportResponse {
  success: boolean;
  data: {
    summary: {
      totalParts: number;
      newPartsThisMonth: number;
      transferredParts: number;
      categoriesBreakdown: CategoryBreakdown[];
    };
    charts: {
      monthlyTrend: ChartDataPoint[];
      categoryDistribution: ChartDataPoint[];
    };
  };
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
}

// ====================================
// 👤 Profile Types
// ====================================

export interface ProfileResponse {
  success: boolean;
  data: User;
}

export interface UpdateProfileRequest {
  name?: string;
  avatar?: string; // Base64 encoded image
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ====================================
// ⚙️ Settings Types
// ====================================

export interface SystemSettings {
  systemName: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  maxFileSize: number;
  supportedFormats: string[];
  notificationSettings: {
    emailEnabled: boolean;
    smsEnabled: boolean;
  };
}

export interface SettingsResponse {
  success: boolean;
  data: SystemSettings;
}

export interface UpdateSettingsRequest {
  systemName?: string;
  maintenanceMode?: boolean;
  registrationEnabled?: boolean;
  maxFileSize?: number;
  supportedFormats?: string[];
  notificationSettings?: {
    emailEnabled?: boolean;
    smsEnabled?: boolean;
  };
}

export interface BackupResponse {
  success: boolean;
  message: string;
  backupId: string;
  estimatedTime: string;
}

// ====================================
// 📁 Upload Types
// ====================================

export interface UploadResponse {
  success: boolean;
  data: {
    filename: string;
    url: string;
    size: number;
    type: string;
  };
}

// ====================================
// 🗺️ Geography Types
// ====================================

export interface Province {
  id: number;
  name: string;
  code: string;
  citiesCount: number;
}

export interface City {
  id: number;
  name: string;
  provinceId: number;
}

export interface ProvincesResponse {
  success: boolean;
  data: Province[];
}

export interface CitiesResponse {
  success: boolean;
  data: City[];
}

// ====================================
// 🔧 Common Types
// ====================================

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}

// ====================================
// 🔍 Query Parameters
// ====================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SearchParams {
  search?: string;
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

export interface UsersQueryParams extends PaginationParams, SearchParams {
  role?: 'admin' | 'user';
  status?: 'active' | 'inactive';
}

export interface PartsQueryParams extends PaginationParams, SearchParams {
  category?: string;
  status?: 'available' | 'installed' | 'maintenance' | 'retired';
  ownerId?: string;
}

export interface TransfersQueryParams extends PaginationParams {
  status?: 'pending' | 'approved' | 'rejected';
  type?: 'sale' | 'gift' | 'exchange';
  senderId?: string;
  recipientId?: string;
}

export interface ElevatorsQueryParams extends PaginationParams, SearchParams {
  status?: 'active' | 'maintenance' | 'inactive';
  ownerId?: string;
  province?: string;
  city?: string;
}

export interface RequestsQueryParams extends PaginationParams, SearchParams {
  type?: 'support' | 'complaint' | 'feature_request';
  status?: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  userId?: string;
}

export interface ReportsQueryParams extends DateRangeParams {
  format?: 'json' | 'csv' | 'pdf' | 'excel';
  category?: string;
}

// ====================================
// 🔒 HTTP Headers
// ====================================

export interface AuthHeaders {
  Authorization: string; // Bearer <token>
  'Content-Type'?: string;
}

export interface MultipartHeaders {
  Authorization: string;
  'Content-Type': 'multipart/form-data';
}

// ====================================
// 📊 Chart Data Types
// ====================================

export interface ChartConfig {
  [key: string]: {
    label: string;
    color?: string;
    theme?: {
      light: string;
      dark: string;
    };
  };
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
}

export interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

// ====================================
// 🔐 Authentication Context
// ====================================

export interface AuthUser extends User {
  permissions?: string[];
  lastActivity?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (mobile: string) => Promise<SendOtpResponse>;
  verifyOtp: (otpToken: string, otp: string) => Promise<VerifyOtpResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

// ====================================
// 🎯 Form Validation Types
// ====================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// ====================================
// 🔄 API Client Types
// ====================================

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface ApiRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, any>;
  timeout?: number;
}

// ====================================
// 📱 Mobile/Responsive Types
// ====================================

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
}

// ====================================
// 🎨 Theme Types
// ====================================

export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  fontFamily: string;
  direction: 'rtl' | 'ltr';
}

// ====================================
// 🚀 Export All Types
// ====================================

export type {
  // Re-export commonly used types
  User as ApiUser,
  Part as ApiPart,
  Elevator as ApiElevator,
  Transfer as ApiTransfer,
  Request as ApiRequest,
  ApiResponse as BaseApiResponse,
  PaginationInfo as ApiPagination,
};