export class ApiError extends Error {
    constructor(
      message: string,
      public status?: number,
      public errors?: string[]
    ) {
      super(message);
      this.name = 'ApiError';
    }
  
    static isApiError(error: unknown): error is ApiError {
      return error instanceof ApiError;
    }
  }
  
  export const handleApiError = (error: unknown) => {
    if (ApiError.isApiError(error)) {
      // Handle structured API errors
      return error.message;
    }
    // Handle unexpected errors
    return 'An unexpected error occurred';
  };