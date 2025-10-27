// API Types based on OpenAPI schema

export type Phone = string; // Pattern: '^09\\d{9}$'
export type DateTime = string; // ISO date-time format

// Auth types
export interface SendOtpRequest {
  phone: Phone;
  captcha?: string;
  captchaId?: string;
  captchaToken?: string; // deprecated, keeping for backwards compatibility
}

export interface VerifyOtpRequest {
  phone: Phone;
  code: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// User & Company types
export interface Company {
  id: number;
  name: string;
  tradeId: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  ceoPhone: Phone;
  email: string;
}

export type ProfileType = 'producer' | 'importer' | 'installer' | 'seller' | 'coop_org';

export interface Profile {
  id: number;
  company: Company;
  profileType: ProfileType;
  isActive: boolean;
}

export interface User {
  id: number;
  phone: Phone;
  email?: string;
}

export interface MeResponse {
  user: User;
  profiles: Profile[];
}

export interface MeUpdateRequest {
  profileType?: ProfileType;
  company?: Partial<Company>;
}

export interface UserDetails {
  id: number;
  phone: Phone;
  company: Company;
  profiles: Profile[];
  status: 'pending' | 'active' | 'suspended';
}

export interface UserSummary {
  id: number;
  companyName: string;
  phone: Phone;
  status: 'pending' | 'active' | 'suspended';
  profileTypes: ProfileType[];
}

// Settings types
export interface Settings {
  id: number;
  smsProvider: string;
  smsConfig: any;
  paymentProvider: string;
  paymentConfig: any;
  systemMaintenance: boolean;
  registrationEnabled: boolean;
}

export interface SettingsUpdate extends Partial<Settings> {}

// Category & Feature types
export interface Category {
  id: number;
  parentId?: number;
  title: string;
  slug: string;
  path?: string;
  depth?: number;
  isActive: boolean;
  children?: Category[];
  elevatorTypeId?: string;
  elevatorTypeName?: string;
}

export interface Feature {
  id: number;
  categoryId: number;
  name: string;
  key: string;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'enum';
  enumValues?: string[];
}

// Parts types
export interface PartFeatureValue {
  featureId: number;
  value: any;
}

export interface Part {
  id: number;
  partUid: string;
  categoryId: number;
  title: string;
  barcode: string;
  manufacturerCountry: string;
  originCountry: string;
  registrantCompanyId: number;
  currentOwner: {
    type: 'company' | 'elevator';
    companyId?: number;
    elevatorId?: number;
  };
  createdAt?: DateTime;
  updatedAt?: DateTime;
}

export interface PartDetails extends Part {
  category: Category;
  features: Array<{
    featureId: number;
    name: string;
    key: string;
    value: any;
  }>;
}

export interface PartCreate {
  title: string;
  categoryId: number;
  barcode?: string;
  manufacturerCountry?: string;
  originCountry?: string;
  features?: PartFeatureValue[];
}

export interface PartUpdate {
  title?: string;
  barcode?: string;
  manufacturerCountry?: string;
  originCountry?: string;
  features?: PartFeatureValue[];
}

// Transfer types
export interface TransferRequest {
  buyerCompanyId: number;
  ceoOtp: string;
}

export interface PartTransfer {
  id: number;
  partId: number;
  sellerCompanyId: number;
  buyerCompanyId: number;
  approvedByCeoPhone: Phone;
  approvedAt: DateTime;
}

// Elevator types
export interface Elevator {
  id: number;
  elevatorUid: string; // 10 digits
  municipalityZone: string;
  buildPermitNo: string;
  registryPlate: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  installerCompanyId: number;
  createdAt?: DateTime;
  updatedAt?: DateTime;
}

export interface ElevatorPart {
  id: number;
  elevatorId: number;
  partId: number;
  installedAt: DateTime;
  removedAt?: DateTime;
  installerCompanyId: number;
  part?: Part;
}

export interface ElevatorDetails extends Elevator {
  parts: ElevatorPart[];
  installerCompany?: Company;
}

export interface ElevatorCreate {
  municipalityZone: string;
  buildPermitNo: string;
  registryPlate: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  installerCompanyId: number;
  parts?: Array<{ partId: number }>;
}

// Request types
export interface RequestCreate {
  type: 'activation' | 'upgrade';
  requestedProfileType?: ProfileType;
  note?: string;
}

export interface RequestItem {
  id: number;
  type: 'activation' | 'upgrade';
  profileId: number;
  currentProfileType: ProfileType;
  requestedProfileType?: ProfileType;
  status: 'pending' | 'approved' | 'rejected';
  reviewerUserId?: number;
  rejectReason?: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  note?: string;
}

// Complaint types
export interface ComplaintCreate {
  subject: string;
  body: string;
}

export interface ComplaintItem {
  id: number;
  profileId: number;
  subject: string;
  body: string;
  status: 'pending' | 'in_review' | 'resolved' | 'rejected';
  adminNotes?: string;
  createdAt: DateTime;
}

// Report types
export interface OverviewReport {
  summary: {
    partsTotal: number;
    transfersTotal: number;
    elevatorsTotal: number;
    requestsPending: number;
  };
  series: Array<{
    date: string;
    value: number;
  }>;
}

// Document types
export interface DocumentCreated {
  id: number;
  type: 'part_pdf' | 'elevator_pdf';
  filePath: string;
  hash: string;
}

// Payment types
export interface PaymentCreate {
  amount: number;
  currency: 'IRR';
  description?: string;
  callbackUrl?: string;
}

export interface Payment {
  id: number;
  payerProfileId: number;
  amount: number;
  currency: string;
  gateway: 'behpardakht';
  refNum: string;
  status: 'initiated' | 'success' | 'failed' | 'canceled';
  meta: any;
  createdAt: DateTime;
}

// Wallet types
export interface WalletInfo {
  balance: number;
  currency: string;
  lastUpdate: DateTime;
}

export interface WalletTransaction {
  id: number;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  referenceId?: string;
  createdAt: DateTime;
}

// Query parameters
export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface SearchParams extends PaginationParams {
  q?: string;
  sort?: string;
}

export interface PartSearchParams extends SearchParams {
  categoryId?: number;
  ownerType?: 'company' | 'elevator';
  ownerId?: number;
  barcode?: string;
}

export interface ElevatorSearchParams extends SearchParams {
  elevatorUid?: string;
  province?: string;
  city?: string;
}