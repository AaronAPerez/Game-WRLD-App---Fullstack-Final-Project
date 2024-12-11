export class AppError extends Error {
    constructor(
      message: string,
      public code: string,
      public status?: number,
      public details?: any
    ) {
      super(message);
      this.name = 'AppError';
    }
  }
  
  export const handleApiError = (error: any): AppError => {
    if (error.response) {
      // Handle server errors
      return new AppError(
        error.response.data.message || 'Server error',
        error.response.data.code || 'SERVER_ERROR',
        error.response.status,
        error.response.data
      );
    }
    if (error.request) {
      // Handle network errors
      return new AppError(
        'Network error',
        'NETWORK_ERROR',
        0
      );
    }
    // Handle application errors
    return new AppError(
      error.message || 'Application error',
      'APP_ERROR'
    );
  };