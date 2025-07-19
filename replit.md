# Vocabulary Builder Application

## Overview

This is a full-stack vocabulary learning application built with React, Express, and PostgreSQL. The app teaches word morphology through an interactive LEGO-block visualization system, where users can assemble and disassemble words to understand their prefix, root, and suffix components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Animation**: Framer Motion for interactive animations
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Style**: RESTful API endpoints
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Validation**: Zod schemas for request/response validation
- **Development**: Hot-reload with Vite integration

### Data Storage
- **Database**: PostgreSQL (configured via Drizzle)
- **Migration Tool**: Drizzle Kit for schema migrations
- **Connection**: Neon Database serverless driver
- **Fallback**: In-memory storage implementation for development

## Key Components

### Database Schema
- **Morphemes Table**: Stores word parts (prefix, root, suffix) with definitions and examples
- **Words Table**: Stores complete words with their morpheme breakdowns
- **Data Types**: JSON fields for storing arrays (examples, components)

### Frontend Components
- **LegoBlock**: Interactive word component visualization with hover animations
- **WordDisplay**: Main word assembly/disassembly interface
- **MorphemeTooltip**: Educational popups showing morpheme details
- **VocabularyBuilder**: Primary learning interface

### API Endpoints
- `GET /api/words` - Fetch all words
- `GET /api/words/:word` - Get specific word details
- `POST /api/words` - Create new word
- `GET /api/morphemes/:text/:type` - Get morpheme information
- `POST /api/morphemes` - Create new morpheme

## Data Flow

1. **User Interaction**: User clicks on LEGO blocks or selects words
2. **State Management**: TanStack Query manages server state and caching
3. **API Communication**: RESTful requests to Express backend
4. **Database Operations**: Drizzle ORM handles PostgreSQL queries
5. **Response Processing**: Data flows back through the same chain
6. **UI Updates**: React components re-render with new data

### Animation Flow
- Assembly/disassembly triggers Framer Motion animations
- Staggered animations for individual morpheme blocks
- Hover effects provide visual feedback
- Tooltip positioning calculated dynamically

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React 18 with TypeScript
- **Component Library**: Radix UI primitives via shadcn/ui
- **Styling**: Tailwind CSS with custom LEGO-themed color variables
- **Query Management**: TanStack Query for server state
- **Animation**: Framer Motion for smooth transitions
- **Form Handling**: React Hook Form with Hookform Resolvers

### Backend Dependencies
- **Server**: Express.js with TypeScript support
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod for schema validation
- **Database Driver**: Neon Database serverless client
- **Development**: tsx for TypeScript execution

### Development Tools
- **Build System**: Vite with React plugin
- **Database Migrations**: Drizzle Kit
- **Type Checking**: TypeScript with strict configuration
- **Error Handling**: Replit runtime error overlay
- **Development Server**: Express with Vite middleware integration

## Deployment Strategy

### Development Mode
- Vite dev server with HMR for frontend
- Express server with tsx for backend hot-reload
- In-memory storage fallback for quick testing
- Integrated error overlays for debugging

### Production Build
- Vite builds optimized frontend bundle
- esbuild bundles Express server for Node.js
- Static files served from Express
- PostgreSQL database required for persistent storage

### Database Setup
- Drizzle migrations manage schema evolution
- Environment variable `DATABASE_URL` required
- Push command for schema synchronization
- Neon Database recommended for serverless deployment

### Configuration
- TypeScript paths for clean imports
- Tailwind configured for client directory
- PostCSS with autoprefixer
- Component aliases for shadcn/ui integration