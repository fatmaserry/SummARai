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
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => onMobileToggle(false)}
      />

      <aside
        className={`fixed right-0 h-full z-20 bg-[#141627] transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-fit"
        }`}
      >
        <nav className="h-full flex flex-col shadow-sm">
          <SidebarContext.Provider value={{ isSidebarOpen }}>
            <ul className="flex flex-col items-start px-2 space-y-2 min-w-[64px]">
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
                relative flex items-center py-2 px-2 my-1
                font-medium rounded-md cursor-pointer
                transition-colors group 
                ${
                  active
                    ? "bg-[#4E3693] bg-opacity-40 text-white"
                    : "hover:bg-transparent  text-[#6E7493] "
                }
                ${isSidebarOpen ? "w-full" : "w-fit"}
            `}
    >
      <div className="flex items-center gap-3 w-fit">
        {icon &&
          React.cloneElement(icon as React.ReactElement, {
            color: active ? "#FFFFFF" : "#6E7493",
            size: 30,
            className: `flex-shrink-0 ${
              active ? "text-white" : "text-[#6E7493]"
            } ${(icon as React.ReactElement).props.className || ""}`,
          })}
        <span
          className={`overflow-hidden transition-all duration-200 text-base ${
            isSidebarOpen ? "w-full opacity-100" : "hidden w-0 opacity-0"
          } ${className}`}
        >
          {text}
        </span>
      </div>

      {alert && (
        <div
          className={`absolute left-2 w-2 h-2 rounded-full ${
            isSidebarOpen ? "" : "top-2"
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
                        absolute right-full rounded-md px-2 py-1 ml-6
                        bg-[#1C1F36] text-white text-sm border border-[#4C4F6A]
                        invisible opacity-0 -translate-x-3 transition-all
                        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                    `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
