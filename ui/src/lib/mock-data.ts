// Mock data for development and demo purposes
export const mockUsers = [
  {
    id: 1,
    companyName: 'شرکت آسانسار تهران',
    phone: '09123456789',
    status: 'active',
    profileTypes: ['producer', 'installer'],
    company: {
      name: 'شرکت آسانسار تهران',
      tradeId: '12345',
      province: 'تهران',
      city: 'تهران',
      address: 'تهران، خیابان ولیعصر، پلاک 123'
    },
    profiles: [
      { id: 1, profileType: 'producer', isActive: true },
      { id: 4, profileType: 'installer', isActive: true }
    ]
  },
  {
    id: 2,
    companyName: 'شرکت نصب سریع',
    phone: '09121234567',
    status: 'pending',
    profileTypes: ['installer'],
    company: {
      name: 'شرکت نصب سریع',
      tradeId: '67890',
      province: 'تهران',
      city: 'کرج',
      address: 'کرج، خیابان شهید بهشتی، پلاک 456'
    },
    profiles: [
      { id: 2, profileType: 'installer', isActive: true }
    ]
  },
  {
    id: 3,
    companyName: 'شرکت قطعات پارس',
    phone: '09129876543',
    status: 'suspended',
    profileTypes: ['importer', 'seller'],
    company: {
      name: 'شرکت قطعات پارس',
      tradeId: '54321',
      province: 'اصفهان',
      city: 'اصفهان',
      address: 'اصفهان، خیابان چهارباغ، پلاک 789'
    },
    profiles: [
      { id: 3, profileType: 'importer', isActive: false },
      { id: 5, profileType: 'seller', isActive: true }
    ]
  },
  {
    id: 4,
    companyName: 'شرکت مونتاژ امین',
    phone: '09381234567',
    status: 'active',
    profileTypes: ['installer', 'coop_org'],
    company: {
      name: 'شرکت مونتاژ امین',
      tradeId: '98765',
      province: 'اصفهان',
      city: 'کاشان',
      address: 'کاشان، خیابان امام خمینی، پلاک 321'
    },
    profiles: [
      { id: 6, profileType: 'installer', isActive: true },
      { id: 7, profileType: 'coop_org', isActive: true }
    ]
  },
  {
    id: 5,
    companyName: 'شرکت آسیا موتور',
    phone: '09351234567',
    status: 'pending',
    profileTypes: ['producer'],
    company: {
      name: 'شرکت آسیا موتور',
      tradeId: '11111',
      province: 'خراسان رضوی',
      city: 'مشهد',
      address: 'مشهد، خیابان احمد آباد، پلاک 654'
    },
    profiles: [
      { id: 8, profileType: 'producer', isActive: false }
    ]
  },
  {
    id: 6,
    companyName: 'شرکت صنعتی پارت سازان',
    phone: '09161234567',
    status: 'active',
    profileTypes: ['producer', 'importer'],
    company: {
      name: 'شرکت صنعتی پارت سازان',
      tradeId: '22222',
      province: 'تهران',
      city: 'تهران',
      address: 'تهران، خیابان انقلاب، پلاک 987'
    },
    profiles: [
      { id: 9, profileType: 'producer', isActive: true },
      { id: 10, profileType: 'importer', isActive: true }
    ]
  },
  {
    id: 7,
    companyName: 'شرکت فنی مهندسی فردا',
    phone: '09177654321',
    status: 'active',
    profileTypes: ['installer', 'seller'],
    company: {
      name: 'شرکت فنی مهندسی فردا',
      tradeId: '33333',
      province: 'فارس',
      city: 'شیراز',
      address: 'شیراز، خیابان زند، پلاک 147'
    },
    profiles: [
      { id: 11, profileType: 'installer', isActive: true },
      { id: 12, profileType: 'seller', isActive: true }
    ]
  },
  {
    id: 8,
    companyName: 'شرکت بازرگانی کیان',
    phone: '09111357924',
    status: 'suspended',
    profileTypes: ['seller'],
    company: {
      name: 'شرکت بازرگانی کیان',
      tradeId: '44444',
      province: 'گیلان',
      city: 'رشت',
      address: 'رشت، خیابان شهدای گومیشان، پلاک 258'
    },
    profiles: [
      { id: 13, profileType: 'seller', isActive: false }
    ]
  },
  {
    id: 9,
    companyName: 'شرکت نوآوران صنعت',
    phone: '09141234567',
    status: 'pending',
    profileTypes: ['producer', 'coop_org'],
    company: {
      name: 'شرکت نوآوران صنعت',
      tradeId: '55555',
      province: 'آذربایجان شرقی',
      city: 'تبریز',
      address: 'تبریز، خیابان امام خمینی، پلاک 369'
    },
    profiles: [
      { id: 14, profileType: 'producer', isActive: false },
      { id: 15, profileType: 'coop_org', isActive: true }
    ]
  },
  {
    id: 10,
    companyName: 'شرکت ساخت و ساز البرز',
    phone: '09221234567',
    status: 'active',
    profileTypes: ['installer'],
    company: {
      name: 'شرکت ساخت و ساز البرز',
      tradeId: '66666',
      province: 'البرز',
      city: 'کرج',
      address: 'کرج، خیابان مطهری، پلاک 741'
    },
    profiles: [
      { id: 16, profileType: 'installer', isActive: true }
    ]
  },
  {
    id: 11,
    companyName: 'شرکت قطعات اروپایی',
    phone: '09371234567',
    status: 'active',
    profileTypes: ['importer', 'seller'],
    company: {
      name: 'شرکت قطعات اروپایی',
      tradeId: '77777',
      province: 'هرمزگان',
      city: 'بندرعباس',
      address: 'بندرعباس، خیابان امام خمینی، پلاک 852'
    },
    profiles: [
      { id: 17, profileType: 'importer', isActive: true },
      { id: 18, profileType: 'seller', isActive: true }
    ]
  },
  {
    id: 12,
    companyName: 'شرکت همکاران مشهد',
    phone: '09151234567',
    status: 'pending',
    profileTypes: ['coop_org'],
    company: {
      name: 'شرکت همکاران مشهد',
      tradeId: '88888',
      province: 'خراسان رضوی',
      city: 'مشهد',
      address: 'مشهد، خیابان کوهسنگی، پلاک 963'
    },
    profiles: [
      { id: 19, profileType: 'coop_org', isActive: false }
    ]
  }
];

export const mockParts = [
  {
    id: 1,
    partUid: 'P-2509-1A2B3C',
    categoryId: 1,
    title: 'موتور آسانسور 1000 کیلو',
    barcode: '6260001234567',
    manufacturerCountry: 'ایران',
    originCountry: 'ایران',
    registrantCompanyId: 1,
    currentOwner: {
      type: 'company',
      companyId: 1
    },
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-03-15T10:30:00Z'
  },
  {
    id: 2,
    partUid: 'P-2509-2B3C4D',
    categoryId: 2,
    title: 'کابل آسانسور 10 متری',
    barcode: '6260001234568',
    manufacturerCountry: 'آلمان',
    originCountry: 'آلمان',
    registrantCompanyId: 3,
    currentOwner: {
      type: 'company',
      companyId: 1
    },
    createdAt: '2024-03-20T14:20:00Z',
    updatedAt: '2024-03-20T14:20:00Z'
  },
  {
    id: 3,
    partUid: 'P-2509-3C4D5E',
    categoryId: 3,
    title: 'کنترلر هوشمند',
    barcode: '6260001234569',
    manufacturerCountry: 'ژاپن',
    originCountry: 'ژاپن',
    registrantCompanyId: 2,
    currentOwner: {
      type: 'company',
      companyId: 1
    },
    createdAt: '2024-03-10T09:15:00Z',
    updatedAt: '2024-03-10T09:15:00Z'
  },
  {
    id: 4,
    partUid: 'P-2509-4D5E6F',
    categoryId: 1,
    title: 'موتور آسانسور 630 کیلو',
    barcode: '6260001234570',
    manufacturerCountry: 'ایران',
    originCountry: 'ایران',
    registrantCompanyId: 1,
    currentOwner: {
      type: 'company',
      companyId: 1
    },
    createdAt: '2024-03-22T11:00:00Z',
    updatedAt: '2024-03-22T11:00:00Z'
  },
  {
    id: 5,
    partUid: 'P-2509-5E6F7G',
    categoryId: 2,
    title: 'کابل آسانسور 15 متری',
    barcode: '6260001234571',
    manufacturerCountry: 'آلمان',
    originCountry: 'آلمان',
    registrantCompanyId: 1,
    currentOwner: {
      type: 'company',
      companyId: 1
    },
    createdAt: '2024-03-23T09:30:00Z',
    updatedAt: '2024-03-23T09:30:00Z'
  },
  {
    id: 6,
    partUid: 'P-2509-6F7G8H',
    categoryId: 3,
    title: 'کنترلر پیشرفته',
    barcode: '6260001234572',
    manufacturerCountry: 'ژاپن',
    originCountry: 'ژاپن',
    registrantCompanyId: 1,
    currentOwner: {
      type: 'company',
      companyId: 1
    },
    createdAt: '2024-03-24T14:15:00Z',
    updatedAt: '2024-03-24T14:15:00Z'
  },
  {
    id: 7,
    partUid: 'P-2509-7G8H9I',
    categoryId: 4,
    title: 'سیستم ایمنی',
    barcode: '6260001234573',
    manufacturerCountry: 'آلمان',
    originCountry: 'آلمان',
    registrantCompanyId: 1,
    currentOwner: {
      type: 'company',
      companyId: 1
    },
    createdAt: '2024-03-25T10:45:00Z',
    updatedAt: '2024-03-25T10:45:00Z'
  },
  {
    id: 8,
    partUid: 'P-2509-8H9I0J',
    categoryId: 5,
    title: 'کابین آسانسور استاندارد',
    barcode: '6260001234574',
    manufacturerCountry: 'ترکیه',
    originCountry: 'ترکیه',
    registrantCompanyId: 1,
    currentOwner: {
      type: 'company',
      companyId: 1
    },
    createdAt: '2024-03-26T08:20:00Z',
    updatedAt: '2024-03-26T08:20:00Z'
  },
  {
    id: 9,
    partUid: 'P-2509-9I0J1K',
    categoryId: 6,
    title: 'درب آسانسور اتوماتیک',
    barcode: '6260001234575',
    manufacturerCountry: 'ایتالیا',
    originCountry: 'ایتالیا',
    registrantCompanyId: 1,
    currentOwner: {
      type: 'company',
      companyId: 1
    },
    createdAt: '2024-03-27T09:15:00Z',
    updatedAt: '2024-03-27T09:15:00Z'
  },
  {
    id: 10,
    partUid: 'P-2509-0J1K2L',
    categoryId: 7,
    title: 'گیربکس آسانسور',
    barcode: '6260001234576',
    manufacturerCountry: 'ایران',
    originCountry: 'ایران',
    registrantCompanyId: 1,
    currentOwner: {
      type: 'company',
      companyId: 1
    },
    createdAt: '2024-03-28T11:30:00Z',
    updatedAt: '2024-03-28T11:30:00Z'
  },
  {
    id: 11,
    partUid: 'P-2509-1K2L3M',
    categoryId: 8,
    title: 'کنترل کننده الکترونیکی',
    barcode: '6260001234577',
    manufacturerCountry: 'کره جنوبی',
    originCountry: 'کره جنوبی',
    registrantCompanyId: 1,
    currentOwner: {
      type: 'company',
      companyId: 1
    },
    createdAt: '2024-03-29T14:45:00Z',
    updatedAt: '2024-03-29T14:45:00Z'
  },
  {
    id: 12,
    partUid: 'P-2509-2L3M4N',
    categoryId: 9,
    title: 'سیستم هیدرولیک',
    barcode: '6260001234578',
    manufacturerCountry: 'آلمان',
    originCountry: 'آلمان',
    registrantCompanyId: 1,
    currentOwner: {
      type: 'company',
      companyId: 1
    },
    createdAt: '2024-03-30T16:20:00Z',
    updatedAt: '2024-03-30T16:20:00Z'
  }
];

export const mockElevators = [
  {
    id: 1,
    elevatorUid: '1234567890',
    municipalityZone: 'منطقه 1',
    buildPermitNo: 'BP-2024-001',
    registryPlate: 'ELV-TH-001',
    province: 'تهران',
    city: 'تهران',
    address: 'تهران، میدان ونک، برج پارک وی',
    postalCode: '1234567890',
    installerCompanyId: 1,
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-03-15T12:00:00Z'
  },
  {
    id: 2,
    elevatorUid: '0987654321',
    municipalityZone: 'منطقه 3',
    buildPermitNo: 'BP-2023-045',
    registryPlate: 'ELV-TH-002',
    province: 'تهران',
    city: 'تهران',
    address: 'تهران، خیابان شریعتی، سیتی سنتر',
    postalCode: '0987654321',
    installerCompanyId: 2,
    createdAt: '2023-12-01T10:30:00Z',
    updatedAt: '2024-02-10T14:20:00Z'
  }
];

export const mockTransfers = [
  {
    id: 1,
    partId: 1,
    sellerCompanyId: 1,
    buyerCompanyId: 2,
    approvedByCeoPhone: '09123456789',
    approvedAt: '2024-02-01T12:00:00Z'
  },
  {
    id: 2,
    partId: 2,
    sellerCompanyId: 3,
    buyerCompanyId: 1,
    approvedByCeoPhone: '09129876543',
    approvedAt: '2024-02-05T15:30:00Z'
  }
];

export const mockRequests = [
  {
    id: 1,
    type: 'activation',
    profileId: 2,
    currentProfileType: 'installer',
    requestedProfileType: 'installer',
    status: 'pending',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
    note: 'درخواست فعال‌سازی حساب کاربری برای شرکت نصب سریع'
  },
  {
    id: 2,
    type: 'upgrade',
    profileId: 3,
    currentProfileType: 'importer',
    requestedProfileType: 'producer',
    status: 'approved',
    reviewerUserId: 1,
    createdAt: '2024-01-28T14:30:00Z',
    updatedAt: '2024-01-30T09:15:00Z',
    note: 'درخواست ارتقاء به حساب تولیدکننده'
  }
];

export const mockComplaints = [
  {
    id: 1,
    profileId: 1,
    subject: 'مشکل در ثبت قطعه',
    body: 'هنگام ثبت قطعه جدید با خطا مواجه می‌شوم',
    status: 'pending',
    createdAt: '2024-02-03T11:00:00Z'
  },
  {
    id: 2,
    profileId: 2,
    subject: 'مشکل در انتقال قطعه',
    body: 'امکان انتقال قطعه به شرکت دیگر وجود ندارد',
    status: 'resolved',
    adminNotes: 'مشکل برطرف شد',
    createdAt: '2024-01-30T16:45:00Z'
  }
];

export const mockCategories = [
  {
    id: 1,
    parentId: null,
    title: 'موتور',
    slug: 'motor',
    path: '/motor',
    depth: 0,
    isActive: true
  },
  {
    id: 2,
    parentId: null,
    title: 'کابل',
    slug: 'cable',
    path: '/cable',
    depth: 0,
    isActive: true
  },
  {
    id: 3,
    parentId: null,
    title: 'کنترل',
    slug: 'controller',
    path: '/controller',
    depth: 0,
    isActive: true
  },
  {
    id: 4,
    parentId: null,
    title: 'ایمنی',
    slug: 'safety',
    path: '/safety',
    depth: 0,
    isActive: true
  },
  {
    id: 5,
    parentId: null,
    title: 'کابین',
    slug: 'cabin',
    path: '/cabin',
    depth: 0,
    isActive: true
  },
  {
    id: 6,
    parentId: null,
    title: 'درب',
    slug: 'door',
    path: '/door',
    depth: 0,
    isActive: true
  },
  {
    id: 7,
    parentId: null,
    title: 'مکانیکی',
    slug: 'mechanical',
    path: '/mechanical',
    depth: 0,
    isActive: true
  },
  {
    id: 8,
    parentId: null,
    title: 'الکترونیک',
    slug: 'electronic',
    path: '/electronic',
    depth: 0,
    isActive: true
  },
  {
    id: 9,
    parentId: null,
    title: 'هیدرولیک',
    slug: 'hydraulic',
    path: '/hydraulic',
    depth: 0,
    isActive: true
  }
];

export const mockFeatures = [
  {
    id: 1,
    categoryId: 1,
    name: 'قدرت',
    key: 'power',
    dataType: 'number',
    enumValues: undefined
  },
  {
    id: 2,
    categoryId: 1,
    name: 'ولتاژ',
    key: 'voltage',
    dataType: 'enum',
    enumValues: ['220V', '380V', '440V']
  },
  {
    id: 3,
    categoryId: 2,
    name: 'طول',
    key: 'length',
    dataType: 'number',
    enumValues: undefined
  }
];

export const mockSettings = {
  id: 1,
  smsProvider: 'kavenegar',
  smsConfig: { apiKey: 'demo-key' },
  paymentProvider: 'behpardakht',
  paymentConfig: { terminal: '1234567' },
  systemMaintenance: false,
  registrationEnabled: true
};

// Generate mock paginated response
export function createMockPaginatedResponse<T>(
  items: T[],
  page: number = 1,
  size: number = 20,
  searchTerm?: string
): { items: T[]; pagination: any } {
  let filteredItems = items;
  
  // Apply search filter if provided
  if (searchTerm) {
    filteredItems = items.filter((item: any) => 
      JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  const total = filteredItems.length;
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const pageItems = filteredItems.slice(startIndex, endIndex);
  
  return {
    items: pageItems,
    pagination: {
      page,
      size,
      total,
      totalPages: Math.ceil(total / size)
    }
  };
}

// Mock API delay to simulate real API calls
export function mockApiDelay(min: number = 50, max: number = 200): Promise<void> {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}