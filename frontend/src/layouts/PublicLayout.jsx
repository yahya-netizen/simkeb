import { Link, Outlet } from 'react-router-dom';
import { Shield } from 'lucide-react';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-slate-900">SIMKEB</span>
              </Link>
            </div>
            <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
              <Link to="/" className="text-slate-600 hover:text-primary-600 transition-colors">Beranda</Link>
              <Link to="/lapor" className="text-slate-600 hover:text-primary-600 transition-colors">Lapor Bencana</Link>
              <Link to="/daftar-relawan" className="text-slate-600 hover:text-primary-600 transition-colors">Daftar Relawan</Link>
              <Link to="/login" className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors">Login Staf</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 SIMKEB - Sistem Informasi Manajemen Kebencanaan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;