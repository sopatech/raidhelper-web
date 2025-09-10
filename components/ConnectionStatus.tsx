'use client';

import React, { useState, useEffect } from 'react';
import { websocketManager } from '../services/websocket';
import { useAuth } from '../lib/AuthContext';

interface ConnectionStatusProps {
  detailed?: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ detailed = false }) => {
  const { sessionToken } = useAuth();
  const [connectionState, setConnectionState] = useState<'connected' | 'disconnected' | 'connecting' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<{ timestamp?: number; type?: string } | null>(null);

  useEffect(() => {
    if (!sessionToken) return;

    // Connect to WebSocket
    websocketManager.connect(sessionToken);

    // Set up event listeners
    const handleConnected = () => setConnectionState('connected');
    const handleDisconnected = () => setConnectionState('disconnected');
    const handleError = () => setConnectionState('error');
    const handleMessage = (data: { timestamp?: number; type?: string }) => {
      setLastMessage(data);
      console.log('WebSocket message:', data);
    };

    websocketManager.on('connected', handleConnected);
    websocketManager.on('disconnected', handleDisconnected);
    websocketManager.on('error', handleError);
    websocketManager.on('message', handleMessage);

    // Update initial state
    const state = websocketManager.getConnectionState();
    if (state === 'closing' || state === 'unknown') {
      setConnectionState('disconnected');
    } else {
      setConnectionState(state);
    }

    // Cleanup on unmount
    return () => {
      websocketManager.off('connected', handleConnected);
      websocketManager.off('disconnected', handleDisconnected);
      websocketManager.off('error', handleError);
      websocketManager.off('message', handleMessage);
    };
  }, [sessionToken]);

  const getStatusColor = () => {
    switch (connectionState) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'connecting':
        return 'bg-yellow-100 text-yellow-800';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = () => {
    switch (connectionState) {
      case 'connected':
        return (
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'connecting':
        return (
          <div className="h-3 w-3 border border-current border-t-transparent rounded-full animate-spin"></div>
        );
      case 'error':
        return (
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getStatusText = () => {
    switch (connectionState) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  if (detailed) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Real-time Connection</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="ml-1">{getStatusText()}</span>
          </span>
        </div>
        
        {lastMessage && (
          <div className="text-xs text-gray-500">
            <p>Last message: {new Date(lastMessage.timestamp || Date.now()).toLocaleTimeString()}</p>
            {lastMessage.type && <p>Type: {lastMessage.type}</p>}
          </div>
        )}
        
        <button
          onClick={() => {
            if (connectionState === 'disconnected' && sessionToken) {
              websocketManager.connect(sessionToken);
            }
          }}
          disabled={connectionState === 'connected' || connectionState === 'connecting'}
          className="text-xs text-twitch-primary hover:text-twitch-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {connectionState === 'disconnected' ? 'Reconnect' : 'Connected'}
        </button>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {getStatusIcon()}
      <span className="ml-1">{getStatusText()}</span>
    </span>
  );
};

export default ConnectionStatus;
