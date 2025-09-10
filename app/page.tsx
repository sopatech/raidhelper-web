'use client';

import ConnectionStatus from '@/components/ConnectionStatus';
import Dashboard from '@/components/Dashboard';
import Login from '@/components/Login';
import { AuthProvider, useAuth } from '@/lib/AuthContext';

function AppContent() {
  const { isAuthenticated, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-twitch-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ConnectionStatus />
      {isAuthenticated ? (
        <Dashboard onLogout={logout} />
      ) : (
        <Login onLogin={() => {}} />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
