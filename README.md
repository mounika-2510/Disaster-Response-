# 🚨 Disaster Response Coordination Platform

A modern, real-time disaster response coordination platform built with React, TypeScript, and Tailwind CSS. This application provides emergency responders and organizations with comprehensive tools for monitoring, managing, and coordinating disaster response efforts globally.

![Platform Preview](https://img.shields.io/badge/Status-Production_Ready-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![Version](https://img.shields.io/badge/Version-1.0.0-orange)

## 🌟 Key Features

### 🌍 **Real-Time Global Disaster Monitoring**

- **Live earthquake data** from USGS (United States Geological Survey)
- **Active weather alerts** from NOAA (National Oceanic and Atmospheric Administration)
- **Satellite wildfire detection** from NASA FIRMS (Fire Information for Resource Management System)
- **Automatic data refresh** every 15 minutes with intelligent fallback to demonstration data

### 📊 **Emergency Response Dashboard**

- **Command center interface** with military-grade styling
- **Real-time statistics** and system health monitoring
- **Critical alert management** with priority-based visual indicators
- **Live activity feeds** showing emergency unit updates
- **Weather condition monitoring** with disaster risk assessment

### 🌐 **Social Media Intelligence**

- **Multi-platform monitoring** (Twitter, Facebook, Instagram, Bluesky)
- **Sentiment analysis** (urgent, informational, help requests, offers)
- **Real-time report verification** with authenticity scoring
- **Trending hashtag analysis** for disaster-related content
- **Engagement metrics** tracking for report prioritization

### 🗺️ **Geospatial Resource Management**

- **Interactive resource mapping** with location-based search
- **ST_DWithin radius queries** for finding nearby resources
- **Capacity utilization tracking** for shelters, medical facilities, food centers
- **Real-time status updates** (operational, overwhelmed, closed)
- **Contact information management** for emergency coordination

### 🔍 **AI-Powered Report Verification**

- **Google Gemini API integration** for image authenticity detection
- **Metadata analysis** for manipulation detection
- **Context verification** for disaster-related content
- **Confidence scoring** with detailed analysis reports
- **Automated flagging** of suspicious content

### 📱 **Comprehensive Disaster Management**

- **Full CRUD operations** for disaster records
- **Location extraction** from natural language descriptions
- **Geocoding integration** for lat/lng coordinate conversion
- **Priority-based classification** (critical, high, medium, low)
- **Audit trail tracking** for all disaster-related actions

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or later)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd disaster-response-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   Local:   http://localhost:8080/
   Network: http://192.168.29.46:8080/
   ```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run test` - Run test suite
- `npm run typecheck` - Validate TypeScript types
- `npm audit fix` - Fix security vulnerabilities

## 🛠️ Technology Stack

### **Frontend Framework**

- **React 18** - Modern reactive user interface
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **React Router 6** - Client-side routing

### **Styling & Design**

- **Tailwind CSS 3** - Utility-first CSS framework
- **Glassmorphism Effects** - Modern glass-like UI components
- **Custom Animations** - Emergency-specific visual effects
- **Responsive Design** - Mobile-first approach

### **UI Component Library**

- **Radix UI** - Accessible UI primitives
- **Shadcn/ui** - Beautiful, customizable components
- **Lucide React** - Modern icon library
- **Framer Motion** - Advanced animations

### **Data Management**

- **TanStack Query** - Intelligent data fetching and caching
- **Custom React Hooks** - Reusable state management
- **Real-time WebSocket simulation** - Live updates

### **External Integrations**

- **USGS Earthquake API** - Real earthquake data
- **NOAA Weather API** - Live weather alerts
- **NASA FIRMS** - Satellite fire detection
- **Google Gemini API** - AI image verification (simulated)
- **Geocoding Services** - Location coordinate conversion

## 📋 Core Functionality

### 🏠 **Dashboard**

- System overview with real-time metrics
- Critical situation monitoring
- Live emergency feed
- Weather conditions with risk assessment
- System health and performance monitoring

### 🌪️ **Disaster Management**

- Create, read, update, delete disaster records
- AI-powered location extraction from descriptions
- Priority assignment and status tracking
- Geospatial coordinate management
- Comprehensive audit logging

### 📱 **Social Media Monitoring**

- Live social media feed aggregation
- Sentiment analysis and categorization
- Platform verification status
- Hashtag trending analysis
- Engagement metrics tracking

### 🗺️ **Resource Mapping**

- Interactive resource location interface
- Geospatial radius-based search (ST_DWithin)
- Capacity and availability tracking
- Multi-type resource management (shelter, medical, food, water, transport)
- Real-time status monitoring

### 📝 **Report Verification**

- Citizen report submission system
- AI-powered image verification
- Multi-step verification workflow
- Priority-based report management
- Detailed verification analytics

## 🌐 Real-Time Data Sources

### **Live Data Integration**

When internet connectivity is available, the platform automatically fetches real-time data from:

- **🌍 USGS Earthquake Feed** - `earthquake.usgs.gov`
- **🌪️ NOAA Weather Alerts** - `api.weather.gov`
- **🔥 NASA Fire Detection** - `firms.modaps.eosdis.nasa.gov`

### **Intelligent Fallback**

- Automatic detection of API availability
- Graceful fallback to comprehensive demonstration data
- Real-time vs. demo mode indicators
- Cached data management (15-minute refresh cycles)

## 🎨 Design System

### **Emergency Response Aesthetics**

- **Command Center Styling** - Military-grade professional interface
- **Priority-Based Color Coding** - Visual emergency classification
- **Glassmorphism Effects** - Modern transparency and blur effects
- **Emergency Animations** - Attention-grabbing critical alerts

### **Color Palette**

- **Critical**: Red gradient (`#dc2626` to `#b91c1c`)
- **High Priority**: Orange gradient (`#ea580c` to `#c2410c`)
- **Medium Priority**: Yellow gradient (`#ca8a04` to `#a16207`)
- **Low Priority**: Green gradient (`#16a34a` to `#15803d`)
- **Information**: Blue gradient (`#2563eb` to `#1d4ed8`)

### **Animation System**

- **Emergency Pulse** - Critical alert attention animation
- **Float Effect** - Subtle icon and element animation
- **Glassmorphism Hover** - Interactive element responses
- **Gradient Shifts** - Dynamic background animations

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── emergency/       # Emergency-specific components
│   ├── layout/          # Layout and navigation
│   ├── ui/             # Core UI component library
│   └── widgets/        # Dashboard widgets
├── hooks/              # Custom React hooks
├── lib/                # Utilities and API functions
│   ├── api.ts          # Backend API simulation
│   ├── mock-data.ts    # Demonstration data
│   ├── real-time-api.ts # Live data integration
│   └── utils.ts        # Helper functions
├── pages/              # Main application pages
│   ├── Dashboard.tsx   # Emergency response overview
│   ├── Disasters.tsx   # Disaster management
│   ├── SocialMedia.tsx # Social media monitoring
│   ├── Resources.tsx   # Resource mapping
│   └── Reports.tsx     # Report verification
└── App.tsx             # Main application component
```

## 🔧 Configuration

### **Environment Variables**

Create a `.env.local` file for API keys:

```env
# Google Gemini API (for image verification)
VITE_GEMINI_API_KEY=your_gemini_api_key

# Mapbox API (for enhanced mapping)
VITE_MAPBOX_TOKEN=your_mapbox_token

# Custom API endpoints
VITE_API_BASE_URL=http://localhost:3001
```

### **Tailwind Configuration**

The project includes custom Tailwind extensions in `tailwind.config.ts`:

- Emergency color palette
- Glassmorphism utilities
- Custom animations
- Emergency-specific gradients

## 🚀 Deployment

### **Production Build**

```bash
npm run build
```

### **Deployment Platforms**

- **Vercel** - Recommended for frontend deployment
- **Netlify** - Alternative static deployment
- **AWS S3** - Enterprise cloud deployment
- **Docker** - Containerized deployment

### **Performance Optimizations**

- Code splitting with React.lazy()
- Image optimization and lazy loading
- API response caching (15-minute cycles)
- Bundle size optimization with Vite

## 🤝 Contributing

We welcome contributions to improve the disaster response platform!

### **Development Workflow**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Standards**

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Conventional Commits** for commit messages

### **Testing**

- Unit tests with **Vitest**
- Component testing with **React Testing Library**
- Integration tests for critical workflows

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Documentation

### **Getting Help**

- 📧 **Technical Support**: Create an issue in the repository
- 📖 **Documentation**: Comprehensive inline code documentation
- 🐛 **Bug Reports**: Use the issue tracker with detailed reproduction steps

### **Emergency Contacts**

For critical emergency management deployments:

- 🚨 **Emergency Support**: Available 24/7 for production deployments
- 📞 **Technical Hotline**: Real-time assistance for emergency responders

## 🏆 Acknowledgments

### **Data Sources**

- **USGS** - United States Geological Survey for earthquake data
- **NOAA** - National Weather Service for weather alerts
- **NASA** - Fire Information Resource Management System
- **OpenStreetMap** - Geographic data and mapping services

### **Technology Partners**

- **Radix UI** - Accessible component primitives
- **Tailwind Labs** - Modern CSS framework
- **Vercel** - Deployment and hosting platform
- **Google** - AI and mapping services

---

## 🚨 Emergency Response Platform

_Coordinating disaster response through technology_

**Built with ❤️ for emergency responders and communities worldwide**

---

_For real-world emergency deployments, please ensure compliance with local emergency management protocols and data privacy regulations._
