'use client';

import React, { useState, useEffect, useRef } from 'react';
import { websocketManager } from '../services/websocket';
import { raidAPI, Animation } from '../services/api';

interface RaidEvent {
  id: number;
  type: string;
  timestamp: Date;
  data?: {
    raider: string;
    viewers: number;
    message: string;
    timestamp: number;
  };
  animationId?: string;
  isTest?: boolean;
  message?: string;
}
import { useAuth } from '../lib/AuthContext';

interface RaidEventData {
  type: string;
  channel_id: string;
  animation_id: string;
  data: {
    raider: string;
    viewers: number;
    message: string;
    timestamp: number;
  };
}

const RaidEventDisplay: React.FC = () => {
  const { sessionToken } = useAuth();
  const [events, setEvents] = useState<RaidEvent[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentAnimation, setCurrentAnimation] = useState<Animation | null>(null);
  const eventsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sessionToken) return;

    const handleConnected = () => {
      setIsConnected(true);
      addSystemEvent('Connected to real-time feed');
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      addSystemEvent('Disconnected from real-time feed');
    };

    const handleRaidEvent = async (data: RaidEventData) => {
      console.log('Raid event received:', data);
      
      // Add the event to the list
      const raidEvent = {
        id: Date.now(),
        type: 'raid',
        timestamp: new Date(),
        data: data.data,
        animationId: data.animation_id,
      };
      
      setEvents(prev => [...prev, raidEvent]);
      
      // Try to fetch animation details
      if (data.animation_id) {
        try {
          const animation = await raidAPI.getAnimation(data.animation_id);
          setCurrentAnimation(animation);
          
          // Show animation for a few seconds
          setTimeout(() => {
            setCurrentAnimation(null);
          }, 5000);
        } catch (error) {
          console.error('Failed to fetch animation:', error);
        }
      }
    };

    // Set up WebSocket event listeners
    websocketManager.on('connected', handleConnected);
    websocketManager.on('disconnected', handleDisconnected);
    websocketManager.on('raidhelper.raid', handleRaidEvent);

    // Check initial connection state
    setIsConnected(websocketManager.getConnectionState() === 'connected');

    return () => {
      websocketManager.off('connected', handleConnected);
      websocketManager.off('disconnected', handleDisconnected);
      websocketManager.off('raidhelper.raid', handleRaidEvent);
    };
  }, [sessionToken]);

  useEffect(() => {
    // Auto-scroll to bottom when new events arrive
    eventsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  const addSystemEvent = (message: string) => {
    const systemEvent = {
      id: Date.now(),
      type: 'system',
      timestamp: new Date(),
      message,
    };
    setEvents(prev => [...prev, systemEvent]);
  };

  const sendTestEvent = () => {
    const testEvent = {
      type: 'raidhelper.raid',
      channel_id: 'test_channel',
      animation_id: 'test-animation-id',
      data: {
        raider: 'TestRaider',
        viewers: Math.floor(Math.random() * 1000) + 100,
        message: 'This is a test raid!',
        timestamp: Date.now(),
      }
    };
    
    // Simulate receiving the event
    setEvents(prev => [...prev, {
      id: Date.now(),
      type: 'raid',
      timestamp: new Date(),
      data: testEvent.data,
      animationId: testEvent.animation_id,
      isTest: true,
    }]);
  };

  const clearEvents = () => {
    setEvents([]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      {/* Current Animation Display */}
      {currentAnimation && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center transform animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold mb-2">RAID INCOMING!</h2>
            <p className="text-xl mb-2">Raid Incoming!</p>
            <p className="text-lg">
              Animation: {currentAnimation.name}
            </p>
            <p className="text-sm mt-4 opacity-90">&ldquo;{currentAnimation.description}&rdquo;</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {events.length} events
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={sendTestEvent}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Send Test Event
            </button>
            <button
              onClick={clearEvents}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Events Feed */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-medium text-gray-900">Event Feed</h3>
          <p className="text-sm text-gray-600">Real-time raid events and system messages</p>
        </div>
        
        <div className="h-96 overflow-y-auto p-4 space-y-3">
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="mb-4">
                <svg className="h-12 w-12 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <p>No events yet. Waiting for raids...</p>
              <p className="text-xs mt-2">Try sending a test event to see how it works!</p>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className={`p-3 rounded-lg border-l-4 ${
                  event.type === 'raid'
                    ? event.isTest
                      ? 'bg-blue-50 border-blue-400'
                      : 'bg-purple-50 border-purple-400'
                    : 'bg-gray-50 border-gray-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {event.type === 'raid' ? (
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {event.data?.raider}
                          </span>
                          {event.isTest && (
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
                              TEST
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          Raided with {event.data?.viewers} viewers
                        </p>
                        {event.data?.message && (
                          <p className="text-sm text-gray-700 italic">
                            &ldquo;{event.data.message}&rdquo;
                          </p>
                        )}
                        {event.animationId && (
                          <p className="text-xs text-gray-500 mt-1">
                            Animation: {event.animationId}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700">{event.message}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 ml-4">
                    {formatTime(event.timestamp)}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={eventsEndRef} />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">How it works</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Real-time events appear here when raids happen on your stream</li>
          <li>• Animation previews will show automatically when raids are triggered</li>
          <li>• Use the test button to see how raid notifications will look</li>
          <li>• Make sure you&apos;re connected to receive live events</li>
        </ul>
      </div>
    </div>
  );
};

export default RaidEventDisplay;
