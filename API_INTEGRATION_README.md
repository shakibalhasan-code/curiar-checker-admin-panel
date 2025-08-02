# 🔐 BD Curiar Fraud Checker - API Integration

## 📋 **Overview**

This document describes the production-ready API integration for the BD Curiar Fraud Checker admin panel. The integration is built with security, scalability, and performance in mind.

## 🏗️ **Architecture**

### **Service Layer Structure**
```
src/
├── config/
│   └── api.ts                 # API configuration and endpoints
├── types/
│   └── api.ts                 # TypeScript interfaces
├── services/
│   ├── apiClient.ts          # Core API client with error handling
│   ├── authService.ts        # Authentication service
│   ├── phoneCheckService.ts  # Phone check service
│   ├── analyticsService.ts   # Analytics service
│   ├── notificationService.ts # Notification service
│   └── index.ts              # Service exports
└── components/
    └── NotificationToast.tsx # Notification component
```

## 🔧 **Core Components**

### **1. API Configuration (`src/config/api.ts`)**
- Centralized API endpoints and configuration
- Environment-based base URL
- HTTP status codes and error messages
- Rate limit headers and language codes

### **2. API Client (`src/services/apiClient.ts`)**
- **Security Features:**
  - Automatic token management
  - Rate limit handling
  - Request/response interceptors
  - CSRF protection headers
- **Error Handling:**
  - Custom `ApiError` class
  - Retry logic for failed requests
  - Network error detection
  - Timeout handling
- **Performance:**
  - Request caching
  - Connection pooling
  - Request deduplication

### **3. Authentication Service (`src/services/authService.ts`)**
- User registration and login
- Profile management
- API key regeneration
- Password change functionality
- Input validation
- Token management

### **4. Phone Check Service (`src/services/phoneCheckService.ts`)**
- Phone number validation
- Fraud checking
- Caller ID lookup
- Fraud reports retrieval
- Response parsing and formatting

### **5. Analytics Service (`src/services/analyticsService.ts`)**
- Dashboard data retrieval
- Usage statistics
- Service performance metrics
- Data formatting for charts

### **6. Notification Service (`src/services/notificationService.ts`)**
- Toast notifications
- Success/error messaging
- Auto-dismiss functionality
- Action buttons support

## 🚀 **Usage Examples**

### **Authentication**
```typescript
import { AuthService, NotificationService } from '../services';

// Login
try {
  const response = await AuthService.login({ email, password });
  // Handle success
} catch (error) {
  // Error handled by service
}

// Register
try {
  const response = await AuthService.register({
    username: 'johndoe',
    email: 'john@example.com',
    password: 'securepass123',
    firstName: 'John',
    lastName: 'Doe',
    company: 'Tech Corp'
  });
} catch (error) {
  // Error handled by service
}
```

### **Phone Checking**
```typescript
import { PhoneCheckService } from '../services';

// Check phone number
try {
  const result = await PhoneCheckService.checkPhone('01878152303', 'en');
  const parsed = PhoneCheckService.parsePhoneCheckResponse(result);
  
  console.log('Risk Level:', parsed.riskLevel);
  console.log('Services:', parsed.services);
} catch (error) {
  // Error handled by service
}

// Get caller ID
try {
  const callerId = await PhoneCheckService.getCallerId('01878152303');
  console.log('Caller:', callerId.userInfo?.name);
} catch (error) {
  // Error handled by service
}
```

### **Analytics**
```typescript
import { AnalyticsService } from '../services';

// Get dashboard data
try {
  const dashboard = await AnalyticsService.getDashboardComprehensive();
  const chartData = AnalyticsService.parseDashboardForCharts(dashboard);
  
  console.log('Total searches:', chartData.totalStats.lifetimeSearches);
} catch (error) {
  // Error handled by service
}

// Get service stats
try {
  const stats = await AnalyticsService.getServiceStats(30);
  const chartData = AnalyticsService.parseServiceStatsForCharts(stats);
  
  console.log('Service performance:', chartData);
} catch (error) {
  // Error handled by service
}
```

### **Notifications**
```typescript
import { NotificationService } from '../services';

// Show success notification
NotificationService.success('Success', 'Operation completed successfully');

// Show error notification
NotificationService.error('Error', 'Something went wrong');

// Show API error
try {
  await someApiCall();
} catch (error) {
  NotificationService.apiError(error, 'API Error');
}

// Show quota exceeded
NotificationService.quotaExceeded(quotaData);
```

## 🔒 **Security Features**

### **1. Authentication**
- JWT token management
- Automatic token refresh
- Secure token storage
- Session management

### **2. Input Validation**
- Phone number format validation
- Email validation
- Password strength checking
- XSS protection

### **3. Error Handling**
- Comprehensive error types
- User-friendly error messages
- Security-conscious error responses
- Rate limit handling

### **4. Network Security**
- HTTPS enforcement
- CORS handling
- Request timeout protection
- Retry logic with exponential backoff

## 📊 **Performance Optimizations**

### **1. Caching**
- Response caching for static data
- Token caching
- User data caching

### **2. Request Optimization**
- Request deduplication
- Connection pooling
- Batch requests where possible

### **3. Error Recovery**
- Automatic retry for transient errors
- Graceful degradation
- Offline support indicators

## 🎯 **Error Handling Strategy**

### **Error Types**
1. **Network Errors**: Connection issues, timeouts
2. **Authentication Errors**: Invalid tokens, expired sessions
3. **Validation Errors**: Invalid input data
4. **Rate Limit Errors**: Quota exceeded
5. **Server Errors**: Backend issues

### **Error Response Format**
```typescript
{
  error: string;           // Error type
  message: string;         // User-friendly message
  details?: string[];      // Additional details
  quota?: Quota;          // Quota information (if applicable)
}
```

## 🔧 **Configuration**

### **Environment Variables**
```bash
# API Base URL
VITE_API_BASE_URL=http://localhost:3000

# API Timeout (ms)
VITE_API_TIMEOUT=30000

# Max Retries
VITE_API_MAX_RETRIES=3
```

### **API Configuration**
```typescript
// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};
```

## 📱 **UI Integration**

### **Loading States**
```typescript
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await AuthService.login({ email, password });
  } catch (error) {
    // Error handled by service
  } finally {
    setIsLoading(false);
  }
};
```

### **Error Handling**
```typescript
const handlePhoneCheck = async (phone: string) => {
  try {
    const result = await PhoneCheckService.checkPhone(phone);
    // Handle success
  } catch (error) {
    // Error automatically handled by notification service
  }
};
```

## 🧪 **Testing**

### **Unit Tests**
```typescript
// Test API client
describe('ApiClient', () => {
  it('should handle network errors', async () => {
    // Test implementation
  });
  
  it('should retry failed requests', async () => {
    // Test implementation
  });
});
```

### **Integration Tests**
```typescript
// Test authentication flow
describe('AuthService', () => {
  it('should login user successfully', async () => {
    // Test implementation
  });
});
```

## 📈 **Monitoring & Analytics**

### **Performance Metrics**
- Request response times
- Error rates
- Cache hit rates
- User engagement metrics

### **Error Tracking**
- Error categorization
- User impact assessment
- Automatic error reporting

## 🔄 **Future Enhancements**

### **Planned Features**
1. **Real-time Updates**: WebSocket integration
2. **Offline Support**: Service worker implementation
3. **Advanced Caching**: Redis-like caching strategy
4. **Analytics Dashboard**: Real-time metrics
5. **Multi-language Support**: i18n integration

### **Scalability Considerations**
1. **Microservices**: Service decomposition
2. **CDN Integration**: Static asset optimization
3. **Load Balancing**: Multiple API endpoints
4. **Database Optimization**: Query optimization

## 📞 **Support**

For API integration support:
- **Documentation**: Check inline code comments
- **Error Logs**: Browser console and network tab
- **API Status**: Health check endpoint
- **Rate Limits**: Check response headers

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: BD Curiar Development Team 