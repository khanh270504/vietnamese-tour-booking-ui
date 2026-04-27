import api from '../api';
import { 
  ApiResponse, 
  AuthenticationResponse, 
  LoginRequest, 
  IntrospectRequest, 
  IntrospectResponse 
} from './auth.types';

export const authService = {
  login: async (data: LoginRequest): Promise<ApiResponse<AuthenticationResponse>> => {
    const response = await api.post<ApiResponse<AuthenticationResponse>>('/auth/login', data);
    
    if (response.data.result.token) {
      localStorage.setItem('access_token', response.data.result.token);
    }
    return response.data;
  },

  
  decodeToken: (token: string) => {
    try {
      const base64Url = token.split('.')[1]; 
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  },

  getUserProfile: () => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    
    const decoded = authService.decodeToken(token);
    if (!decoded) return null;

    return {
      name: decoded.sub || decoded.username || "Thành viên",
      role: decoded.scope || decoded.role || "USER",
    };
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    
    const decoded = authService.decodeToken(token);
    if (!decoded) return false;

    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  },

  register: async (data: any): Promise<ApiResponse<AuthenticationResponse>> => {
    const response = await api.post<ApiResponse<AuthenticationResponse>>('/auth/register', data);
    return response.data;
  },

  introspect: async (data: IntrospectRequest): Promise<ApiResponse<IntrospectResponse>> => {
    const response = await api.post<ApiResponse<IntrospectResponse>>('/auth/introspect', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      localStorage.removeItem('access_token');
      window.location.href = '/'; 
    }
  },
  
  updateProfile: async (data: any): Promise<ApiResponse<any>> => {
    // Giả định endpoint của ông giáo là /customers/profile hoặc /users/profile
    const response = await api.put<ApiResponse<any>>('/customers/profile', data);
    return response.data;
},
};