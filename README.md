# RaidHelper Web

A modern React web application for managing Twitch raid animations and receiving real-time raid notifications.

## Features

- 🎮 **Twitch OAuth Integration** - Secure login with your Twitch account
- 🎨 **Animation Management** - Browse and preview available raid animations
- ⚡ **Real-time WebSocket** - Live raid event notifications
- 📱 **Responsive Design** - Works great on desktop and mobile
- 🎯 **Modern UI** - Beautiful, intuitive interface with Tailwind CSS
- 🔒 **Secure** - Session-based authentication with automatic token refresh

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- RaidHelper backend services running (API and WebSocket servers)

### Installation

1. **Clone and navigate to the project**
   ```bash
   cd raidhelper-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` to match your backend configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8081
   NEXT_PUBLIC_WS_URL=ws://localhost:8080
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The app will open at [http://localhost:3000](http://localhost:3000)

### Backend Requirements

Make sure these RaidHelper services are running:

- **API Server** (port 8081) - Authentication and data API
- **WebSocket Server** (port 8080) - Real-time event notifications
- **DynamoDB** - User data and session storage
- **NATS** - Message broker for events

See the backend README files for setup instructions.

## Usage

### Authentication

1. Click "Connect with Twitch" on the login page
2. Authorize the application with your Twitch account
3. You'll be redirected back to the dashboard

### Dashboard Features

#### **Animations Tab**
- Browse available raid animations
- Preview animations with live demo
- See animation details (duration, effects, etc.)

#### **Live Feed Tab**
- Real-time raid event notifications
- Test event functionality
- Connection status monitoring
- Animated raid displays

#### **Settings Tab**
- View connection status
- Manage Twitch integration
- WebSocket connection details

### Real-time Events

When a raid happens on your stream:
1. The backend detects the raid via Twitch webhooks
2. A raid event is sent through NATS
3. The WebSocket server forwards it to your browser
4. An animated notification appears on screen
5. The event is logged in the Live Feed

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React App     │    │   API Server     │    │  WebSocket      │
│  (Port 3000)    │◄──►│  (Port 8081)     │    │  (Port 8080)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                       │
         │                        ▼                       ▼
         │              ┌──────────────────┐    ┌─────────────────┐
         │              │    DynamoDB      │    │  NATS Server    │
         │              │   (Database)     │    │ (Message Bus)   │
         │              └──────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│  Twitch OAuth   │
│   (External)    │
└─────────────────┘
```

## Components

### Core Components

- **`Login`** - Twitch OAuth authentication flow
- **`Dashboard`** - Main application interface with tabs
- **`AnimationCard`** - Interactive animation preview cards
- **`RaidEventDisplay`** - Real-time event feed and notifications
- **`ConnectionStatus`** - WebSocket connection monitoring

### Services

- **`api.js`** - HTTP API client with auth interceptors
- **`websocket.js`** - WebSocket manager with reconnection
- **`AuthContext`** - React context for authentication state

### Hooks & Utils

- **`useAuth`** - Authentication hook from context
- **Auto-reconnection** - WebSocket automatically reconnects on disconnect
- **Session management** - Automatic token refresh and storage

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── Login.js
│   ├── Dashboard.js
│   ├── AnimationCard.js
│   ├── RaidEventDisplay.js
│   └── ConnectionStatus.js
├── contexts/           # React contexts
│   └── AuthContext.js
├── services/           # API and service clients
│   ├── api.js
│   └── websocket.js
├── App.js             # Main app component
├── index.js           # React entry point
└── index.css          # Global styles
```

### Available Scripts

- **`npm start`** - Start development server
- **`npm run build`** - Build for production
- **`npm test`** - Run tests
- **`npm run eject`** - Eject from Create React App (not recommended)

### Styling

The app uses **Tailwind CSS** with:
- Custom color palette for Twitch branding
- Responsive design utilities
- Custom animations and effects
- Dark/light theme support ready

### Environment Variables

- **`NEXT_PUBLIC_API_URL`** - Backend API base URL
- **`NEXT_PUBLIC_WS_URL`** - WebSocket server URL
- **`GENERATE_SOURCEMAP`** - Enable/disable source maps

## Deployment

### Production Build

```bash
npm run build
```

This creates an optimized build in the `build/` folder.

### Deployment Options

1. **Static Hosting** (Netlify, Vercel, S3)
   - Upload the `build/` folder
   - Configure redirects for SPA routing

2. **Docker**
   ```dockerfile
   FROM nginx:alpine
   COPY build/ /usr/share/nginx/html/
   COPY nginx.conf /etc/nginx/nginx.conf
   ```

3. **CDN Integration**
   - Build assets are ready for CDN deployment
   - Configure proper cache headers

### Environment Configuration

Set production environment variables:
```env
NEXT_PUBLIC_API_URL=https://api.raidhelper.com
NEXT_PUBLIC_WS_URL=wss://ws.raidhelper.com
```

## Troubleshooting

### Common Issues

1. **Can't connect to backend**
   - Check API URL in `.env.local`
   - Ensure backend services are running
   - Verify CORS configuration

2. **WebSocket connection fails**
   - Check WebSocket URL configuration
   - Ensure WebSocket server is running
   - Check browser console for errors

3. **Authentication not working**
   - Verify Twitch OAuth configuration
   - Check session storage in browser dev tools
   - Ensure API server auth endpoints are working

4. **Animations not loading**
   - Check network tab for API errors
   - Verify authentication is working
   - Check console for JavaScript errors

### Debug Mode

Enable debug logging:
```javascript
// In browser console
localStorage.setItem('debug', 'raidhelper:*');
```

### Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the RaidHelper platform and follows the same licensing terms.

## Support

- 📧 Email: support@raidhelper.com
- 💬 Discord: [RaidHelper Community](https://discord.gg/raidhelper)
- 📝 Issues: [GitHub Issues](https://github.com/sopatech/raidhelper/issues)
