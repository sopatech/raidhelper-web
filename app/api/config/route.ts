import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get configuration from environment variables
    const config = {
      tunnelUrl: process.env.TUNNEL_URL || '',
      twitchRedirectUri: process.env.TWITCH_REDIRECT_URI || '',
      twitchClientId: process.env.TWITCH_CLIENT_ID || '',
      host: process.env.HOST || '',
      // Add any other configuration you need
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082',
      wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8083',
    };

    // Log configuration for debugging (remove in production)
    console.log('Configuration loaded:', {
      tunnelUrl: config.tunnelUrl,
      twitchRedirectUri: config.twitchRedirectUri,
      apiUrl: config.apiUrl,
      wsUrl: config.wsUrl,
    });

    // Return configuration as JSON
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching configuration:', error);
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    );
  }
}
