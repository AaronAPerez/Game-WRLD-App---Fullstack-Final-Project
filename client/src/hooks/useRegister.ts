import { authService } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
    return useMutation({
      mutationFn: authService.register
    });
  };