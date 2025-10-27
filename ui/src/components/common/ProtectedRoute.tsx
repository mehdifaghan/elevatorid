import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  allowedRoles?: ('admin' | 'user')[];
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  allowedRoles 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // در حال بارگذاری
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" role="status" aria-label="در حال بارگذاری"></div>
          <p className="text-muted-foreground">در حال بررسی احراز هویت...</p>
        </div>
      </div>
    );
  }

  // کاربر وارد نشده
  if (!user) {
    // اگر از طریق IndexPage آمده است، مستقیماً redirect کند
    return <Navigate to="/api/login" state={{ from: location }} replace />;
  }

  // بررسی نقش مطلوب
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">دسترسی غیرمجاز</h1>
            <p className="text-muted-foreground leading-relaxed">
              شما مجوز دسترسی به این بخش را ندارید.
            </p>
          </div>

          <div className="flex flex-col gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              بازگشت
            </button>
            
            <button
              onClick={() => {
                window.location.href = user.role === 'admin' ? '/admin' : '/user';
              }}
              className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors font-medium"
            >
              رفتن به پنل کاربری
            </button>
          </div>
        </div>
      </div>
    );
  }

  // بررسی نقش‌های مجاز
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">دسترسی غیرمجاز</h1>
            <p className="text-muted-foreground leading-relaxed">
              شما مجوز دسترسی به این بخش را ندارید.
            </p>
          </div>

          <div className="flex flex-col gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              بازگشت
            </button>
            
            <button
              onClick={() => {
                window.location.href = user.role === 'admin' ? '/admin' : '/user';
              }}
              className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors font-medium"
            >
              رفتن به پنل کاربری
            </button>
          </div>
        </div>
      </div>
    );
  }

  // کاربر مجوز دارد، محتوا نمایش داده شود
  return <>{children}</>;
}