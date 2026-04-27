import { createBrowserRouter } from "react-router-dom";
import { Root } from "./pages/Root";
import { HomePage } from "./pages/HomePage";
import { TourListingPage } from "./pages/TourListingPage";
import { TourDetailPage } from "./pages/TourDetailPage";
import { BookingPage } from "./pages/BookingPage";
import { PaymentPage } from "./pages/PaymentPage";
import { ConfirmationPage } from "./pages/ConfirmationPage";
import { LookupPage } from "./pages/LookupPage";
import { WishlistPage } from "./pages/WishlistPage";
import { ProfilePage } from "./pages/ProfilePage";
import { MyOrdersPage } from "./pages/MyOrdersPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { NotFound } from "./pages/NotFound";
import { ProtectedRoute } from "./components/guard/ProtectedRoute"; // File check Role

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      // 🟢 NHÁNH 1: PUBLIC (Ai cũng vào được, không cần check Role)
      { index: true, element: <HomePage /> },
      { path: "tours", element: <TourListingPage /> },
      { path: "tours/:id", element: <TourDetailPage /> },
      { path: "lookup", element: <LookupPage /> },
      
      // 🟡 NHÁNH 2: CUSTOMER (Dùng ROLE để tách, chỉ khách đã đăng nhập mới được vào)
      {
        element: <ProtectedRoute allowedRoles={["ROLE_USER", "CUSTOMER"]} />,
        children: [
          { path: "booking/:id", element: <BookingPage /> },
          { path: "payment/:bookingId", element: <PaymentPage /> },
          { path: "confirmation/:bookingId", element: <ConfirmationPage /> },
          { path: "my-orders", element: <MyOrdersPage /> },
          { path: "wishlist", element: <WishlistPage /> },
          { path: "profile", element: <ProfilePage /> },
        ]
      },
      
      { path: "*", element: <NotFound /> },
    ],
  },

  // ⚪ NHÁNH 3: AUTH (Trang đăng nhập trắng trơn, không có Root)
  { path: "login", element: <LoginPage /> },
  { path: "register", element: <RegisterPage /> },
  { path: "forgot-password", element: <ForgotPasswordPage /> },

  // 🔴 NHÁNH 4: ADMIN (Chưa làm nên cứ để comment // theo đúng ý ông giáo)
  /*
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ADMIN"]} />,
    children: [
      // { index: true, element: <AdminDashboard /> },
      // { path: "tours", element: <AdminToursPage /> },
    ],
  },
  */
]);