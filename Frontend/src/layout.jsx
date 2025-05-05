import React, { useContext, useState } from "react";
import Sidebar from "./sidebar";
import { Home, Profile, BookOpen, Search, Menu, Logout } from "./components/Icons";
import { SidebarItem } from "./sidebar";
import { AuthContext } from "./provider/auth/authProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "./provider/auth/useAuth";


const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    setToken();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden" dir="rtl">
      {/* Header */}
      <header
        className="bg-[#141627] w-full text-white p-4 flex items-center justify-between sticky top-0 z-30"
        dir="ltr"
      >
        {isLoggedIn ? (
          <h1 className="text-xl font-bold">مرحبا بك</h1>
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
              <div>
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
              </div>

              <div>
                <SidebarItem
                  icon={<Logout />}
                  text="تسجيل خروج"
                  onClick={handleLogout}
                />
              </div>
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
        <main className="flex-1 bg-[#141627] overflow-y-auto p-4 scrollbar-hide">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#141627] text-sm text-[#6E7493] text-center p-4 w-full">
        حقوق النشر © 2025 - جميع الحقوق محفوظة
      </footer>
    </div>
  );
};

export default Layout;
