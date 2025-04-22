import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import React, { useContext, createContext, useState } from "react";
import { Menu } from "./components/Icons";
interface SidebarItemProps {
  icon?: React.ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  children?: React.ReactNode;
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
    <aside
      className={`h-full fixed md:static top-0 right-0 transition-all duration-300 z-20 ${
        isSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
      }`}
    >
      <nav
        className={`h-full flex flex-col bg-[#141627]  shadow-sm transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-15"
        }`}
      >
        <SidebarContext.Provider value={{ isSidebarOpen }}>
          <ul className="flex flex-col w-full items-center px-3">{children}</ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert }: SidebarItemProps) {
  const { isSidebarOpen } = useContext(SidebarContext);

  return (
    <li
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
          className={`overflow-hidden transition-all ${
            isSidebarOpen ? "w-full block" : "hidden"
          }`}
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
