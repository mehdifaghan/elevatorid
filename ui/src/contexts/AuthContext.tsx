import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner@2.0.3';
import { authService } from '../services/auth.service';
import { setTokens, clearTokens, getStoredTokens } from '../lib/api-client';
import { MeResponse, ProfileType } from '../types/api';

interface User {
  id: number;
  phone: string;
  status: 'pending' | 'active' | 'suspended';
  profiles: Array<{
    id: number;
    profileType: ProfileType;
    isActive: boolean;
    company: {
      id: number;
      name: string;
      tradeId: string;
      province: string;
      city: string;
      address: string;
      postalCode: string;
      ceoPhone: string;
      email: string;
    };
  }>;
  // Legacy compatibility
  role: 'admin' | 'user';
  mobile: string;
  username: string;
  companyName?: string;
  companyId?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const determineUserRole = useCallback((profiles: MeResponse['profiles']): 'admin' | 'user' => {
    // Check if user has coop_org profile (admin role)
    const hasCoopOrgProfile = profiles.some(p => p.profileType === 'coop_org');
    return hasCoopOrgProfile ? 'admin' : 'user';
  }, []);

  const transformUserData = useCallback((userData: MeResponse): User => {
    return {
      id: userData.user.id,
      phone: userData.user.phone,
      status: userData.user.status,
      profiles: userData.profiles.map(profile => ({
        id: profile.id,
        profileType: profile.profileType,
        isActive: profile.isActive,
        company: profile.company
      })),
      // Legacy compatibility
      role: determineUserRole(userData.profiles),
      mobile: userData.user.phone,
      username: userData.profiles[0]?.company?.name || 'کاربر',
      companyName: userData.profiles[0]?.company?.name,
      companyId: userData.profiles[0]?.company?.id,
    };
  }, [determineUserRole]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const { accessToken, refreshToken } = getStoredTokens();
      
      // In development mode or when accessing demo routes, create mock auth state
      const isDemoRoute = window.location.pathname.startsWith('/demo/');
      
      // Only create mock auth for demo routes, not for API routes
      if (isDemoRoute && (!accessToken || accessToken === 'mock-access-token')) {
        // Set mock tokens for demo mode
        if (!accessToken) {
          setTokens('mock-access-token', 'mock-refresh-token');
        }
        
        // Create mock user based on route
        const isAdmin = window.location.pathname.includes('/admin');
        const mockUser: User = {
          id: 1,
          phone: isAdmin ? '09121111111' : '09122222222',
          status: 'active',
          profiles: [{
            id: 1,
            profileType: isAdmin ? 'coop_org' : 'producer',
            isActive: true,
            company: {
              id: 1,
              name: isAdmin ? 'مدیر سیستم' : 'شرکت نمونه',
              tradeId: '12345',
              province: 'تهران',
              city: 'تهران',
              address: 'تهران، خیابان ولیعصر، پلاک 123',
              postalCode: '1234567890',
              ceoPhone: '02112345678',
              email: 'info@company.com'
            }
          }],
          role: isAdmin ? 'admin' : 'user',
          mobile: isAdmin ? '09121111111' : '09122222222',
          username: isAdmin ? 'مدیر سیستم' : 'شرکت نمونه',
          companyName: isAdmin ? 'مدیر سیستم' : 'شرکت نمونه',
          companyId: 1
        };
        
        setUser(mockUser);
        setIsLoading(false);
        return;
      }
      
      if (!accessToken || !refreshToken) {
        setIsLoading(false);
        return;
      }

      // Set tokens for API client
      setTokens(accessToken, refreshToken);

      try {
        // Get user info from API
        const userData = await authService.getMe();
        const transformedUser = transformUserData(userData);
        setUser(transformedUser);
      } catch (apiError) {
        console.error('API call failed:', apiError);
        // Clear invalid tokens
        clearTokens();
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [transformUserData]);

  useEffect(() => {
    // Only run on mount
    checkAuthStatus();
  }, []); // Remove checkAuthStatus from dependency array to prevent infinite loops

  const login = useCallback(async (accessToken: string, refreshTokenValue?: string) => {
    try {
      // Store tokens - using the provided access token
      setTokens(accessToken, refreshTokenValue || 'refresh-token-placeholder');
      
      // Get user data using the provided token
      const userData = await authService.getMe();
      const transformedUser = transformUserData(userData);
      
      setUser(transformedUser);
      toast.success('ورود موفقیت‌آمیز بود');
    } catch (error) {
      // If token is invalid, clear it
      clearTokens();
      setUser(null);
      throw error;
    }
  }, [transformUserData]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      clearTokens();
      setUser(null);
      toast.success('خروج انجام شد');
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const tokenResponse = await authService.refreshToken();
      setTokens(tokenResponse.accessToken, tokenResponse.refreshToken);
    } catch (error) {
      await logout();
      throw error;
    }
  }, [logout]);

  const updateProfile = useCallback(async (data: any) => {
    try {
      const updatedData = await authService.updateMe(data);
      const transformedUser = transformUserData(updatedData);
      
      setUser(transformedUser);
      toast.success('اطلاعات با موفقیت به‌روزرسانی شد');
    } catch (error) {
      // Error handling is done in API client interceptor
      throw error;
    }
  }, [transformUserData]);

  const value = useMemo(() => ({
    user,
    isLoading,
    login,
    logout,
    refreshToken,
    updateProfile,
  }), [user, isLoading, login, logout, refreshToken, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}