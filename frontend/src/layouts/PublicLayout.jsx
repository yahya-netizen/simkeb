import { Link, Outlet, useLocation } from 'react-router-dom';
import { AlertCircle, Menu, X, Shield, Phone, Heart } from 'lucide-react';
import { useState } from 'react';

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Lapor Bencana', path: '/lapor' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Professional Navy Navigation */}
      <nav className="bg-primary-950 sticky top-0 z-50 border-b-4 border-primary-900 shadow-2xl bg-topo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-24">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform border-2 border-primary-100">
                  <Shield className="h-7 w-7 text-primary-900" />
                </div>
                <span className="text-3xl font-bold text-white tracking-tight">SIMKEB</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`text-xs font-bold uppercase tracking-widest transition-all hover:text-white relative after:absolute after:bottom-[-4px] after:left-0 after:h-1 after:bg-white after:transition-all ${
                    isActive(link.path) ? 'text-white after:w-full' : 'text-primary-300 after:w-0'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/login" 
                className="px-10 py-3 rounded-lg bg-primary-800 text-white text-xs font-bold uppercase tracking-widest hover:bg-primary-700 active:scale-95 transition-all border-2 border-primary-700 shadow-lg"
              >
                Login Staf
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 text-white bg-primary-800 rounded-lg border-2 border-primary-700 transition-all"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMenuOpen && (
          <div className="sm:hidden bg-primary-950 border-b-4 border-primary-900 animate-in slide-in-from-top duration-300">
            <div className="px-4 pt-2 pb-8 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-6 py-5 rounded-lg text-sm font-bold uppercase tracking-widest border-2 transition-all ${
                    isActive(link.path) ? 'bg-primary-900 border-white text-white' : 'border-primary-900 text-primary-200'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/login"
                className="block px-6 py-5 rounded-lg bg-white text-primary-950 text-center font-bold uppercase tracking-widest mt-4 border-2 border-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Login Staf
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Professional Footer */}
      <footer className="bg-primary-950 text-white pt-24 pb-12 overflow-hidden relative border-t-8 border-primary-900 bg-leaf">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20 pb-20 border-b-2 border-white/5">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
                  <Shield className="h-7 w-7 text-primary-950" />
                </div>
                <span className="text-3xl font-bold tracking-tighter">SIMKEB</span>
              </div>
              <p className="text-primary-200 text-sm leading-relaxed font-medium opacity-70">
                Sistem Informasi Manajemen Kebencanaan Terpadu Berbasis Digital untuk Efisiensi Respons Darurat Nasional.
              </p>
              <div className="flex gap-5">
                <div className="h-12 w-12 bg-white/5 rounded-lg flex items-center justify-center border-2 border-white/10 hover:bg-white/20 transition-all cursor-pointer"><Phone size={20} /></div>
                <div className="h-12 w-12 bg-white/5 rounded-lg flex items-center justify-center border-2 border-white/10 hover:bg-white/20 transition-all cursor-pointer"><Heart size={20} /></div>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-400 mb-10">Navigasi Utama</h4>
              <ul className="space-y-5">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-primary-100 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">{link.name}</Link>
                  </li>
                ))}
                <li><Link to="/login-petugas" className="text-primary-100 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">Akses Petugas</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-400 mb-10">Pusat Informasi</h4>
              <div className="bg-white/5 border-2 border-white/10 p-8 rounded-xl space-y-6">
                <p className="text-[10px] text-primary-300 font-bold uppercase tracking-[0.2em]">🚨 Kontak Darurat (24/7)</p>
                <p className="text-3xl font-bold text-white tracking-tighter">0800-1-SIMKEB</p>
                <div className="pt-4 flex items-center gap-3 text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] border-t border-white/5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
                  Sistem Berjalan Normal
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-primary-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            <p>© 2026 SIMKEB NATIONAL SYSTEM. All rights reserved.</p>
            <div className="flex gap-10">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;