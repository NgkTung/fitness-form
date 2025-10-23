import { Outlet } from "react-router-dom";
// import Sidebar from "../components/Sidebar";

const AppLayout = () => {
  return (
    <div className="flex h-screen">
      {/* <Sidebar /> */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
