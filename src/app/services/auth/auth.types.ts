export interface ApiResponse<T> {
  message?: string;
  result: T;
}

export interface AuthenticationResponse {
  token: string;        
  authenticated: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface IntrospectRequest {
  token: string;
}

export interface IntrospectResponse {
  valid: boolean;
}