const sensitiveKeys = new Set([
    'password', 'token', 'secret', 'email', 'creditCard',
    // Add any other sensitive keys here
  ]);
  
  export function sanitizeData<T>(data: T): T {
    if (typeof data !== 'object' || data === null) {
      return data;
    }
  
    if (Array.isArray(data)) {
      return data.map(item => sanitizeData(item)) as T;
    }
  
    const sanitized = {} as Record<string, unknown>;
  
    for (const [key, value] of Object.entries(data)) {
      if (sensitiveKeys.has(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }
  
    return sanitized as T;
  }
  
  // Async version
  export async function sanitizeDataAsync<T>(data: T): Promise<T> {
    return new Promise((resolve) => {
      resolve(sanitizeData(data));
    });
  }