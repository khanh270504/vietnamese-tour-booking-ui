import { createBrowserRouter } from "react-router";
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

import { AdminRoute } from "./components/AdminRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "tours", Component: TourListingPage },
      { path: "tours/:id", Component: TourDetailPage },
      { path: "booking/:id", Component: BookingPage },
      { path: "payment/:bookingId", Component: PaymentPage },
      { path: "confirmation/:bookingId", Component: ConfirmationPage },
      { path: "lookup", Component: LookupPage },
      { path: "my-orders", Component: MyOrdersPage },
      { path: "wishlist", Component: WishlistPage },
      { path: "profile", Component: ProfilePage },
      { path: "*", Component: NotFound },
    ],
  },
  // Auth pages without header/footer
  { path: "login", Component: LoginPage },
  { path: "register", Component: RegisterPage },
  { path: "forgot-password", Component: ForgotPasswordPage },
  // Admin routes
  
]);