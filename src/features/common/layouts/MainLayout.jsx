import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-paper flex-col">
      <Navbar />
      <div className="flex flex-1 min-w-0">
        <div className="hidden md:flex">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 max-w-6xl w-full mx-auto px-5 py-6">
            <Outlet />
          </main>
          <footer className="border-t border-line py-6 text-center text-sm text-ink2">NextOwner</footer>
        </div>
      </div>
    </div>
  );
}
