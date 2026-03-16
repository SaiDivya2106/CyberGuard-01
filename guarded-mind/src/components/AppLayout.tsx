import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="ml-64 flex-1 px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
