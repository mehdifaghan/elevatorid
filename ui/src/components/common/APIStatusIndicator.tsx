/**
 * API Status Indicator
 * نمایشگر وضعیت اتصال به API در هدر
 */

import React, { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { Server, CheckCircle2, XCircle, RefreshCw, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiConfig from '../../config/api.config';

export default function APIStatusIndicator() {
  const [config, setConfig] = useState(apiConfig.getConfig());
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    latency?: number;
  } | null>(null);
  
  const navigate = useNavigate();

  // اشتراک در تغییرات config
  useEffect(() => {
    const unsubscribe = apiConfig.subscribe((newConfig) => {
      setConfig(newConfig);
      setConnectionStatus(null); // Reset connection status on config change
    });

    return unsubscribe;
  }, []);

  // بررسی اتصال
  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const result = await apiConfig.checkConnection();
      setConnectionStatus({
        success: result.success,
        latency: result.latency
      });
      setIsOnline(result.success);
    } catch (error) {
      setConnectionStatus({ success: false });
      setIsOnline(false);
    } finally {
      setIsChecking(false);
    }
  };

  // بررسی خودکار هر 30 ثانیه
  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [config]);

  const currentEnv = apiConfig.getCurrentEnvironment();
  const isProduction = currentEnv.name === 'production';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-2 text-xs"
        >
          <Server className="h-3.5 w-3.5" />
          <span className="hidden md:inline">
            {currentEnv.displayName}
          </span>
          {connectionStatus && (
            connectionStatus.success ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-red-500" />
            )
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end" dir="rtl">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Server className="h-4 w-4" />
              وضعیت اتصال API
            </h4>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  connectionStatus
                    ? connectionStatus.success
                      ? 'default'
                      : 'destructive'
                    : 'secondary'
                }
                className="text-xs"
              >
                {connectionStatus
                  ? connectionStatus.success
                    ? `متصل ${connectionStatus.latency ? `(${connectionStatus.latency}ms)` : ''}`
                    : 'قطع شده'
                  : 'در حال بررسی...'}
              </Badge>
              {!isProduction && (
                <Badge variant="outline" className="text-xs">
                  {currentEnv.displayName}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">محیط:</span>
              <code className="text-xs">{currentEnv.displayName}</code>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">نسخه:</span>
              <code className="text-xs">{config.version}</code>
            </div>
            <div className="text-muted-foreground">
              Base URL:
            </div>
            <code className="block text-xs bg-muted p-2 rounded break-all">
              {config.baseURL}
            </code>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={checkConnection}
              disabled={isChecking}
              className="flex-1 text-xs"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="h-3 w-3 ml-1 animate-spin" />
                  بررسی...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 ml-1" />
                  بررسی مجدد
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => navigate('/admin/api-config')}
              className="flex-1 text-xs"
            >
              <Settings className="h-3 w-3 ml-1" />
              تنظیمات
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
