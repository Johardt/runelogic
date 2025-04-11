# AI Dungeonmaster

An AI-powered dungeon master web application that provides an immersive role-playing experience with strict rule enforcement and resource management.

## Features

- **Game Creation**: Start new adventures with generated characters and scenarios.
- **Turn-based Interaction**: Engage with the AI through text commands.
- **State Management**: Game state persists across sessions.
- **AI Integration**: Powered by state-of-the-art language models.
- **Character Management**: Create, view, and manage characters.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle
- **Styling**: Tailwind CSS
- **Schema Validation**: Zod

## Getting Started

1.  **Prerequisites:** Node.js (v20+ recommended), Docker, Docker Compose.
2.  **Environment:** Copy `.env.example` to `.env` and fill in your `DATABASE_URL` (e.g., `postgresql://user:password@localhost:5432/dungeonmaster?schema=public`).
3.  **Install Dependencies:** `npm install`
4.  **Database Setup:** Run `npx prisma migrate dev` to set up the initial database schema.
5.  **Run Development Environment:** `docker-compose up --build`
6.  **Access:** Open [http://localhost:3000](http://localhost:3000)

## Codebase Overview

This section provides a high-level overview of the project structure and key components.

- **Framework:** [Next.js](https://nextjs.org/) (App Router) with [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/).
- **Styling:** [Tailwind CSS](https://tailwindcss.com/).
- **Database:** [PostgreSQL](https://www.postgresql.org/).
- **ORM:** [Drizzle](https://orm.drizzle.team/) for database access, schema management, and migrations.
- **Runtime Validation:** [Zod](https://zod.dev/) for validating complex data structures (like game state) at runtime.
- **Deployment (Local):** [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) define the development environment (App, DB, Migrations).

### Key Directories & Files:

- **`src/app/`**: Core Next.js App Router directory.
  - **`api/`**: Contains API route handlers (e.g., creating/loading games, handling player actions).
  - **`(pages)/`**: Contains frontend page components (e.g., Home, New Game, Game View, Load Game, Character screens).
  - **`layout.tsx`**: The root layout component, wrapping all pages, includes global nav and providers (like react-hot-toast).
- **`src/lib/`**: Contains shared library code.
  - **`db/`**: Database-related code.
    - `index.ts`: Sets up and exports the singleton Prisma client.
    - `databaseService.ts`: Encapsulates all database interactions (CRUD operations for sessions, characters, etc.) using the Prisma client. Exports a singleton instance.
- **`src/hooks/`**: Reusable React hooks (e.g., `useFetchData`).
- **`src/types/`**: Shared TypeScript type definitions and Zod validation schemas (e.g., `game.ts`).
- **`public/`**: Static assets.
- **`components/`**: (Optional - can be added for shared UI components).
- **`Dockerfile`**: Defines how the application container image is built.
- **`docker-compose.yml`**: Defines the multi-container local development environment (app, database, migrations service).
- **`tailwind.config.ts`, `postcss.config.js`**: Configuration for Tailwind CSS.
- **`tsconfig.json`**: TypeScript configuration.
- **`next.config.mjs`**: Next.js configuration.

### Core Concepts:

- **GameSession:** Represents a single playthrough. Stores the AI model choice and the current `state` (as JSON).
- **Character:** Represents a character _template_ chosen at the start of a session.
- **GameState (JSON):** A large JSON object stored in `GameSession.state`. Contains the current scene details, NPC states, player inventory (within the session context, though currently minimal), game time, etc. It's the snapshot of the game world.
- **DatabaseService:** Provides a structured way to interact with the database, hiding raw Prisma calls from API routes.
- **Zod Validation:** Used to ensure the `GameState` JSON read from the database or returned by the (mock) AI conforms to the expected structure at runtime.
- **API Routes:** Handle frontend requests, call the `DatabaseService`, process logic (like the game action loop), and return responses.
- **Frontend Components:** Fetch data using the `useFetchData` hook, display information, and handle user interactions (like submitting actions).

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/             # Shared utilities
│   ├── ai/          # AI integration
│   ├── game/        # Game mechanics
│   └── db/          # Database utilities
├── types/           # TypeScript type definitions
└── server/          # Backend logic

data/               # Game resources for RAG
public/             # Static assets
```

## Development

- Follow TypeScript best practices
- Use ESLint for code quality
- Write tests for critical functionality
- Document complex logic
- Follow the established project structure

## License

MIT
