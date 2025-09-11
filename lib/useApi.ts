'use client';

import { useMemo } from 'react';
import { useConfig } from './ConfigContext';
import { createAuthAPI, createRaidAPI } from '../services/dynamicApi';

export const useApi = () => {
  const { config, loading, error } = useConfig();

  const api = useMemo(() => {
    if (!config) {
      return {
        auth: null,
        raid: null,
        loading: true,
        error: 'Configuration not loaded',
      };
    }

    return {
      auth: createAuthAPI(config),
      raid: createRaidAPI(config),
      loading: false,
      error: null,
    };
  }, [config]);

  return {
    ...api,
    configLoading: loading,
    configError: error,
  };
};
