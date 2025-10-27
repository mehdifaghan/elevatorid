import React, { useState, useEffect } from 'react';
import { Bell, Settings, User, Wallet, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { SidebarTrigger } from '../ui/sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { realApiRequest, type RealApiError } from '../../lib/real-api-client';
import { toast } from 'sonner@2.0.3';
import { WalletInfo } from '../../types/api';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for wallet information
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);

  // Check if we're in any user panel (API or Demo)
  const isUserPanel = location.pathname.startsWith('/api/user') || 
                      location.pathname.startsWith('/demo/user') ||
                      (location.pathname.startsWith('/user') && user?.role === 'user');
  
  // Check if we're specifically in API user panel (for actual API calls)
  const isApiUserPanel = location.pathname.startsWith('/api/user') || 
                         (location.pathname.startsWith('/user') && user?.role === 'user');

  // Fetch wallet information
  const fetchWalletInfo = async () => {
    if (!isUserPanel) return;
    
    setWalletLoading(true);
    setWalletError(null);
    
    try {
      // If it's demo user panel, use mock data
      if (location.pathname.startsWith('/demo/user')) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock wallet data for demo
        const mockWalletInfo: WalletInfo = {
          balance: 2450000, // 2,450,000 ریال
          currency: 'IRR',
          lastUpdate: new Date().toLocaleDateString('fa-IR')
        };
        
        setWalletInfo(mockWalletInfo);
      } else {
        // Real API call for API user panel
        const response = await realApiRequest.get<WalletInfo>('/user/wallet/balance');
        setWalletInfo(response);
      }
    } catch (error) {
      const apiError = error as RealApiError;
      setWalletError(apiError.message);
      console.error('Error fetching wallet info:', apiError);
    } finally {
      setWalletLoading(false);
    }
  };

  // Fetch wallet info on component mount and when location changes
  useEffect(() => {
    if (isUserPanel) {
      fetchWalletInfo();
    } else {
      // Clear wallet info if not in user panel
      setWalletInfo(null);
      setWalletError(null);
    }
  }, [isUserPanel, location.pathname]);

  // Format currency amount in Persian
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fa-IR', {
      style: 'currency',
      currency: 'IRR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('IRR', 'ریال');
  };

  const handleLogout = () => {
    logout();
  };

  const handleProfileClick = () => {
    // Determine if we're in demo mode or authenticated mode
    const isDemoAdmin = location.pathname.startsWith('/demo/admin');
    const isDemoUser = location.pathname.startsWith('/demo/user');
    const isAuthenticatedAdmin = location.pathname.startsWith('/admin') && user?.role === 'admin';
    const isAuthenticatedUser = location.pathname.startsWith('/user') && user?.role === 'user';

    if (isDemoAdmin) {
      navigate('/demo/admin/profile');
    } else if (isDemoUser) {
      navigate('/demo/user/profile');
    } else if (isAuthenticatedAdmin) {
      navigate('/admin/profile');
    } else if (isAuthenticatedUser) {
      navigate('/user/profile');
    }
  };

  const handleSettingsClick = () => {
    // Determine if we're in demo mode or authenticated mode
    const isDemoAdmin = location.pathname.startsWith('/demo/admin');
    const isDemoUser = location.pathname.startsWith('/demo/user');
    const isAuthenticatedAdmin = location.pathname.startsWith('/admin') && user?.role === 'admin';
    const isAuthenticatedUser = location.pathname.startsWith('/user') && user?.role === 'user';

    if (isDemoAdmin) {
      navigate('/demo/admin/settings');
    } else if (isDemoUser) {
      navigate('/demo/user/settings');
    } else if (isAuthenticatedAdmin) {
      navigate('/admin/settings');
    } else if (isAuthenticatedUser) {
      navigate('/user/settings');
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 sm:px-6">
        {/* Sidebar Toggle - سمت راست در RTL */}
        <div className="flex items-center">
          <SidebarTrigger />
        </div>

        {/* عنوان - وسط */}
        <div className="flex-1 text-center px-4">
          <h1 className="font-semibold text-sm sm:text-base truncate">
            سامانه ردیابی قطعات و شناسنامه آسانسور
          </h1>
        </div>

        {/* منوهای کاربری - سمت چپ در RTL */}
        <div className="flex items-center gap-2">
          {/* Wallet - Show in all user panels (API and Demo) */}
          {isUserPanel && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 px-3 bg-green-50 border-green-200 hover:bg-green-100 text-green-800"
                onClick={fetchWalletInfo}
                disabled={walletLoading}
                title={walletInfo ? `آخرین به‌روزرسانی: ${walletInfo.lastUpdate}` : 'کیف پول'}
              >
                {walletLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Wallet className="h-4 w-4" />
                )}
                <span className="hidden sm:inline text-sm font-medium">
                  {walletInfo ? (
                    formatCurrency(walletInfo.balance)
                  ) : walletError ? (
                    'خطا'
                  ) : walletLoading ? (
                    'بارگذاری...'
                  ) : (
                    'کیف پول'
                  )}
                </span>
                {/* Mobile view - show only icon with balance as badge */}
                <span className="sm:hidden text-xs font-bold">
                  {walletInfo && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      {Math.floor(walletInfo.balance / 1000)}K
                    </Badge>
                  )}
                </span>
              </Button>
            </div>
          )}
          
          {/* Notifications - Hidden on small screens */}
          <Button variant="ghost" size="sm" className="relative hidden sm:flex">
            <Bell className="h-4 w-4" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 px-2 sm:px-3">
                <Avatar className="h-7 w-7">
                  <AvatarImage />
                  <AvatarFallback className="text-xs">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm max-w-20 truncate">
                  {user?.username}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-right">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.username || 'کاربر نمونه'}</p>
                  {/* Company Code - only show for non-admin users */}
                  {user?.role !== 'admin' && (
                    <p className="text-xs text-muted-foreground">
                      کد شرکت: CMP-{(user?.id || 1001).toString().padStart(6, '0')}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {user?.email || user?.mobile || 'حالت دمو'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer justify-end gap-2 focus:bg-accent" 
                onClick={handleProfileClick}
              >
                <span>پروفایل</span>
                <User className="w-4 h-4" />
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer justify-end gap-2 focus:bg-accent" 
                onClick={handleSettingsClick}
              >
                <span>تنظیمات</span>
                <Settings className="w-4 h-4" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 justify-end gap-2"
                onClick={handleLogout}
              >
                <span>خروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}