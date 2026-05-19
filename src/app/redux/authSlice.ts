import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  user: {
    name: string;
    role: string;
    email?: string;
  } | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 🎯 Hàm này gọi khi đăng nhập thành công (cả Google & Email)
    setCredentials: (state, action: PayloadAction<{ token: string; user: any }>) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isLoggedIn = true;
      // Vẫn lưu vào localStorage để authService dùng nếu cần
      localStorage.setItem('access_token', token);
    },
    // 🎯 Hàm này gọi khi đăng xuất
    logOut: (state) => {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem('access_token');
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;