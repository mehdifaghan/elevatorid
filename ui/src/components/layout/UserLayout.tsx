import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '../ui/sidebar';
import UserSidebar from './UserSidebar';
import Header from './Header';

export default function UserLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full" dir="rtl">
        <div className="flex min-h-screen">
          <UserSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="flex-1 p-3 sm:p-6 overflow-auto bg-background">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}