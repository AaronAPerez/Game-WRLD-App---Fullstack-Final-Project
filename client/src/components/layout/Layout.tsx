import { Outlet } from 'react-router-dom';
import Navbar from '../NavBar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-game-dark flex">
      <div className="flex-1 flex flex-col">
        <Navbar />
        {/* Main Content */}
        <main className="flex-1 pt-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
