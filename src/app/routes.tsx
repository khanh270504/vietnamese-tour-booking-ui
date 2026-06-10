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
import { ProtectedRoute } from "./components/guard/ProtectedRoute";

// IMPORT CÁC TRANG QUẢN LÝ (MANAGEMENT)
import { DashboardLayout } from "./management/layout/DashboardLayout";
import { OverviewPage } from "./management/pages/OverviewPage";
import { BookingsPage } from "./management/pages/BookingsPage";
import { TourManagerPage } from "./management/pages/TourManagerPage";
import { CalendarPage } from "./management/pages/CalendarPage.tsx";
import { CustomersPage } from "./management/pages/CustomersPage";
import { CRMLeadsPage } from "./management/pages/CRMLeadsPage";
import { PaymentsPage } from "./management/pages/PaymentsPage";
import { VouchersPage } from "./management/pages/VouchersPage";
import { ReviewsPage } from "./management/pages/ReviewsPage";
import { EmployeesPage } from "./management/pages/EmployeesPage";
import { ReportsPage } from "./management/pages/ReportsPage";
import { AutomationPage } from "./management/pages/AutomationPage";
import { AdvancedAnalyticsPage } from "./management/pages/AdvancedAnalyticsPage";
import AdminChat from "./management/pages/AdminChat";
import { SuppliersPage } from "./management/pages/SuppliersPage";
import { MediaLibraryPage } from "./management/pages/MediaLibraryPage";
import { TicketManagementPage } from "./management/pages/TicketManagementPage";
import { TourCostsPage } from "./management/pages/TourCostsPage";
import { SupportPage } from "./pages/SupportPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      // 🟢 NHÁNH 1: PUBLIC (Ai cũng vào được)
      { index: true, element: <HomePage /> },
      { path: "tours", element: <TourListingPage /> },
      { path: "tours/:id", element: <TourDetailPage /> },
      { path: "lookup", element: <LookupPage /> },
      { path: "booking/:id", element: <BookingPage /> },
      { path: "support", element: <SupportPage /> },
      { path: "payment/:bookingId", element: <PaymentPage /> },
      { path: "confirmation/:bookingId", element: <ConfirmationPage /> },

      // 🟡 NHÁNH 2: CUSTOMER (Chỉ khách hàng đã đăng nhập)
      {
        element: <ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_CUSTOMER"]} />, // Đã chuẩn hóa role
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

  // 🔴 NHÁNH 4: MANAGEMENT (BẢO MẬT ĐA TẦNG CHO ADMIN SYSTEM)
  {
    path: "/admin",
    element: (
      // Tầng 1: Chặn cổng ngoài - Chỉ cho phép người dùng thuộc khối vận hành (ADMIN hoặc SALE) vào Dashboard
      <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_SALE"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // VÙNG 1: CẢ ADMIN VÀ SALE ĐỀU CÓ QUYỀN VÀO
      { index: true, element: <OverviewPage /> },
      { path: "bookings", element: <BookingsPage /> },
      { path: "tours", element: <TourManagerPage /> },
      { path: "calendar", element: <CalendarPage /> },
      { path: "customers", element: <CustomersPage /> },
      { path: "crm", element: <CRMLeadsPage /> },
      { path: "chat", element: <AdminChat /> },
      { path: "payments", element: <PaymentsPage /> },
      { path: "vouchers", element: <VouchersPage /> },
      { path: "reviews", element: <ReviewsPage /> },
      { path: "media", element: <MediaLibraryPage /> },
      { path: "tickets", element: <TicketManagementPage /> },

      // VÙNG 2: THẮT CHẶT - CHỈ DUY NHẤT ADMIN ĐƯỢC VÀO
      {
        element: <ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />,
        children: [
          { path: "employees", element: <EmployeesPage /> },
          { path: "reports", element: <ReportsPage /> },
          { path: "analytics", element: <AdvancedAnalyticsPage /> },
          { path: "automation", element: <AutomationPage /> },
          { path: "tour-costs", element: <TourCostsPage /> },
          { path: "settings", element: <div className="p-8 font-black uppercase">Cài đặt hệ thống (Đang phát triển)</div> },
        ],
      },
    ],
  },
]);