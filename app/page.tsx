'use client';

import { useState, useEffect } from 'react';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { Dashboard } from '@/components/Dashboard';
import { Login } from '@/components/Login';
import { AuthProvider } from '@/lib/AuthContext';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <ConnectionStatus />
        {isAuthenticated ? (
          <Dashboard onLogout={handleLogout} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </AuthProvider>
  );
}
