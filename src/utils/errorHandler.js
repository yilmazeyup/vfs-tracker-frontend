// Error handling utilities
export const formatWaitTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

export const handleApiError = (error) => {
  if (error.response) {
    // API responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || 'API Error';
    
    switch (status) {
      case 401:
        return { message: 'Authentication failed', description: 'Please check your VFS credentials' };
      case 429:
        return { message: 'Rate limit exceeded', description: 'Too many requests. Please wait before retrying.' };
      case 503:
        return { message: 'VFS service unavailable', description: 'VFS website may be under maintenance' };
      default:
        return { message: `HTTP ${status} Error`, description: message };
    }
  } else if (error.request) {
    // Network error
    return { message: 'Network Error', description: 'Unable to connect to VFS servers' };
  } else {
    // Other error
    return { message: 'Unknown Error', description: error.message || 'An unexpected error occurred' };
  }
};

export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};