import { createBrowserRouter } from "react-router-dom";
// ... (Các import cũ của ông giáo giữ nguyên)
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
import { ProtectedRoute } from "./components/guard/ProtectedRoute";

// 🎯 IMPORT CÁC TRANG QUẢN LÝ (MANAGEMENT)
import { DashboardLayout } from "./management/layout/DashboardLayout";
import { OverviewPage } from "./management/pages/OverviewPage";
import { BookingsPage } from "./management/pages/BookingsPage";
import { TourManagerPage } from "./management/pages/TourManagerPage";
import { CalendarPage } from "./management/pages/CalendarPage";
import { CustomersPage } from "./management/pages/CustomersPage";
import { CRMLeadsPage } from "./management/pages/CRMLeadsPage";
import { PaymentsPage } from "./management/pages/PaymentsPage";
import { VouchersPage } from "./management/pages/VouchersPage";
import { ReviewsPage } from "./management/pages/ReviewsPage";
import { EmployeesPage } from "./management/pages/EmployeesPage";
import { ReportsPage } from "./management/pages/ReportsPage";
import { AutomationPage } from "./management/pages/AutomationPage";
import { AdvancedAnalyticsPage } from "./management/pages/AdvancedAnalyticsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      // 🟢 NHÁNH 1: PUBLIC
      { index: true, element: <HomePage /> },
      { path: "tours", element: <TourListingPage /> },
      { path: "tours/:id", element: <TourDetailPage /> },
      { path: "lookup", element: <LookupPage /> },
      { path: "booking/:id", element: <BookingPage /> },
      { path: "payment/:bookingId", element: <PaymentPage /> },
      { path: "confirmation/:bookingId", element: <ConfirmationPage /> },

      // 🟡 NHÁNH 2: CUSTOMER
      {
        element: <ProtectedRoute allowedRoles={["ROLE_USER", "CUSTOMER", "ROLE_CUSTOMER"]} />,
        children: [
          { path: "my-orders", element: <MyOrdersPage /> },
          { path: "wishlist", element: <WishlistPage /> },
          { path: "profile", element: <ProfilePage /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },

  // ⚪ NHÁNH 3: AUTH
  { path: "login", element: <LoginPage /> },
  { path: "register", element: <RegisterPage /> },
  { path: "forgot-password", element: <ForgotPasswordPage /> },

  // 🔴 NHÁNH 4: MANAGEMENT (ADMIN SYSTEM)
  // Toàn bộ hệ thống quản trị nằm ở đây
  {
    path: "/admin",
  element: (
    <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ADMIN", "SALE", "ROLE_SALE"]}>
      <DashboardLayout />
    </ProtectedRoute>
  ),
    children: [
      { index: true, element: <OverviewPage /> }, // Trang mặc định khi vào /admin
      { path: "bookings", element: <BookingsPage /> },
      { path: "tours", element: <TourManagerPage /> },
      { path: "calendar", element: <CalendarPage /> },
      { path: "customers", element: <CustomersPage /> },
      { path: "crm", element: <CRMLeadsPage /> },
      { path: "payments", element: <PaymentsPage /> },
      { path: "vouchers", element: <VouchersPage /> },
      { path: "reviews", element: <ReviewsPage /> },
      { path: "employees", element: <EmployeesPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "analytics", element: <AdvancedAnalyticsPage /> },
      { path: "automation", element: <AutomationPage /> },
      { path: "settings", element: <div className="p-8 font-black uppercase">Cài đặt hệ thống (Đang phát triển)</div> },
    ],
  },
]);