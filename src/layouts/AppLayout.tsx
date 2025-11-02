import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import { Menu } from "lucide-react";

const AppLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 overflow-auto">
        <div className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-blue-100 px-4 py-3 flex items-center gap-3">
          <button
            aria-label="Open sidebar"
            className="p-2 rounded-lg border border-blue-100"
            onClick={() => setOpen(true)}
          >
            <Menu size={20} />
          </button>
          <span className="text-lg font-semibold text-blue-800">FitForm</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
