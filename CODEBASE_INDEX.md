# Josh App - Codebase Index

## Project Overview

**Josh App** is a comprehensive personal productivity and creativity hub built with Next.js 15, React 19, and Supabase. The application features a modern liquid glass design system and provides integrated tools for task management, mood tracking, habit formation, finance monitoring, learning, note-taking, calendar management, and AI assistance.

## Technology Stack

### Core Technologies
- **Framework**: Next.js 15.2.4 (App Router)
- **Frontend**: React 19, TypeScript 5
- **Styling**: Tailwind CSS 4.1.9, Custom Glass Design System
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Fonts**: Geist Sans & Geist Mono

### Key Dependencies
- `@supabase/ssr` & `@supabase/supabase-js` - Database and auth
- `@radix-ui/*` - Accessible UI primitives
- `class-variance-authority` - Component variant management
- `clsx` & `tailwind-merge` - Conditional styling
- `date-fns` - Date manipulation
- `next-themes` - Theme management
- `react-day-picker` - Calendar components
- `sonner` - Toast notifications
- `zod` - Schema validation

## Project Structure

```
Josh-mt/
├── app/                          # Next.js App Router
│   ├── auth/callback/           # Supabase auth callback
│   ├── login/                   # Authentication page
│   ├── globals.css              # Global styles & glass design system
│   ├── layout.tsx               # Root layout with fonts
│   └── page.tsx                 # Main dashboard page
├── components/                   # React components
│   ├── ui/                      # Base UI components (shadcn/ui)
│   ├── glass-card.tsx           # Core glass design component
│   ├── floating-nav.tsx         # Bottom navigation
│   ├── dashboard-grid.tsx       # Main dashboard overview
│   ├── smart-todo-manager.tsx   # Advanced task management
│   ├── personal-ai-hub.tsx      # AI assistant interface
│   ├── mood-tracker.tsx         # Mood and wellness tracking
│   ├── habit-tracker.tsx        # Habit formation and tracking
│   ├── finance-watch.tsx        # Financial monitoring
│   ├── learning-corner.tsx      # Learning management
│   ├── quick-notes.tsx          # Note-taking system
│   ├── calendar-view.tsx        # Calendar integration
│   └── writing-studio.tsx       # Writing workspace
├── lib/                         # Utilities and configurations
│   ├── supabase/               # Supabase client setup
│   └── utils.ts                # Utility functions
├── scripts/                     # Database migration scripts
├── public/                      # Static assets
└── middleware.ts                # Next.js middleware for auth
```

## Core Features

### 1. Dashboard System
- **File**: `components/dashboard-grid.tsx`
- **Purpose**: Centralized overview of all user data
- **Features**:
  - Task completion progress
  - Daily mood display
  - Habit streak tracking
  - Recent transactions
  - Portfolio overview
  - Activity summary

### 2. Smart Task Management
- **File**: `components/smart-todo-manager.tsx`
- **Purpose**: Advanced task organization and productivity
- **Features**:
  - AI-powered task analysis and categorization
  - Priority-based organization (low, medium, high, critical)
  - Status tracking (todo, in_progress, done, snoozed, archived)
  - Smart filtering and search
  - Due date management
  - Category-based grouping (#EE, #content, #infra, personal)
  - Quick filters for specific views
  - Task completion statistics

### 3. Mood & Wellness Tracking
- **File**: `components/mood-tracker.tsx`
- **Purpose**: Mental health and wellness monitoring
- **Features**:
  - 5-point mood scale with emojis
  - Energy level tracking
  - Stress level monitoring
  - Tag-based categorization
  - Notes and reflections
  - Historical mood trends
  - Weekly/monthly analytics

### 4. Habit Formation System
- **File**: `components/habit-tracker.tsx`
- **Purpose**: Building and maintaining positive habits
- **Features**:
  - Habit creation with difficulty levels
  - Streak tracking and best streak records
  - Category-based organization
  - Reminder system
  - Progress visualization
  - Achievement system with badges
  - Habit completion calendar view

### 5. Personal AI Hub
- **File**: `components/personal-ai-hub.tsx`
- **Purpose**: AI-powered productivity assistance
- **Features**:
  - Chat interface with AI assistant
  - Quick action templates
  - Context-aware suggestions
  - Voice input support
  - Productivity insights
  - Goal planning assistance

### 6. Financial Monitoring
- **File**: `components/finance-watch.tsx`
- **Purpose**: Personal finance tracking and analysis
- **Features**:
  - Transaction logging
  - Income/expense categorization
  - Budget tracking
  - Financial goal setting
  - Spending analytics
  - Investment portfolio monitoring

### 7. Learning Management
- **File**: `components/learning-corner.tsx`
- **Purpose**: Educational content and skill development
- **Features**:
  - Course tracking
  - Learning progress monitoring
  - Resource organization
  - Skill assessment
  - Learning goals
  - Knowledge base management

### 8. Note-Taking System
- **File**: `components/quick-notes.tsx`
- **Purpose**: Organized note management
- **Features**:
  - Rich text editing
  - Folder organization
  - Tag-based categorization
  - Search functionality
  - Note templates
  - Voice notes support
  - Attachment handling

### 9. Calendar Integration
- **File**: `components/calendar-view.tsx`
- **Purpose**: Schedule and event management
- **Features**:
  - Calendar view with events
  - Task integration
  - Event creation and editing
  - Reminder system
  - Time blocking
  - Recurring events

### 10. Writing Studio
- **File**: `components/writing-studio.tsx`
- **Purpose**: Dedicated writing environment
- **Features**:
  - Distraction-free writing
  - Word count tracking
  - Writing goals
  - Document organization
  - Export functionality
  - Writing analytics

## Design System

### Glass Design System
- **File**: `app/globals.css`
- **Concept**: Liquid glass aesthetic with backdrop blur effects
- **Components**:
  - `.glass-panel` - Main container with glass effect
  - `.glass-button` - Interactive elements
  - `.glass-active` - Active state styling
  - `.glass-hover` - Hover effects

### Color Palette
- **Primary**: Cyan to blue gradients
- **Secondary**: Purple to pink accents
- **Neutral**: Slate grays
- **Status Colors**: Green (success), Red (error), Yellow (warning), Blue (info)

### Typography
- **Primary Font**: Geist Sans
- **Monospace**: Geist Mono
- **Hierarchy**: Clear size and weight distinctions

## Database Schema

### Core Tables
1. **users** - User profiles and authentication
2. **tasks** - Task management with categories, priorities, and status
3. **moods** - Mood tracking with scores, energy, and stress levels
4. **habits** - Habit definitions and tracking
5. **habit_completions** - Daily habit completion records
6. **transactions** - Financial transaction logging
7. **notes** - Note-taking with folders and tags
8. **note_folders** - Note organization structure
9. **investments** - Investment portfolio tracking
10. **calendar_events** - Calendar and scheduling

### Key Relationships
- All tables include `user_id` for multi-tenant architecture
- Row Level Security (RLS) enabled on all tables
- Proper indexing for performance optimization
- Foreign key constraints for data integrity

## Authentication & Security

### Supabase Integration
- **Client**: `lib/supabase/client.ts` - Browser-side operations
- **Server**: `lib/supabase/server.ts` - Server-side operations
- **Middleware**: `middleware.ts` - Route protection
- **Callback**: `app/auth/callback/route.ts` - OAuth handling

### Security Features
- JWT-based authentication
- Row Level Security (RLS) policies
- CSRF protection
- Secure cookie handling
- Environment variable protection

## Configuration

### Next.js Configuration
- **File**: `next.config.mjs`
- **Settings**:
  - ESLint and TypeScript errors ignored during builds
  - Image optimization disabled
  - Custom build configurations

### TypeScript Configuration
- **File**: `tsconfig.json`
- **Features**:
  - Strict mode enabled
  - Path aliases configured (@/*)
  - Next.js plugin integration
  - Modern ES6+ target

### Component Configuration
- **File**: `components.json`
- **Settings**:
  - shadcn/ui configuration
  - New York style variant
  - Tailwind CSS integration
  - Lucide icon library

## Development Workflow

### Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - Code linting

### Database Migrations
- **Location**: `scripts/` directory
- **Purpose**: Schema evolution and data migrations
- **Execution**: Manual SQL execution in Supabase dashboard

## Key Architectural Decisions

1. **App Router**: Using Next.js 15 App Router for modern routing
2. **Server Components**: Leveraging React Server Components where appropriate
3. **Client Components**: Using "use client" for interactive features
4. **Glass Design**: Custom CSS-based design system for unique aesthetics
5. **Supabase**: Full-stack solution for database and authentication
6. **TypeScript**: Strict typing throughout the application
7. **Component Composition**: Modular component architecture
8. **State Management**: Local state with React hooks, no external state library

## Performance Considerations

1. **Image Optimization**: Disabled for development, configurable for production
2. **Database Indexing**: Proper indexes on frequently queried columns
3. **Component Lazy Loading**: Dynamic imports for large components
4. **CSS Optimization**: Tailwind CSS purging and optimization
5. **Bundle Analysis**: Next.js built-in bundle analyzer

## Future Enhancements

1. **Real-time Features**: WebSocket integration for live updates
2. **Mobile App**: React Native or PWA implementation
3. **Advanced Analytics**: Machine learning insights
4. **Third-party Integrations**: Calendar, email, and productivity tool APIs
5. **Collaboration Features**: Multi-user support and sharing
6. **Advanced AI**: GPT integration for enhanced assistance
7. **Data Export**: Comprehensive data export functionality
8. **Themes**: Multiple design theme options

## Getting Started

1. **Prerequisites**: Node.js 18+, pnpm
2. **Installation**: `pnpm install`
3. **Environment**: Configure Supabase environment variables
4. **Database**: Run migration scripts in Supabase
5. **Development**: `pnpm dev`
6. **Build**: `pnpm build`

## Contributing

1. Follow TypeScript strict mode
2. Use the established component patterns
3. Maintain the glass design system
4. Write comprehensive component documentation
5. Test database migrations thoroughly
6. Follow the established file structure

---

*This codebase represents a comprehensive personal productivity application with modern web technologies and a unique design aesthetic. The modular architecture allows for easy extension and maintenance.*
