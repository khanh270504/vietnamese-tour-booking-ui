import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// 1. Cấu hình cơ bản
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  // CỰC KỲ QUAN TRỌNG: Bắt buộc phải có cờ này để trình duyệt tự động gửi Cookie
  withCredentials: true, 
});

// 2. Interceptor gắn Access Token (Token này vẫn lưu ở localStorage)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Xử lý Silent Refresh với HttpOnly Cookie
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Bắt lỗi 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API Refresh. 
        // LƯU Ý: Không truyền body, nhưng phải bật withCredentials để axios gốc gửi Cookie đi
        const response = await axios.post(
          'http://localhost:8080/auth/refresh',
          {}, // Body rỗng
          { withCredentials: true } 
        );

        // Bóc tách JSON theo chuẩn ApiResponse của Backend: { result: { token: "...", authenticated: true } }
        const newAccessToken = response.data.result.token;

        // Chỉ lưu Access Token mới
        localStorage.setItem('access_token', newAccessToken);

        // Cập nhật header cho luồng hiện tại
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        return api(originalRequest);
      } catch (refreshError) {
        // Nếu refresh lỗi (cookie hết hạn hoặc không hợp lệ) -> Đuổi ra ngoài
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// 4. Hàm Logout
const handleLogout = () => {
  // Chỉ xóa Access Token. Refresh Token là HttpOnly cookie nên JS không xóa được.
  // Nếu muốn chuẩn 100%, phải gọi thêm API /auth/logout để Backend tự xóa Cookie.
  localStorage.removeItem('access_token');
  window.location.href = '/login'; 
};

export default api;