export interface LoginDTO {
    userName: string;
    password: string;
  }
  
  export interface CreateAccountDTO {
    username: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
  }