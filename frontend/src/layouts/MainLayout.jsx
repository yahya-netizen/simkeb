import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  FileText, 
  Users, 
  Package, 
  MapPin, 
  UserCog, 
  LogOut, 
  Menu, 
  Shield
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, roles: ['admin', 'petugas'] },
    { name: 'Bencana', path: '/admin/bencana', icon: AlertTriangle, roles: ['admin', 'petugas'] },
    { name: 'Laporan', path: '/admin/laporan', icon: FileText, roles: ['admin', 'petugas'] },
    { name: 'Posko', path: '/admin/posko', icon: MapPin, roles: ['admin', 'petugas'] },
    { name: 'Relawan', path: '/admin/relawan', icon: Users, roles: ['admin', 'petugas'] },
    { name: 'Logistik', path: '/admin/logistik', icon: Package, roles: ['admin', 'petugas'] },
    { name: 'Penugasan Saya', path: '/admin/penugasan', icon: FileText, roles: ['relawan'] },
    { name: 'User Management', path: '/admin/users', icon: UserCog, roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 px-6 py-6">
            <Shield className="h-8 w-8 text-primary-400" />
            <span className="text-xl font-bold tracking-tight">SIMKEB</span>
          </div>

          <nav className="flex-grow px-4 space-y-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium
                  ${location.pathname === item.path 
                    ? 'bg-primary-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                `}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          <button
            className="p-2 -ml-2 lg:hidden text-slate-600 hover:bg-slate-100 rounded-md"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-900">{user?.nama}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
              {user?.nama?.charAt(0)}
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;