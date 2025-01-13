import axios from "axios";

export const logError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    } else if (error instanceof Error) {
      console.error('Application Error:', error.message);
    } else {
      console.error('Unknown Error:', error);
    }
  };