import React, { useState } from 'react';
import { raidAPI } from '../services/api';

const AnimationCard = ({ animation }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const loadPreview = async () => {
    if (preview) {
      setShowPreview(true);
      return;
    }

    try {
      setLoading(true);
      const previewData = await raidAPI.getAnimationPreview(animation.id);
      setPreview(previewData);
      setShowPreview(true);
    } catch (error) {
      console.error('Failed to load preview:', error);
    } finally {
      setLoading(false);
    }
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
        <div className="relative">
          <div className="h-48 bg-gradient-to-br from-purple-400 to-blue-500 rounded-t-lg flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-4xl mb-2">🎮</div>
              <p className="text-sm opacity-90">Animation Preview</p>
            </div>
          </div>
          <button
            onClick={loadPreview}
            disabled={loading}
            className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 rounded-t-lg transition-all duration-200 flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
            ) : (
              <div className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            )}
          </button>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2">
            {animation.name || `Animation ${animation.id}`}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {animation.description || 'Custom raid animation for your stream'}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">
                {animation.type || 'Standard'}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                {animation.duration || '3s'}
              </span>
            </div>
            
            <button
              onClick={loadPreview}
              disabled={loading}
              className="text-twitch-primary hover:text-twitch-dark text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Preview'}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {animation.name || `Animation ${animation.id}`}
                </h2>
                <button
                  onClick={closePreview}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="h-64 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Animated preview demonstration */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center animate-pulse-slow">
                      <div className="text-6xl mb-4 animate-bounce-slow">🎉</div>
                      <h3 className="text-2xl font-bold mb-2">RAID INCOMING!</h3>
                      <p className="text-lg">RaiderName with 1,500 viewers!</p>
                    </div>
                  </div>
                  
                  {/* Particle effects simulation */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute animate-ping"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${2 + Math.random() * 2}s`
                        }}
                      >
                        ✨
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Duration</p>
                    <p className="text-gray-600">{animation.duration || '3 seconds'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Type</p>
                    <p className="text-gray-600">{animation.type || 'Standard'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Effects</p>
                    <p className="text-gray-600">Particles, Bounce, Glow</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Sound</p>
                    <p className="text-gray-600">Optional</p>
                  </div>
                </div>
                
                {preview?.description && (
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Description</p>
                    <p className="text-gray-600">{preview.description}</p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={closePreview}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-twitch-primary text-white rounded-lg hover:bg-twitch-dark">
                    Use This Animation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AnimationCard;
