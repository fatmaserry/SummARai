// import React, { useState } from "react";
// import Sidebar from "./sidebar";
// import { Home, Profile, BookOpen, Search, Menu } from "./components/Icons";
// import HomePage from "./pages/Home";
// import { SidebarItem } from "./sidebar";
// interface LayoutProps {
//   children: React.ReactNode;
// }

// const Layout = ({ children }: LayoutProps) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const handleSidebarToggle = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };
//   return (
//     <div className="flex flex-col h-screen w-screen" dir="rtl">
//       <header className="bg-[#141627] text-white p-4 flex justify-between items-center sticky top-0 z-30">
//         <h1 className="text-xl font-bold">مرحبا بك</h1>
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => alert('Registration button clicked!')}
//             className="px-4 py-2 bg-[#4E3693] rounded-lg hover:bg-[#765CDE] transition-colors"
//           >
//             تسجيل دخول
//           </button>
//           {/* Mobile menu button - shows only on small screens */}
//           <button
//             onClick={handleSidebarToggle}
//             className="p-2 rounded-lg md:hidden"
//           >
//             <Menu />
//           </button>
//         </div>
//       </header>
//       <div className="relative flex-1 flex">

//         {/* Sidebar from right */}
//         <Sidebar  isSidebarOpen={isSidebarOpen} onMobileToggle={handleSidebarToggle}>
//           <SidebarItem icon={<Home />} text="الرئيسية" active alert={false} />
//           <SidebarItem icon={<BookOpen />} text="القراءات السابقة" active={false} alert={false} />
//           <SidebarItem icon={<Search />} text="بحث" active={false} alert={false} />
//           <SidebarItem icon={<Profile />} text="الصفحة الشخصية"active={false} alert={false}/>
//         </Sidebar>
//         {/* Optional dark overlay */}
//         {isSidebarOpen && (
//           <div
//             className="fixed inset-0 bg-black opacity-50 z-10"
//             onClick={() => setIsSidebarOpen(false)}
//           />
//         )}

//         {/* Main content */}
//         <main className="flex-1 z-0">
//           <div className="h-screen max-w-screen-xl mx-auto p-4">
//             {children}
//           </div>
//         </main>
//       </div>

//       <footer className="bg-gray-800 text-red-500 text-center p-4">
//         Footer
//       </footer>
//     </div>
//   );
// };

// export default Layout;
import React, { useContext, useState } from "react";
import Sidebar from "./sidebar";
import { Home, Profile, BookOpen, Search, Menu } from "./components/Icons";
import { SidebarItem } from "./sidebar";
import { AuthContext } from "./provider/auth/authProvider";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
          <button
            onClick={() => alert("Registration button clicked!")}
            className="px-4 py-2 bg-[#4E3693] text-sm rounded-lg hover:bg-[#765CDE] transition-colors"
          >
            تسجيل دخول
          </button>
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
          <SidebarItem icon={<Home />} text="الرئيسية" active alert={false} />
          {isLoggedIn ? (
            <>
              <SidebarItem icon={<BookOpen />} text="القراءات السابقة" />
              <SidebarItem icon={<Search />} text="بحث" />
              <SidebarItem icon={<Profile />} text="الصفحة الشخصية" />
            </>
          ) : (
            <SidebarItem
              icon={<Profile />}
              text="إنشاء حساب جديد"
              alert={false}
            />
          )}
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 bg-[#141627] overflow-y-auto p-4">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#141627] text-base text-[#6E7493] text-center p-4 w-full">
        حقوق النشر © 2023 - جميع الحقوق محفوظة
      </footer>
    </div>
  );
};

export default Layout;
