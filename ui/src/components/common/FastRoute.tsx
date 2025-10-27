import React, { Suspense } from 'react';

interface FastRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

function DefaultFallback() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="text-center space-y-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
        <p className="text-xs text-muted-foreground">بارگذاری...</p>
      </div>
    </div>
  );
}

export default function FastRoute({ children, fallback = <DefaultFallback /> }: FastRouteProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}