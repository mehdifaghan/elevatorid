/**
 * Simple API Status Badge
 * نمایش ساده وضعیت API برای صفحات عمومی
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { Server } from 'lucide-react';
import apiConfig from '../../config/api.config';

export default function SimpleAPIStatusBadge() {
  const [envName, setEnvName] = useState<string>(apiConfig.getCurrentEnvironment().displayName);

  useEffect(() => {
    const unsubscribe = apiConfig.subscribe(() => {
      setEnvName(apiConfig.getCurrentEnvironment().displayName);
    });

    return unsubscribe;
  }, []);

  const isProduction = apiConfig.getCurrentEnvironment().name === 'production';

  return (
    <Link to="/api-settings">
      <Badge 
        variant={isProduction ? "default" : "secondary"} 
        className="cursor-pointer hover:opacity-80 transition-opacity gap-1 text-xs"
      >
        <Server className="h-3 w-3" />
        {envName}
      </Badge>
    </Link>
  );
}
