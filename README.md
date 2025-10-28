# Dispatch Voice AI - Frontend

AI Voice Agent Platform for Logistics Dispatch - React Frontend

## 🚀 Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Create React App
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Voice SDK:** Retell Web SDK
- **Charts:** Recharts

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Backend API running (see backend README)

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd dispatch-voice-ai-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create `.env` file in the root directory:
```env
# Backend API URL
REACT_APP_NAME=Dispatch Voice AI
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
```

### 4. Run Development Server
```bash
npm start
```

The application will be available at: `http://localhost:3000`

### 5. Build for Production
```bash
npm run build
```

The optimized build will be in the `build/` directory.

## 📁 Project Structure
```
dispatch-voice-ai-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Generic components (Button, Input, Card)
│   │   ├── layout/          # Layout components (Navbar, Sidebar)
│   │   ├── agents/          # Agent-specific components
│   │   └── calls/           # Call-specific components
│   ├── pages/               # Page components
│   │   ├── auth/            # Login, Register
│   │   ├── dashboard/       # Dashboard with analytics
│   │   ├── agents/          # Agent management
│   │   ├── calls/           # Call history and details
│   │   ├── analytics/       # Advanced analytics
│   │   └── settings/        # System settings
│   ├── redux/               # Redux store and slices
│   │   ├── store.ts
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       ├── agentSlice.ts
│   │       └── callSlice.ts
│   ├── services/            # API service layer
│   │   ├── api.ts           # Axios instance
│   │   ├── authService.ts
│   │   ├── agentService.ts
│   │   ├── callService.ts
│   │   └── analyticsService.ts
│   ├── hooks/               # Custom React hooks
│   │   ├── useAgents.ts
│   │   └── useCalls.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── agent.ts
│   │   └── call.ts
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main app component
│   ├── index.tsx            # Entry point
│   └── index.css            # Global styles
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 🎨 Features

### ✅ Authentication
- User registration and login
- JWT token management
- Protected routes
- Persistent sessions

### ✅ Dashboard
- Real-time analytics overview
- Total calls, average duration, sentiment distribution
- Recent calls list
- Quality score trends

### ✅ Agent Management
- Create and configure AI agents
- Edit agent prompts and voice settings
- Scenario-based templates (check-in, emergency, etc.)
- Agent activation/deactivation

### ✅ Call Initiation
- **Web Calls:** Browser-based testing with microphone
- **Phone Calls:** Real telephony to driver numbers
- Agent selection
- Metadata input (driver name, load number)

### ✅ Call History
- Paginated call list
- Advanced filters (status, sentiment, load number)
- Status badges
- Sentiment indicators

### ✅ Call Details
- Full transcript viewer
- Real-time conversation history
- Structured data extraction results
- Post-call analysis
  - Sentiment analysis
  - Quality score
  - Key topics
  - Summary

### ✅ Analytics
- Sentiment distribution charts
- Call volume trends
- Quality score metrics
- Date range filtering

### ✅ Settings
- LLM provider selection (Groq/OpenAI)
- System configuration

## 🔐 Authentication Flow

1. User logs in via `/auth/login`
2. Backend returns JWT token
3. Token stored in Redux + localStorage
4. Axios interceptor adds `Authorization: Bearer <token>` to all requests
5. Protected routes check authentication status

## 📱 Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Dashboard | Analytics overview |
| `/auth/login` | Login | User authentication |
| `/auth/register` | Register | New user signup |
| `/agents` | AgentList | List all agents |
| `/agents/new` | CreateAgent | Create new agent |
| `/agents/:id/edit` | EditAgent | Edit agent configuration |
| `/calls` | CallHistory | Call history with filters |
| `/calls/new` | NewCall | Initiate new call |
| `/calls/:id` | CallDetail | Detailed call view |
| `/calls/web-call-interface` | WebCallInterface | Active web call UI |
| `/analytics` | Analytics | Advanced analytics |
| `/settings` | Settings | System settings |

## 🎨 UI Components

### Common Components
- **Button:** Primary, secondary, danger variants
- **Input:** Text, email, password, textarea
- **Card:** Container with optional header/footer
- **Alert:** Success, error, warning, info messages
- **Badge:** Status indicators
- **Loading:** Spinner loaders

### Layout Components
- **Navbar:** Top navigation with user menu
- **Sidebar:** Left navigation menu
- **Layout:** Main layout wrapper

## 🔧 Available Scripts
```bash
# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject (not recommended)
npm run eject
```

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| react | UI framework |
| react-router-dom | Routing |
| @reduxjs/toolkit | State management |
| axios | HTTP client |
| tailwindcss | Styling |
| recharts | Charts |
| retell-client-js-sdk | Voice calls |
| @heroicons/react | Icons |

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Port 3000 is default, change in package.json if needed
"start": "PORT=3001 react-scripts start"
```

### API Connection Failed
- Check `REACT_APP_API_BASE_URL` in `.env`
- Ensure backend is running on correct port
- Verify CORS settings in backend

### Microphone Not Working (Web Calls)
- Check browser permissions
- Test in supported browsers (Chrome, Firefox, Safari)

## 🌐 Browser Support

- Chrome/Edge (latest 2 versions) ✅
- Firefox (latest 2 versions) ✅
- Safari (latest 2 versions) ✅

