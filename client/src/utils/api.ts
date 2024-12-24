import toast from "react-hot-toast";

export const handleApiError = (error: any) => {
    if (error.response) {
      toast.error(error.response.data.message);
    } else {
      toast.error('An unexpected error occurred');
    }
  };