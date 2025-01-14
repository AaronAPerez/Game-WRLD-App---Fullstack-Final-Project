import { authService } from "@/services/authService";
import { LoginDTO } from "@/types/auth";
import { storage } from "@/utils";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
    return useMutation({
      mutationFn: async (credentials: LoginDTO) => {
        const response = await authService.login(credentials);
        if (response.data?.token) {
          storage.setToken(response.data.token);
        }
        return response;
      }
    });
  };