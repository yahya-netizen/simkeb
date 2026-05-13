import React, { useState, useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Button from './ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-2xl text-center border-2 border-red-300">
            <div className="w-20 h-20 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-inner border-2 border-red-100">
              <AlertTriangle size={40} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">Oops! Ada Kesalahan</h2>
            <p className="text-slate-600 mb-6 leading-relaxed font-bold text-[12px] uppercase tracking-widest opacity-80">
              Aplikasi mengalami kesalahan yang tidak terduga. Tim kami telah diberi tahu.
            </p>
            <div className="bg-red-50 p-4 rounded-lg mb-8 border-2 border-red-200 text-left max-h-32 overflow-y-auto">
              <p className="text-[10px] text-red-700 font-mono whitespace-pre-wrap break-all">
                {this.state.error?.toString()}
              </p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => window.location.href = '/'}
                className="w-full gap-2 bg-primary-600"
              >
                <Home size={18} />
                Kembali ke Beranda
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.location.reload()}
                className="w-full gap-2"
              >
                <RotateCcw size={18} />
                Muat Ulang
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
