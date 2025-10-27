# ⚙️ تنظیمات و پیکربندی لاگین

## 🔧 Environment Variables

### فایل `.env`
```env
# API Configuration
VITE_API_BASE_URL=https://elevatorid.ieeu.ir/v1
VITE_API_TIMEOUT=30000

# Captcha Configuration
VITE_CAPTCHA_WIDTH=200
VITE_CAPTCHA_HEIGHT=70
VITE_CAPTCHA_REFRESH_ON_ERROR=true

# OTP Configuration
VITE_OTP_LENGTH=6
VITE_OTP_EXPIRY_TIME=120
VITE_OTP_RESEND_DELAY=60

# Auth Configuration
VITE_TOKEN_STORAGE_KEY=access_token
VITE_REFRESH_TOKEN_KEY=refresh_token
VITE_AUTH_REDIRECT_ADMIN=/api/admin
VITE_AUTH_REDIRECT_USER=/api/user

# Development
VITE_USE_MOCK_API=false
VITE_DEBUG_MODE=false
```

---

## 📝 تنظیمات API Client

### `/lib/api-client.ts`

```typescript
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://elevatorid.ieeu.ir/v1';
const TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000;
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 - Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Clear tokens and redirect to login
        localStorage.clear();
        window.location.href = '/api/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 🔐 Auth Service Configuration

### `/services/auth.service.ts`

```typescript
import apiClient from '../lib/api-client';

export interface LoginRequest {
  mobile: string;
  captcha_id: string;
  captcha_value: string;
}

export interface OTPVerifyRequest {
  mobile: string;
  otp: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    mobile: string;
    role: 'admin' | 'user';
    name: string;
    email?: string;
  };
}

export const authService = {
  /**
   * Login with mobile and captcha
   */
  async login(mobile: string, captchaId: string, captchaValue: string) {
    const response = await apiClient.post('/auth/login', {
      mobile,
      captcha_id: captchaId,
      captcha_value: captchaValue,
    });
    return response.data;
  },

  /**
   * Verify OTP code
   */
  async verifyOTP(mobile: string, otp: string): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/otp/verify', {
      mobile,
      otp,
    });
    return response.data;
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string) {
    const response = await apiClient.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
};
```

---

## 🖼️ Captcha Service Configuration

### `/services/captcha.service.ts`

```typescript
import apiClient from '../lib/api-client';

const CAPTCHA_WIDTH = import.meta.env.VITE_CAPTCHA_WIDTH || 200;
const CAPTCHA_HEIGHT = import.meta.env.VITE_CAPTCHA_HEIGHT || 70;

export interface CaptchaResponse {
  captcha_id: string;
  captcha_image: string;
}

export const captchaService = {
  /**
   * Get new captcha
   */
  async getCaptcha(width = CAPTCHA_WIDTH, height = CAPTCHA_HEIGHT): Promise<CaptchaResponse> {
    const response = await apiClient.post('/captcha', {
      width,
      height,
    });
    return response.data;
  },

  /**
   * Validate captcha (optional - usually validated on login)
   */
  async validateCaptcha(captchaId: string, captchaValue: string) {
    const response = await apiClient.post('/captcha/validate', {
      captcha_id: captchaId,
      captcha_value: captchaValue,
    });
    return response.data;
  },
};
```

---

## 🎣 Custom Hook Configuration

### `/hooks/useAuth.ts`

```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

export interface User {
  id: string;
  mobile: string;
  role: 'admin' | 'user';
  name: string;
  email?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/api/login');
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
};
```

---

## 🛡️ Protected Route Configuration

### `/components/common/ProtectedRoute.tsx`

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/api/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/api/login" replace />;
  }

  return <>{children}</>;
}
```

---

## 🎨 UI Configuration

### Toast Configuration (Sonner)

```typescript
import { Toaster } from 'sonner';

// در App.tsx
<Toaster 
  position="top-center"
  dir="rtl"
  expand={false}
  richColors={true}
  closeButton={true}
  visibleToasts={3}
  theme="light"
  toastOptions={{
    style: {
      direction: 'rtl',
      textAlign: 'right',
    },
    duration: 4000,
  }}
/>
```

### Toast Usage

```typescript
import { toast } from 'sonner';

// Success
toast.success('عملیات موفقیت‌آمیز بود');

// Error
toast.error('خطا در انجام عملیات');

// Warning
toast.warning('هشدار: اطلاعات ناقص است');

// Info
toast.info('اطلاعات: کد تایید ارسال شد');

// Loading
const loadingToast = toast.loading('در حال پردازش...');
// بعد از اتمام:
toast.dismiss(loadingToast);
```

---

## 🔄 Retry Configuration

```typescript
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function retryRequest<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
}

// Usage
const data = await retryRequest(() => apiClient.get('/some-endpoint'));
```

---

## 📱 Responsive Configuration

### Breakpoints

```css
/* Mobile First */
/* xs: 0-639px */
/* sm: 640px+ */
/* md: 768px+ */
/* lg: 1024px+ */
/* xl: 1280px+ */
/* 2xl: 1536px+ */
```

### Usage in Components

```tsx
<div className="
  w-full 
  max-w-sm sm:max-w-md md:max-w-lg 
  p-4 sm:p-6 md:p-8
  mx-auto
">
  {/* Content */}
</div>
```

---

## 🌐 i18n Configuration (آینده)

```typescript
// فعلاً فقط فارسی، اما آماده برای چند زبانه شدن

const messages = {
  fa: {
    login: {
      title: 'ورود به سامانه',
      mobile: 'شماره موبایل',
      captcha: 'کد تصویر',
      submit: 'دریافت کد تایید',
    },
    otp: {
      title: 'تایید کد',
      code: 'کد تایید',
      submit: 'تایید',
      resend: 'ارسال مجدد',
    },
    errors: {
      invalidMobile: 'شماره موبایل نامعتبر است',
      invalidCaptcha: 'کد تصویر نادرست است',
      invalidOTP: 'کد تایید نادرست است',
    },
  },
};
```

---

## 🚀 Performance Configuration

### Code Splitting

```typescript
// در App.tsx
const Login = lazy(() => import('./components/api-auth/Login'));
const OTPVerification = lazy(() => import('./components/api-auth/OTPVerification'));

// با Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/api/login" element={<Login />} />
    <Route path="/api/otp-verify" element={<OTPVerification />} />
  </Routes>
</Suspense>
```

### Image Optimization

```typescript
// برای تصویر کپچا
<img 
  src={captchaImage} 
  alt="کد تصویر"
  loading="eager"
  decoding="async"
  style={{ maxWidth: '200px', height: 'auto' }}
/>
```

---

## 🔒 Security Configuration

### Content Security Policy (آینده)

```html
<!-- در index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://elevatorid.ieeu.ir;
">
```

### CORS Configuration (Backend)

```javascript
// نمونه برای Express.js
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

---

## 🧪 Testing Configuration

### Jest Config (آینده)

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

### Test Example

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';

describe('Login Component', () => {
  it('should render login form', () => {
    render(<Login />);
    expect(screen.getByText('ورود به سامانه')).toBeInTheDocument();
  });

  it('should validate mobile number', async () => {
    render(<Login />);
    const input = screen.getByPlaceholderText('09123456789');
    
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByText('شماره موبایل نامعتبر است')).toBeInTheDocument();
    });
  });
});
```

---

## 📊 Monitoring Configuration (آینده)

### Error Tracking

```typescript
// Sentry example
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
});
```

### Analytics

```typescript
// Google Analytics example
import ReactGA from 'react-ga4';

ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);

// Track page view
ReactGA.send({ hitType: 'pageview', page: '/api/login' });

// Track event
ReactGA.event({
  category: 'Auth',
  action: 'Login Attempt',
  label: 'Mobile Login',
});
```

---

## 🎯 نکات پیکربندی

### ✅ توصیه‌های بهینه‌سازی

1. **API Timeout**: 30 ثانیه کافی است
2. **Retry Logic**: حداکثر 3 بار تلاش مجدد
3. **Debounce**: 300ms برای اعتبارسنجی
4. **Cache**: کش کردن داده‌های استاتیک
5. **Lazy Loading**: برای کامپوننت‌های سنگین
6. **Compression**: فعال‌سازی gzip/brotli
7. **CDN**: استفاده از CDN برای static assets
8. **Monitoring**: نظارت بر خطاها و performance

### ⚠️ خطاهای رایج در پیکربندی

1. ❌ **Base URL اشتباه**: همیشه از HTTPS استفاده کنید
2. ❌ **Timeout کوتاه**: حداقل 30 ثانیه
3. ❌ **No Retry**: همیشه retry logic داشته باشید
4. ❌ **No Error Handling**: همه خطاها را handle کنید
5. ❌ **Hardcoded Values**: از env variables استفاده کنید
6. ❌ **No Token Refresh**: auto refresh توکن را پیاده کنید

---

## 📚 منابع بیشتر

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [React Router Documentation](https://reactrouter.com/)
- [Sonner Toast Documentation](https://sonner.emilkowal.ski/)