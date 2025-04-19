import React, { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen" dir="rtl">
      <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <button
          className="bg-none border-none text-white text-2xl cursor-pointer"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>
        <h1>Header</h1>
      </header>

      <div className="relative flex-1 flex">
        {/* Sidebar from right */}
        <aside
          className={`bg-gray-700 text-white p-4 w-64 h-full absolute top-0 right-0 transition-transform duration-300 transform ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } z-20`}
        >
          Sidebar
        </aside>

        {/* Optional dark overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-10"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 z-0">
          <div className="h-screen max-w-screen-xl mx-auto p-4">
            {children}
          </div>
        </main>
      </div>

      <footer className="bg-gray-800 text-red-500 text-center p-4">
        Footer
      </footer>
    </div>
  );
};

export default Layout;
