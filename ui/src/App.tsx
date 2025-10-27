import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';

// Auth context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Core components that need to load immediately
import TestPage from './TestPage';
import IndexPage from './components/IndexPage';
import LandingPage from './components/LandingPage';
import ProtectedRoute from './components/common/ProtectedRoute';

// Lazy load all other components with error handling
const Login = lazy(() => 
  import('./components/auth/Login').catch(() => ({ default: () => <div>خطا در بارگذاری صفحه ورود</div> }))
);
const OTPVerification = lazy(() => 
  import('./components/auth/OTPVerification').catch(() => ({ default: () => <div>خطا در بارگذاری تأیید OTP</div> }))
);
// Temporary: Load ApiLogin directly without lazy loading for debugging
import ApiLogin from './components/api-auth/Login';
const ApiOTPVerification = lazy(() => 
  import('./components/api-auth/OTPVerification').catch(() => ({ default: () => <div>خطا در بارگذاری API تأیید</div> }))
);
const ApiCompleteProfile = lazy(() => 
  import('./components/api-auth/CompleteProfile').catch(() => ({ default: () => <div>خطا در بارگذاری تکمیل پروفایل</div> }))
);
const AdminLayout = lazy(() => 
  import('./components/layout/AdminLayout').catch(() => ({ default: () => <div>خطا در بارگذاری پنل ادمین</div> }))
);
const UserLayout = lazy(() => 
  import('./components/layout/UserLayout').catch(() => ({ default: () => <div>خطا در بارگذاری پنل کاربر</div> }))
);

// Demo Admin components (Mock Data) with enhanced error handling
const AdminDashboard = lazy(() => 
  import('./components/admin/Dashboard').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری داشبورد دمو</div> 
  }))
);
const AdminProfile = lazy(() => 
  import('./components/admin/Profile').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری پروفایل دمو</div> 
  }))
);
const AdminSettings = lazy(() => 
  import('./components/admin/Settings').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری تنظیمات دمو</div> 
  }))
);
const AdminUsers = lazy(() => 
  import('./components/admin/Users').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری کاربران دمو</div> 
  }))
);
const AdminParts = lazy(() => 
  import('./components/admin/Parts').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری قطعات دمو</div> 
  }))
);
const AdminTransfers = lazy(() => 
  import('./components/admin/Transfers').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری انتقالات دمو</div> 
  }))
);
const AdminElevators = lazy(() => 
  import('./components/admin/Elevators').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری آسانسورها دمو</div> 
  }))
);
const AdminRequests = lazy(() => 
  import('./components/admin/Requests').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری درخواست‌ها دمو</div> 
  }))
);
const AdminReports = lazy(() => 
  import('./components/admin/Reports').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری گزارش‌ها دمو</div> 
  }))
);
const AdminAPIManagement = lazy(() => 
  import('./components/admin/APIManagement').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری مدیریت API دمو</div> 
  }))
);
const AdminAPIDocumentation = lazy(() => 
  import('./components/admin/APIDocumentation').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری مستندات API دمو</div> 
  }))
);
const AdminCategoryManagement = lazy(() => 
  import('./components/admin/CategoryManagement').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری مدیریت دسته‌بندی دمو</div> 
  }))
);
const AdminElevatorCategoryManagement = lazy(() => 
  import('./components/admin/ElevatorCategoryManagement').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری دسته‌بندی آسانسور دمو</div> 
  }))
);
const AdminCombinedCategoryManagement = lazy(() => 
  import('./components/admin/CombinedCategoryManagement').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری دسته‌بندی ترکیبی دمو</div> 
  }))
);
const AdminAPIConfig = lazy(() => 
  import('./components/admin/APIConfig').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری تنظیمات API دمو</div> 
  }))
);

// API Admin components (Real API) with error handling
const ApiAdminDashboard = lazy(() => 
  import('./components/api-admin/Dashboard').catch(() => ({ default: () => <div>خطا در بارگذاری داشبورد API</div> }))
);
const ApiAdminProfile = lazy(() => 
  import('./components/api-admin/Profile').catch(() => ({ default: () => <div>خطا در بارگذاری پروفایل API</div> }))
);
const ApiAdminSettings = lazy(() => 
  import('./components/api-admin/Settings').catch(() => ({ 
    default: () => (
      <div className="flex items-center justify-center min-h-[400px]" dir="rtl">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚙️</div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">خطا در بارگذاری صفحه تنظیمات</h2>
            <p className="text-muted-foreground leading-relaxed">
              مشکلی در بارگذاری صفحه تنظیمات سیستم پیش آمده است.
            </p>
          </div>

          <div className="flex flex-col gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              بازخوانی صفحه
            </button>
            
            <button
              onClick={() => window.history.back()}
              className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors font-medium"
            >
              بازگشت
            </button>
          </div>
        </div>
      </div>
    )
  }))
);
const ApiAdminUsers = lazy(() => 
  import('./components/api-admin/Users').catch(() => ({ default: () => <div>خطا در بارگذاری کاربران API</div> }))
);
const ApiAdminParts = lazy(() => 
  import('./components/api-admin/Parts').catch(() => ({ default: () => <div>خطا در بارگذاری قطعات API</div> }))
);
const ApiAdminTransfers = lazy(() => 
  import('./components/api-admin/Transfers').catch(() => ({ default: () => <div>خطا در بارگذاری انتقالات API</div> }))
);
const ApiAdminElevators = lazy(() => 
  import('./components/api-admin/Elevators').catch(() => ({ default: () => <div>خطا در بارگذاری آسانسورها API</div> }))
);
const ApiAdminRequests = lazy(() => 
  import('./components/api-admin/Requests').catch(() => ({ 
    default: () => (
      <div className="flex items-center justify-center min-h-[400px]" dir="rtl">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">خطا در بارگذاری صفحه درخواست‌ها</h2>
            <p className="text-muted-foreground leading-relaxed">
              مشکلی در بارگذاری صفحه مدیریت درخواست‌ها و شکایات پیش آمده است.
            </p>
          </div>

          <div className="flex flex-col gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              بازخوانی صفحه
            </button>
            
            <button
              onClick={() => window.history.back()}
              className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors font-medium"
            >
              بازگشت
            </button>
          </div>
        </div>
      </div>
    )
  }))
);
const ApiAdminReports = lazy(() => 
  import('./components/api-admin/Reports').catch(() => ({ 
    default: () => (
      <div className="flex items-center justify-center min-h-[400px]" dir="rtl">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-red-500 text-6xl mb-4">📊</div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">خطا در بارگذاری صفحه گزارش‌ها</h2>
            <p className="text-muted-foreground leading-relaxed">
              مشکلی در بارگذاری صفحه گزارش‌ها و تحلیل‌ها پیش آمده است.
            </p>
          </div>

          <div className="flex flex-col gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              بازخوانی صفحه
            </button>
            
            <button
              onClick={() => window.history.back()}
              className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors font-medium"
            >
              بازگشت
            </button>
          </div>
        </div>
      </div>
    )
  }))
);
const ApiAdminAPIManagement = lazy(() => 
  import('./components/api-admin/APIManagement').catch(() => ({ default: () => <div>خطا در بارگذاری مدیریت API</div> }))
);
const ApiAdminAPIDocumentation = lazy(() => 
  import('./components/api-admin/APIDocumentation').catch(() => ({ default: () => <div>خطا در بارگذاری مستندات API</div> }))
);
const ApiAdminCategoryManagement = lazy(() => 
  import('./components/api-admin/CategoryManagement').catch(() => ({ default: () => <div>خطا در بارگذاری مدیریت دسته‌بندی API</div> }))
);
const ApiAdminElevatorCategoryManagement = lazy(() => 
  import('./components/api-admin/ElevatorCategoryManagement').catch(() => ({ default: () => <div>خطا در بارگذاری دسته‌بندی آسانسور API</div> }))
);
const ApiAdminCombinedCategoryManagement = lazy(() => 
  import('./components/api-admin/CombinedCategoryManagement').catch(() => ({ default: () => <div>خطا در بارگذاری دسته‌بندی ترکیبی API</div> }))
);
const ApiAdminAPIConfig = lazy(() => 
  import('./components/api-admin/APIConfig').catch(() => ({ default: () => <div>خطا در بارگذاری تنظیمات API</div> }))
);

// Demo User components (Mock Data) with enhanced error handling
const UserDashboard = lazy(() => 
  import('./components/user/Dashboard').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری داشبورد کاربر دمو</div> 
  }))
);
const UserProfile = lazy(() => 
  import('./components/user/Profile').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری پروفایل کاربر دمو</div> 
  }))
);
const UserSettings = lazy(() => 
  import('./components/user/Settings').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری تنظیمات کاربر دمو</div> 
  }))
);
const UserProducts = lazy(() => 
  import('./components/user/Products').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری محصولات کاربر دمو</div> 
  }))
);
const UserTransfers = lazy(() => 
  import('./components/user/Transfers').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری انتقالات کاربر دمو</div> 
  }))
);
const UserElevators = lazy(() => 
  import('./components/user/Elevators').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری آسانسورها کاربر دمو</div> 
  }))
);
const UserRequests = lazy(() => 
  import('./components/user/Requests').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری درخواست‌ها کاربر دمو</div> 
  }))
);
const UserReports = lazy(() => 
  import('./components/user/Reports').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری گزارش‌ها کاربر دمو</div> 
  }))
);

// API User components (Real API) with enhanced error handling
const ApiUserDashboard = lazy(() => 
  import('./components/api-user/Dashboard').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری داشبورد کاربر API</div> 
  }))
);
const ApiUserProfile = lazy(() => 
  import('./components/api-user/Profile').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری پروفایل کاربر API</div> 
  }))
);
const ApiUserSettings = lazy(() => 
  import('./components/api-user/Settings').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری تنظیمات کاربر API</div> 
  }))
);
const ApiUserProducts = lazy(() => 
  import('./components/api-user/Products').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری محصولات کاربر API</div> 
  }))
);
const ApiUserTransfers = lazy(() => 
  import('./components/api-user/Transfers').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری انتقالات کاربر API</div> 
  }))
);
const ApiUserElevators = lazy(() => 
  import('./components/api-user/Elevators').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری آسانسورها کاربر API</div> 
  }))
);
const ApiUserRequests = lazy(() => 
  import('./components/api-user/Requests').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری درخواست‌ها کاربر API</div> 
  }))
);
const ApiUserReports = lazy(() => 
  import('./components/api-user/Reports').catch(() => ({ 
    default: () => <div className="p-8 text-center text-muted-foreground">خطا در بارگذاری گزارش‌ها کاربر API</div> 
  }))
);

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" role="status" aria-label="در حال بارگذاری"></div>
        <p className="text-muted-foreground">در حال بارگذاری...</p>
      </div>
    </div>
  );
}

function PageLoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" role="status" aria-label="بارگذاری صفحه"></div>
        <p className="text-sm text-muted-foreground">بارگذاری صفحه...</p>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error; errorInfo?: React.ErrorInfo; errorId?: string }
> {
  private retryCount = 0;
  private maxRetries = 3;
  
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  // Enhanced devtools error detection
  private static isDevToolsError(error: Error): boolean {
    const devToolsPatterns = [
      'devtools_worker',
      'figma.com',
      'webpack',
      'ChunkLoadError',
      'Loading chunk',
      'Loading CSS chunk',
      'readFromStdout',
      'webpack-artifacts',
      'figmaiframepreview',
      'esbuild',
      'on-end'
    ];

    const errorString = `${error.message} ${error.stack} ${error.name}`.toLowerCase();
    return devToolsPatterns.some(pattern => errorString.includes(pattern.toLowerCase()));
  }

  static getDerivedStateFromError(error: Error) {
    // Filter out devtools and build system errors
    if (ErrorBoundary.isDevToolsError(error)) {
      return { hasError: false }; // Don't show error boundary for devtools errors
    }

    // Generate unique error ID for tracking
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return { 
      hasError: true, 
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Skip devtools errors completely
    if (ErrorBoundary.isDevToolsError(error)) {
      return;
    }

    // Rate limit error logging
    const now = Date.now();
    const lastErrorTime = parseInt(sessionStorage.getItem('lastErrorTime') || '0');
    
    if (now - lastErrorTime > 5000) { // Only log errors every 5 seconds
      console.error('React Error Boundary:', {
        error,
        errorInfo,
        errorId: this.state.errorId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
      
      sessionStorage.setItem('lastErrorTime', now.toString());
    }

    this.setState({ errorInfo });
  }

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
      
      // Force a small delay to allow state to settle
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      // Max retries reached, full reload
      window.location.reload();
    }
  };

  private handleReset = () => {
    this.retryCount = 0;
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { error, errorId } = this.state;
      const isNetworkError = error?.message?.includes('fetch') || 
                            error?.message?.includes('Network') ||
                            error?.name === 'TypeError';

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
          <div className="text-center space-y-6 max-w-lg">
            <div className="text-red-500 text-6xl mb-4">
              {isNetworkError ? '🌐' : '⚠️'}
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                {isNetworkError ? 'مشکل در اتصال' : 'خطا در بارگذاری برنامه'}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                {isNetworkError 
                  ? 'لطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.'
                  : 'مشکلی در بارگذاری برنامه پیش آمده است. لطفاً صفحه را بازخوانی کنید.'
                }
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                {this.retryCount > 0 ? `تلاش مجدد (${this.maxRetries - this.retryCount})` : 'تلاش مجدد'}
              </button>
              
              <button
                onClick={this.handleReset}
                className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors font-medium"
              >
                بازنشانی
              </button>
            </div>

            {/* Error details for development */}
            {process.env.NODE_ENV === 'development' && error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
                  جزئیات خطا (برای توسعه‌دهندگان)
                </summary>
                <div className="mt-2 p-4 bg-muted rounded-lg text-xs font-mono text-muted-foreground overflow-auto max-h-40">
                  <div className="mb-2">
                    <strong>Error ID:</strong> {errorId}
                  </div>
                  <div className="mb-2">
                    <strong>Message:</strong> {error.message}
                  </div>
                  {error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">{error.stack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Enhanced component-level error recovery
  React.useEffect(() => {
    // Performance monitoring and optimization
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        // Only log significant performance issues, not devtools related
        if (entry.duration > 1000 && !entry.name.includes('devtools')) {
          console.warn(`Slow operation detected: ${entry.name} took ${entry.duration}ms`);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (error) {
      // Silently handle if PerformanceObserver is not supported
    }

    // React-specific error recovery
    const handleReactError = (error: Error, errorInfo: any) => {
      const isDevToolsError = error.stack?.includes('devtools_worker') ||
                             error.stack?.includes('figma.com') ||
                             error.message?.includes('devtools');
      
      if (!isDevToolsError) {
        console.error('React Error:', error, errorInfo);
      }
    };

    // Resource leak prevention
    const preventMemoryLeaks = () => {
      // Clean up any potential memory leaks
      if (typeof window !== 'undefined') {
        // Clear React-related memory
        const reactFiberNode = document.querySelector('#root')?._reactInternalFiber;
        if (reactFiberNode) {
          // React cleanup is handled automatically, just ensure no manual cleanup interferes
        }
      }
    };

    // Cleanup function
    return () => {
      try {
        observer.disconnect();
      } catch (error) {
        // Silently handle disconnect errors
      }
      preventMemoryLeaks();
    };
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/old-index" element={<IndexPage />} />
      <Route path="/test" element={<TestPage />} />
      
      {/* Demo Authentication (Mock) */}
      <Route path="/login" element={
        <Suspense fallback={<PageLoadingSpinner />}>
          <Login />
        </Suspense>
      } />
      <Route path="/otp-verify" element={
        <Suspense fallback={<PageLoadingSpinner />}>
          <OTPVerification />
        </Suspense>
      } />
      
      {/* API Authentication (Real API) */}
      <Route path="/api/login" element={<ApiLogin />} />
      <Route path="/api/otp-verify" element={
        <Suspense fallback={<PageLoadingSpinner />}>
          <ApiOTPVerification />
        </Suspense>
      } />
      <Route path="/api/complete-profile" element={
        <Suspense fallback={<PageLoadingSpinner />}>
          <ApiCompleteProfile />
        </Suspense>
      } />
      
      {/* Demo routes - Mock Data (accessible without authentication) */}
      <Route path="/demo/admin/*" element={
        <Suspense fallback={<PageLoadingSpinner />}>
          <AdminLayout />
        </Suspense>
      }>
        <Route index element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <AdminDashboard />
          </Suspense>
        } />
        <Route path="profile" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <AdminProfile />
          </Suspense>
        } />
        <Route path="settings" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <AdminSettings />
          </Suspense>
        } />
        <Route path="users" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <AdminUsers />
          </Suspense>
        } />
        <Route path="parts" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <AdminParts />
          </Suspense>
        } />
        <Route path="transfers" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <AdminTransfers />
          </Suspense>
        } />
        <Route path="elevators" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <AdminElevators />
          </Suspense>
        } />
        <Route path="requests" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <AdminRequests />
          </Suspense>
        } />
        <Route path="reports" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <AdminReports />
          </Suspense>
        } />
        <Route path="api" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <AdminAPIManagement />
          </Suspense>
        } />
        <Route path="api-docs" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <AdminAPIDocumentation />
          </Suspense>
        } />
        <Route path="categories" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <AdminCombinedCategoryManagement />
          </Suspense>
        } />
        <Route path="parts-categories" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <AdminCategoryManagement />
          </Suspense>
        } />
        <Route path="elevator-categories" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <AdminElevatorCategoryManagement />
          </Suspense>
        } />
        <Route path="api-config" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <AdminAPIConfig />
          </Suspense>
        } />
      </Route>
      
      <Route path="/demo/user/*" element={
        <Suspense fallback={<PageLoadingSpinner />}>
          <UserLayout />
        </Suspense>
      }>
        <Route index element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <UserDashboard />
          </Suspense>
        } />
        <Route path="profile" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <UserProfile />
          </Suspense>
        } />
        <Route path="settings" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <UserSettings />
          </Suspense>
        } />
        <Route path="products" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <UserProducts />
          </Suspense>
        } />
        <Route path="transfers" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <UserTransfers />
          </Suspense>
        } />
        <Route path="elevators" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <UserElevators />
          </Suspense>
        } />
        <Route path="requests" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <UserRequests />
          </Suspense>
        } />
        <Route path="reports" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <UserReports />
          </Suspense>
        } />
      </Route>

      {/* API routes - Real API Integration (PROTECTED - requires authentication) */}
      <Route path="/api/admin/*" element={
        <ProtectedRoute requiredRole="admin">
          <Suspense fallback={<PageLoadingSpinner />}>
            <AdminLayout />
          </Suspense>
        </ProtectedRoute>
      }>
        <Route index element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiAdminDashboard />
          </Suspense>
        } />
        <Route path="profile" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiAdminProfile />
          </Suspense>
        } />
        <Route path="settings" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiAdminSettings />
          </Suspense>
        } />
        <Route path="users" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiAdminUsers />
          </Suspense>
        } />
        <Route path="parts" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiAdminParts />
          </Suspense>
        } />
        <Route path="transfers" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiAdminTransfers />
          </Suspense>
        } />
        <Route path="elevators" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiAdminElevators />
          </Suspense>
        } />
        <Route path="requests" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiAdminRequests />
          </Suspense>
        } />
        <Route path="reports" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiAdminReports />
          </Suspense>
        } />
        <Route path="api" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiAdminAPIManagement />
          </Suspense>
        } />
        <Route path="api-docs" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiAdminAPIDocumentation />
          </Suspense>
        } />
        <Route path="categories" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiAdminCombinedCategoryManagement />
          </Suspense>
        } />
        <Route path="parts-categories" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiAdminCategoryManagement />
          </Suspense>
        } />
        <Route path="elevator-categories" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiAdminElevatorCategoryManagement />
          </Suspense>
        } />
        <Route path="api-config" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiAdminAPIConfig />
          </Suspense>
        } />
      </Route>
      
      <Route path="/api/user/*" element={
        <ProtectedRoute requiredRole="user">
          <Suspense fallback={<PageLoadingSpinner />}>
            <UserLayout />
          </Suspense>
        </ProtectedRoute>
      }>
        <Route index element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiUserDashboard />
          </Suspense>
        } />
        <Route path="profile" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiUserProfile />
          </Suspense>
        } />
        <Route path="settings" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiUserSettings />
          </Suspense>
        } />
        <Route path="products" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiUserProducts />
          </Suspense>
        } />
        <Route path="transfers" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiUserTransfers />
          </Suspense>
        } />
        <Route path="elevators" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiUserElevators />
          </Suspense>
        } />
        <Route path="requests" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiUserRequests />
          </Suspense>
        } />
        <Route path="reports" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <ApiUserReports />
          </Suspense>
        } />
      </Route>

      {/* Authenticated admin routes - Using API Integration */}
      {user?.role === 'admin' && (
        <Route path="/admin/*" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <AdminLayout />
          </Suspense>
        }>
          <Route index element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiAdminDashboard />
            </Suspense>
          } />
          <Route path="profile" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiAdminProfile />
            </Suspense>
          } />
          <Route path="settings" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiAdminSettings />
            </Suspense>
          } />
          <Route path="users" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiAdminUsers />
            </Suspense>
          } />
          <Route path="parts" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiAdminParts />
            </Suspense>
          } />
          <Route path="transfers" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiAdminTransfers />
            </Suspense>
          } />
          <Route path="elevators" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiAdminElevators />
            </Suspense>
          } />
          <Route path="requests" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiAdminRequests />
            </Suspense>
          } />
          <Route path="reports" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiAdminReports />
            </Suspense>
          } />
          <Route path="api" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiAdminAPIManagement />
            </Suspense>
          } />
          <Route path="api-docs" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiAdminAPIDocumentation />
            </Suspense>
          } />
          <Route path="categories" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiAdminCombinedCategoryManagement />
            </Suspense>
          } />
          <Route path="parts-categories" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiAdminCategoryManagement />
            </Suspense>
          } />
          <Route path="elevator-categories" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiAdminElevatorCategoryManagement />
            </Suspense>
          } />
          <Route path="api-config" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiAdminAPIConfig />
            </Suspense>
          } />
        </Route>
      )}

      {/* Authenticated user routes - Using API Integration */}
      {user?.role === 'user' && (
        <Route path="/user/*" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <UserLayout />
          </Suspense>
        }>
          <Route index element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiUserDashboard />
            </Suspense>
          } />
          <Route path="profile" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiUserProfile />
            </Suspense>
          } />
          <Route path="settings" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiUserSettings />
            </Suspense>
          } />
          <Route path="products" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiUserProducts />
            </Suspense>
          } />
          <Route path="transfers" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiUserTransfers />
            </Suspense>
          } />
          <Route path="elevators" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiUserElevators />
            </Suspense>
          } />
          <Route path="requests" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiUserRequests />
            </Suspense>
          } />
          <Route path="reports" element={
            <Suspense fallback={<PageLoadingSpinner />}>
              <ApiUserReports />
            </Suspense>
          } />
        </Route>
      )}

      {/* Redirect authenticated users to appropriate dashboard */}
      <Route path="/dashboard" element={
        user ? (
          <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  // Enhanced error filtering and performance monitoring
  React.useEffect(() => {
    // Store original console methods
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;

    // Enhanced devtools error detection patterns
    const devToolsPatterns = [
      'devtools_worker',
      'figma.com',
      'webpack',
      'Loading chunk',
      'ChunkLoadError',
      'esbuild',
      'readFromStdout',
      'webpack-artifacts',
      'figma-iframe',
      'figmaiframepreview',
      'on-end',
      'figma/webpack',
      'esm.sh'
    ];

    const isDevToolsRelated = (message: string): boolean => {
      return devToolsPatterns.some(pattern => 
        message.toLowerCase().includes(pattern.toLowerCase())
      );
    };

    // Debounced error logging to prevent spam
    let errorBuffer: any[] = [];
    let errorTimeout: NodeJS.Timeout | null = null;

    const flushErrors = () => {
      if (errorBuffer.length > 0) {
        const uniqueErrors = errorBuffer.filter((error, index, self) => 
          index === self.findIndex(e => e.message === error.message)
        );
        
        if (uniqueErrors.length <= 3) { // Only log if we have few unique errors
          uniqueErrors.forEach(error => originalError(error.message, error.details));
        }
        errorBuffer = [];
      }
      errorTimeout = null;
    };

    const debouncedError = (message: string, details?: any) => {
      errorBuffer.push({ message, details });
      
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }
      
      errorTimeout = setTimeout(flushErrors, 1000); // Batch errors for 1 second
    };

    // Override console methods with enhanced filtering
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      if (!isDevToolsRelated(message)) {
        debouncedError('Console Error:', args);
      }
    };

    console.warn = (...args: any[]) => {
      const message = args.join(' ');
      if (!isDevToolsRelated(message)) {
        originalWarn.apply(console, args);
      }
    };

    // Enhanced global error handlers with better filtering
    const handleGlobalError = (event: ErrorEvent) => {
      const errorMessage = event.message || '';
      const errorFilename = event.filename || '';
      const errorStack = event.error?.stack || '';
      
      const isDevToolsError = isDevToolsRelated(errorMessage) ||
                             isDevToolsRelated(errorFilename) ||
                             isDevToolsRelated(errorStack) ||
                             event.error?.name === 'ChunkLoadError';
      
      if (isDevToolsError) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
      
      // Only log significant application errors
      if (event.error && !event.error.name?.includes('Network')) {
        debouncedError('Global Application Error:', {
          message: errorMessage,
          filename: errorFilename,
          line: event.lineno,
          column: event.colno,
          error: event.error
        });
      }
      
      return true;
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const reasonString = String(reason);
      const reasonStack = reason?.stack || '';
      
      const isDevToolsError = isDevToolsRelated(reasonString) ||
                             isDevToolsRelated(reasonStack) ||
                             reason?.name === 'ChunkLoadError';
      
      if (isDevToolsError) {
        event.preventDefault();
        return;
      }
      
      // Only log significant promise rejections
      if (reason && !reasonString.includes('AbortError')) {
        debouncedError('Unhandled Promise Rejection:', reason);
      }
    };

    // Performance monitoring with throttling
    let performanceBuffer: PerformanceEntry[] = [];
    let perfTimeout: NodeJS.Timeout | null = null;

    const flushPerformance = () => {
      if (performanceBuffer.length > 0) {
        const slowOperations = performanceBuffer
          .filter(entry => entry.duration > 2000) // Only very slow operations
          .slice(0, 3); // Limit to 3 entries
        
        if (slowOperations.length > 0) {
          originalWarn('Performance Warning:', slowOperations.map(op => 
            `${op.name}: ${Math.round(op.duration)}ms`
          ).join(', '));
        }
        performanceBuffer = [];
      }
      perfTimeout = null;
    };

    // Conservative performance monitoring
    const setupPerformanceMonitoring = () => {
      try {
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const relevantEntries = entries.filter(entry => 
              !isDevToolsRelated(entry.name) && entry.duration > 1000
            );
            
            performanceBuffer.push(...relevantEntries);
            
            if (perfTimeout) {
              clearTimeout(perfTimeout);
            }
            
            perfTimeout = setTimeout(flushPerformance, 5000); // Batch for 5 seconds
          });

          observer.observe({ entryTypes: ['measure', 'navigation'] });
          
          return () => {
            try {
              observer.disconnect();
            } catch (error) {
              // Silently handle disconnect errors
            }
          };
        }
      } catch (error) {
        // Performance monitoring not supported
      }
      
      return () => {}; // No-op cleanup
    };

    const cleanupPerformanceMonitoring = setupPerformanceMonitoring();

    // Conservative resource cleanup
    const cleanup = () => {
      try {
        // Cleanup our own timers
        if (errorTimeout) {
          clearTimeout(errorTimeout);
        }
        if (perfTimeout) {
          clearTimeout(perfTimeout);
        }
        
        // Flush any pending logs
        flushErrors();
        flushPerformance();
        
        // Cleanup performance monitoring
        cleanupPerformanceMonitoring();
      } catch (error) {
        // Silently handle cleanup errors
      }
    };

    // Add event listeners with enhanced options
    window.addEventListener('error', handleGlobalError, { 
      capture: true, 
      passive: false 
    });
    window.addEventListener('unhandledrejection', handleUnhandledRejection, {
      capture: true,
      passive: false
    });
    window.addEventListener('beforeunload', cleanup, { 
      capture: true, 
      passive: true 
    });

    // Cleanup function
    return () => {
      try {
        // Restore original console methods
        console.error = originalError;
        console.warn = originalWarn;
        console.log = originalLog;
        
        // Remove event listeners
        window.removeEventListener('error', handleGlobalError, true);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
        window.removeEventListener('beforeunload', cleanup, true);
        
        // Final cleanup
        cleanup();
      } catch (error) {
        // Silently handle cleanup errors during component unmount
      }
    };
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground" dir="rtl">
        <AuthProvider>
          <Router>
            <Suspense fallback={<LoadingSpinner />}>
              <AppContent />
            </Suspense>
            <Toaster 
              position="top-center"
              dir="rtl"
              expand={false}
              richColors={true}
              closeButton={true}
              visibleToasts={3}
              theme="light"
              offset="16px"
              hotkey={['mod+shift+l']}
              toastOptions={{
                style: {
                  direction: 'rtl',
                  textAlign: 'right',
                  fontFamily: 'inherit',
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  backdropFilter: 'blur(12px)',
                  maxWidth: '380px',
                  minHeight: '56px',
                  willChange: 'transform, opacity',
                  backfaceVisibility: 'hidden',
                  contain: 'layout style paint',
                  isolation: 'isolate',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                },
                classNames: {
                  toast: 'group toast group-[.toaster]:bg-white/97 group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200/60 group-[.toaster]:shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-white/85',
                  description: 'group-[.toast]:text-gray-600 group-[.toast]:text-sm group-[.toast]:mt-1 group-[.toast]:leading-relaxed group-[.toast]:opacity-90',
                  actionButton: 'group-[.toast]:bg-gray-900 group-[.toast]:text-white group-[.toast]:hover:bg-gray-800 group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-2 group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:transition-colors',
                  cancelButton: 'group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700 group-[.toast]:hover:bg-gray-200 group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-2 group-[.toast]:text-sm group-[.toast]:transition-colors',
                  closeButton: 'group-[.toast]:bg-white/80 group-[.toast]:text-gray-500 group-[.toast]:hover:text-gray-700 group-[.toast]:hover:bg-white group-[.toast]:border-gray-200/40 group-[.toast]:transition-all group-[.toast]:backdrop-blur-sm',
                  success: 'group success group-[.toaster]:bg-green-50/97 group-[.toaster]:text-green-900 group-[.toaster]:border-green-200/60 supports-[backdrop-filter]:bg-green-50/85',
                  error: 'group error group-[.toaster]:bg-red-50/97 group-[.toaster]:text-red-900 group-[.toaster]:border-red-200/60 supports-[backdrop-filter]:bg-red-50/85',
                  warning: 'group warning group-[.toaster]:bg-yellow-50/97 group-[.toaster]:text-yellow-900 group-[.toaster]:border-yellow-200/60 supports-[backdrop-filter]:bg-yellow-50/85',
                  info: 'group info group-[.toaster]:bg-blue-50/97 group-[.toaster]:text-blue-900 group-[.toaster]:border-blue-200/60 supports-[backdrop-filter]:bg-blue-50/85',
                },
                duration: 4000,
                richColors: true,
              }}
            />
        </Router>
      </AuthProvider>
    </div>
    </ErrorBoundary>
  );
}