'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface AppConfig {
  tunnelUrl: string;
  twitchRedirectUri: string;
  twitchClientId: string;
  host: string;
  apiUrl: string;
  wsUrl: string;
}

interface ConfigContextType {
  config: AppConfig | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

interface ConfigProviderProps {
  children: React.ReactNode;
}

export const ConfigProvider = ({ children }: ConfigProviderProps) => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/config');
      if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.statusText}`);
      }
      
      const configData = await response.json();
      setConfig(configData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Failed to fetch configuration:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const refetch = () => {
    fetchConfig();
  };

  const value = {
    config,
    loading,
    error,
    refetch,
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};
