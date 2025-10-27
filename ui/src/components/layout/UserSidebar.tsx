import React from 'react';
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
  Package,
  ArrowRightLeft,
  Building,
  MessageSquare,
  BarChart3,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  {
    title: 'داشبورد',
    icon: LayoutDashboard,
    path: '/user',
  },
  {
    title: 'پروفایل شرکت',
    icon: User,
    path: '/user/profile',
  },
  {
    title: 'تنظیمات',
    icon: Settings,
    path: '/user/settings',
  },
  {
    title: 'مدیریت محصولات',
    icon: Package,
    path: '/user/products',
  },
  {
    title: 'انتقال‌ها',
    icon: ArrowRightLeft,
    path: '/user/transfers',
  },
  {
    title: 'مدیریت آسانسورها',
    icon: Building,
    path: '/user/elevators',
  },
  {
    title: 'درخواست‌ها و شکایات',
    icon: MessageSquare,
    path: '/user/requests',
  },
  {
    title: 'گزارش‌ها',
    icon: BarChart3,
    path: '/user/reports',
  },
];

export default function UserSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    // Handle demo mode navigation
    if (location.pathname.startsWith('/demo/user')) {
      const demoPath = path.replace('/user', '/demo/user');
      navigate(demoPath);
    } else {
      navigate(path);
    }
  };

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
              <p className="text-sm text-muted-foreground truncate">
                {user?.companyName || 'پنل کاربری'}
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(item.path)}
                      isActive={location.pathname === item.path}
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