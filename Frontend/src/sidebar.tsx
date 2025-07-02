import React, { useContext, createContext, useState } from "react";

interface SidebarItemProps {
  icon?: React.ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface SidebarProps {
  children?: React.ReactNode;
  isSidebarOpen: boolean;
  onMobileToggle: (isOpen: boolean) => void;
}

const SidebarContext = createContext<{ isSidebarOpen: boolean }>({
  isSidebarOpen: false,
});

export default function Sidebar({
  children,
  isSidebarOpen,
  onMobileToggle,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop*/}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[999] transition-all duration-300 ease-in-out md:hidden ${
          isSidebarOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible delay-100"
        }`}
        onClick={() => onMobileToggle(false)}
      />

      {/* Sidebar with improved transitions */}
      <aside
        className={`fixed right-0 h-full z-[9999] bg-[#241740] transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-14 md:w-20"
        }`}
      >
        {/* Glitter background decoration with smooth transition */}
        <div
          className={`absolute left-0 top-0 h-3/4 overflow-hidden pointer-events-none transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "w-56" : "w-0"
          }`}
        >
          <img
            src="/assets/images/sidebar_glitter.png"
            alt="sidebar decoration"
            className="h-full"
          />
        </div>

        <nav className="h-full flex flex-col shadow-sm relative z-10">
          <SidebarContext.Provider value={{ isSidebarOpen }}>
            <ul className="flex flex-col items-start px-3 space-y-2 h-full">
              {children}
            </ul>
          </SidebarContext.Provider>
        </nav>
      </aside>
    </>
  );
}

export function SidebarItem({
  icon,
  text,
  active,
  alert,
  className,
  onClick,
}: SidebarItemProps) {
  const { isSidebarOpen } = useContext(SidebarContext);

  return (
    <li
      onClick={onClick}
      className={`
        relative flex items-center py-3 px-3 my-1
        font-medium rounded-lg cursor-pointer
        transition-all duration-200 ease-in-out group 
        ${
          active
            ? "bg-[#4E3693] bg-opacity-40 text-white"
            : "hover:bg-[#4E3693] hover:bg-opacity-20 text-[#6E7493]"
        }
        ${isSidebarOpen ? "w-full" : "w-12 justify-center"}
      `}
    >
      <div className="flex items-center gap-3 relative">
        {icon &&
          React.cloneElement(icon as React.ReactElement, {
            color: active ? "#FFFFFF" : "#6E7493",
            size: 24,
            className: `flex-shrink-0 transition-colors duration-200 ${
              active ? "text-white" : "text-[#6E7493]"
            } ${(icon as React.ReactElement).props.className || ""}`,
          })}
        <span
          className={`
            text-base whitespace-nowrap transition-all duration-200 ease-in-out
            ${
              isSidebarOpen
                ? "relative opacity-100 ml-2"
                : "absolute opacity-0 left-full"
            }
            ${className}
          `}
        >
          {text}
        </span>
      </div>

      {alert && (
        <div
          className={`absolute left-2 w-2 h-2 rounded-full ${
            isSidebarOpen ? "" : "top-3"
          }`}
          style={{
            backgroundColor: "#765CDE",
            boxShadow: "0 0 0 2px rgba(118, 92, 222, 0.3)",
          }}
        />
      )}

      {!isSidebarOpen && (
        <div
          className={`
            absolute right-full rounded-md px-2 py-1 mr-2
            bg-[#1C1F36] text-white text-sm border border-[#4C4F6A]
            invisible opacity-0 -translate-x-2 transition-all
            duration-200 ease-in-out
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
