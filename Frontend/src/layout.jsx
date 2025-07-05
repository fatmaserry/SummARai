import React, { useContext, useState } from "react";
import Sidebar from "./sidebar";
import { Home, Profile, BookOpen, Search, Menu, Logout } from "./components/Icons";
import { SidebarItem } from "./sidebar";
import { AuthContext } from "./provider/auth/authProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "./provider/auth/useAuth";
import GlobalProgressBar from "./components/progress-bar/global";
import GlobalCompletionPopup from "./components/popup/index";
import { useSSE } from "./provider/context/SSEContext";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { resetProcessing, isProcessing, showCompletion } = useSSE();
  const { setToken, isLoggedIn, user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    resetProcessing();
    setUser(null)
    setToken();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden" dir="rtl">
      {/* Global Components - Highest z-index */}
      {showCompletion && (
        <div className="fixed inset-0 z-[9999]">
          {showCompletion && <GlobalCompletionPopup />}
        </div>
      )}

      {isProcessing && <GlobalProgressBar />}

      {/* Header */}
      <header
        className="bg-[#241740] w-full text-white p-4 flex items-center justify-between sticky top-0 z-[80]"
        dir="ltr"
      >
        {isLoggedIn ? (
          <button onClick={() => navigate("/Profile")}>
            <img
              src="assets/images/samurai.png"
              alt="Profile"
              className="w-12 h-12 rounded-full transform scale-x-[-1] object-cover bg-gray-700 mx-4"
            />
          </button>

        ) : (
          <Link
            to="/login"
            className="text-white underline text-base"
          >
            تسجيل دخول
          </Link>
        )}

        <div className="flex items-center gap-4">
          <img
            src="/assets/images/SummARai.png"
            className="w-28 hidden md:block"
            alt="Logo"
          />
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-[#4C4F6A] transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={30} />
          </button>
        </div>
      </header>

      {/* Content Layout */}
      <div className="flex flex-1 w-full h-full overflow-hidden">
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} onMobileToggle={toggleSidebar}>
          <SidebarItem
            icon={<Home />}
            text="الرئيسية"
            active={location.pathname === "/"}
            onClick={() => navigate("/")}
          />
          {isLoggedIn ? (
            <>
              <SidebarItem
                icon={<BookOpen />}
                text="القراءات السابقة"
                active={location.pathname === "/Readings"}
                onClick={() => navigate("/Readings")}
              />
              <SidebarItem
                icon={<Search />}
                text="بحث"
                active={location.pathname === "/Search"}
                onClick={() => navigate("/Search")}
              />
              <SidebarItem
                icon={<Profile />}
                text="الصفحة الشخصية"
                active={location.pathname === "/Profile"}
                onClick={() => navigate("/Profile")}
              />
              <SidebarItem
                icon={<Logout />}
                text="تسجيل خروج"
                onClick={handleLogout}
              />
            </>
          ) : (
            <SidebarItem
              icon={<Profile />}
              text="إنشاء حساب جديد"
              active={location.pathname === "/register"}
              onClick={() => navigate("/register")}
            />
          )}
        </Sidebar>

        {/* Main Content */}
        <main className="relative flex-1 bg-[#241740] overflow-y-auto scrollbar-hide">
          {/* Background Logo */}
          <div className="fixed inset-0 flex justify-center items-center opacity-10 pointer-events-none z-0">
            <img
              src="/assets/images/logo_name.png"
              alt="logo"
              className="w-auto max-w-[70%] max-h-[500px] object-contain mt-10"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-[80vw] p-4 h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#241740] text-sm text-[#6E7493] text-center p-4 w-full">
        حقوق النشر © 2025 - جميع الحقوق محفوظة
      </footer>
    </div>
  );
};

export default Layout;