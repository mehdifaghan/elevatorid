import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  makeRequest: (apiCall: () => Promise<any>) => Promise<{ success: boolean; data?: any; error?: string }>;
  isOnline: boolean;
}

export function useApi<T = any>(
  apiFunction?: (...args: any[]) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
  } = {}
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const execute = useCallback(
    async (...args: any[]) => {
      if (!apiFunction) return null;
      
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });

        if (options.onSuccess) {
          options.onSuccess(result);
        }

        if (options.showSuccessToast) {
          toast.success('عملیات با موفقیت انجام شد');
        }

        return result;
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'خطایی رخ داده است';
        setState({ data: null, loading: false, error: errorMessage });

        if (options.onError) {
          options.onError(error);
        }

        if (options.showErrorToast !== false) {
          toast.error(errorMessage);
        }

        return null;
      }
    },
    [apiFunction, options]
  );

  const makeRequest = useCallback(
    async (apiCall: () => Promise<any>) => {
      try {
        const result = await apiCall();
        return { success: true, data: result };
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'خطایی رخ داده است';
        console.error('API Error:', error);
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
    makeRequest,
    isOnline,
  };
}

// Hook for handling paginated data
export function usePaginatedApi<T = any>(
  apiFunction: (params: any) => Promise<{ items: T[]; pagination: any }>,
  initialParams: any = {}
) {
  const [params, setParams] = useState(initialParams);
  
  const { data, loading, error, execute } = useApi(
    (currentParams?: any) => {
      const finalParams = currentParams || params;
      return apiFunction(finalParams);
    },
    { showErrorToast: true }
  );

  const loadData = useCallback((newParams?: any) => {
    const mergedParams = { ...params, ...newParams };
    setParams(mergedParams);
    return execute(mergedParams);
  }, [params, execute]);

  const nextPage = useCallback(() => {
    if (data?.pagination && data.pagination.page * data.pagination.size < data.pagination.total) {
      const nextPageParams = { ...params, page: (params.page || 1) + 1 };
      setParams(nextPageParams);
      execute(nextPageParams);
    }
  }, [data, params, execute]);

  const prevPage = useCallback(() => {
    if (params.page && params.page > 1) {
      const prevPageParams = { ...params, page: params.page - 1 };
      setParams(prevPageParams);
      execute(prevPageParams);
    }
  }, [params, execute]);

  return {
    data: data?.items || [],
    pagination: data?.pagination,
    loading,
    error,
    params,
    loadData,
    nextPage,
    prevPage,
    setParams,
  };
}