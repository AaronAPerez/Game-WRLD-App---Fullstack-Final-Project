import { Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AnimatedSidebar from "./sidebars/AnimatedSidebar";
import FilterBar from "../FilterBar";



const MainLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      {isAuthenticated && <AnimatedSidebar />}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isAuthenticated ? 'ml-20 lg:ml-64' : ''
        }`}
      >
        <FilterBar/>
        <div className="container mx-auto px-4 py-6">

          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;