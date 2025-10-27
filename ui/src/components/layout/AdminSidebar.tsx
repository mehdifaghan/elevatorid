import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
} from '../ui/sidebar';
import {
  LayoutDashboard,
  Users,
  Settings,
  Package,
  ArrowRightLeft,
  Building,
  MessageSquare,
  BarChart3,
  User,
  LogOut,
  Code,
  FileText,
  FolderTree,
  Tags,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useConfigLockStatus } from '../../hooks/useConfigLockStatus';

const menuItems = [
  {
    title: 'داشبورد',
    icon: LayoutDashboard,
    path: '/admin',
  },
  {
    title: 'پروفایل',
    icon: User,
    path: '/admin/profile',
  },
  {
    title: 'تنظیمات',
    icon: Settings,
    path: '/admin/settings',
  },
  {
    title: 'کاربران',
    icon: Users,
    path: '/admin/users',
  },
  {
    title: 'قطعات',
    icon: Package,
    path: '/admin/parts',
  },
  {
    title: 'مدیریت دسته‌بندی‌ها',
    icon: Tags,
    path: '/admin/categories',
  },
  {
    title: 'انتقال‌ها',
    icon: ArrowRightLeft,
    path: '/admin/transfers',
  },
  {
    title: 'آسانسورها',
    icon: Building,
    path: '/admin/elevators',
  },
  {
    title: 'درخواست‌ها و شکایات',
    icon: MessageSquare,
    path: '/admin/requests',
  },
  {
    title: 'گزارش‌ها',
    icon: BarChart3,
    path: '/admin/reports',
  },
  {
    title: 'مدیریت API',
    icon: Code,
    path: '/admin/api',
  },
  {
    title: 'مستندات API',
    icon: FileText,
    path: '/admin/api-docs',
  },
  {
    title: 'پیکربندی API',
    icon: Settings,
    path: '/admin/api-config',
  },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { shouldShowConfigMenu } = useConfigLockStatus();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    // Handle demo mode navigation
    if (location.pathname.startsWith('/demo/admin')) {
      const demoPath = path.replace('/admin', '/demo/admin');
      navigate(demoPath);
    } else if (location.pathname.startsWith('/api/admin')) {
      const apiPath = path.replace('/admin', '/api/admin');
      navigate(apiPath);
    } else {
      navigate(path);
    }
  };

  // فیلتر کردن منوها بر اساس وضعیت قفل
  const filteredMenuItems = menuItems.filter(item => {
    // اگر منوی API Config است و قفل شده، نمایش نده
    if (item.path.endsWith('/api-config') && !shouldShowConfigMenu) {
      return false;
    }
    return true;
  });

  // No need for custom tooltip logic, shadcn sidebar handles it automatically

  return (
      <Sidebar 
        side="right" 
        collapsible="icon"
        className="border-l rtl-sidebar"
      >
        <SidebarHeader className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <Building className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="text-right overflow-hidden">
              <h2 className="font-semibold text-base truncate">سامانه ردیابی</h2>
              <p className="text-sm text-muted-foreground truncate">پنل مدیریت</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredMenuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(item.path)}
                      isActive={
                        location.pathname === item.path ||
                        location.pathname === item.path.replace('/admin', '/demo/admin') ||
                        location.pathname === item.path.replace('/admin', '/api/admin')
                      }
                      tooltip={item.title}
                      className="w-full justify-start text-right flex-row-reverse hover:bg-accent transition-colors duration-200 sidebar-menu-button"
                    >
                      <span className="flex-1 text-right">{item.title}</span>
                      <item.icon className="w-5 h-5 text-muted-foreground shrink-0" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t">
          <SidebarMenuButton
            onClick={handleLogout}
            tooltip="خروج"
            className="w-full justify-start text-right flex-row-reverse text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors duration-200 sidebar-menu-button"
          >
            <span className="flex-1 text-right">خروج</span>
            <LogOut className="w-5 h-5 shrink-0" />
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
  );
}