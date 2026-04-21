import { Outlet } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ChatSupport } from "../components/ChatSupport";
import { ScrollToTop } from "../components/ScrollToTop";

export function Root() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatSupport />
      <ScrollToTop />
    </div>
  );
}
