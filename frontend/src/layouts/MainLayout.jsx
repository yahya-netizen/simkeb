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
  Shield,
  ChevronRight
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
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Deep Navy */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-primary-950 text-white transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 border-r-2 border-primary-900
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full bg-topo">
          <div className="flex items-center gap-3 px-8 py-10 border-b-2 border-white/5 mb-4">
            <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-primary-950" />
            </div>
            <span className="text-2xl font-bold tracking-tight">SIMKEB</span>
          </div>

          <nav className="flex-grow px-4 space-y-1.5">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center justify-between px-4 py-3.5 rounded-lg transition-all group
                    ${isActive 
                      ? 'bg-primary-900 text-white border-2 border-primary-800 shadow-xl' 
                      : 'text-primary-300 hover:bg-white/5 hover:text-white'}
                  `}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={isActive ? 'text-primary-400' : 'group-hover:text-primary-400 transition-colors'} />
                    <span className="font-bold text-xs uppercase tracking-widest">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight size={12} className="opacity-50" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t-2 border-white/5">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-primary-400 hover:bg-red-900/20 hover:text-red-400 transition-all border-2 border-transparent hover:border-red-900/50"
            >
              <LogOut size={18} />
              Logout Akun
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="h-24 bg-white sticky top-0 z-30 border-b-4 border-slate-200 flex items-center justify-between px-6 lg:px-10">
          <button
            className="p-2.5 -ml-2.5 lg:hidden text-primary-900 bg-slate-50 rounded-lg border-2 border-slate-200 transition-all"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <div className="flex-grow lg:flex-grow-0"></div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-primary-950 uppercase tracking-tight">{user?.nama}</p>
              <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest mt-0.5">{user?.role}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-primary-950 border-2 border-primary-900 flex items-center justify-center text-white font-bold shadow-xl">
              {user?.nama?.charAt(0)}
            </div>
          </div>
        </header>


        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;