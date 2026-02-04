import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import { Toaster } from "sonner";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="w-full py-8 border-t border-white/5 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} LinuxReady - Built by{" "}
            <a
              href="https://github.com/TU_USUARIO"
              className="text-white hover:underline"
            >
              @Sirlencio
            </a>
          </p>
          <div className="flex gap-6">
            <a
              href="https://github.com/TU_USUARIO/TU_REPO"
              className="hover:text-white transition"
            >
              Repository
            </a>
            <a href="/about" className="hover:text-white transition">
              About
            </a>
          </div>
        </div>
      </footer>
      <Toaster theme="dark" position="top-center" richColors />
    </div>
  );
};

export default AppLayout;
