// Export all services
export { authService } from './auth.service';
export { adminService } from './admin.service';
export { catalogService } from './catalog.service';
export { partsService } from './parts.service';
export { elevatorsService } from './elevators.service';
export { userService } from './user.service';
export { captchaService } from './captcha.service';
export { default as dashboardService } from './dashboard.service';

// Export API client utilities
export { apiRequest, setTokens, clearTokens } from '../lib/api-client';

// Export types
export * from '../types/api';