# Runelogic - AI Dungeon Master

**Runelogic** is a web application designed to act as an AI-powered Dungeon Master (DM) for text-based role-playing games. It leverages modern AI models to provide an immersive and dynamic storytelling experience, complete with character management, rule adherence, and interactive chat.

<!-- Add a screenshot or GIF here -->
<!-- ![Screenshot](link/to/screenshot.png) -->

<!-- Add a link to a live demo if available -->
<!-- **Live Demo:** [Link to your deployed application] -->

## Features

- **AI-Powered Narrative:** Utilizes large language models (LLMs) via OpenAI and Google APIs to generate dynamic storylines, NPC interactions, and world descriptions based on player actions.
- **Character Creation & Management:** Allows users to create detailed characters with stats and backstories, persisted via a database.
- **Interactive Chat Interface:** Provides a real-time chat interface for players to interact with the AI DM and progress the adventure.
- **Rule Enforcement:** Incorporates [Dungeon World RPG](https://www.dungeonworldsrd.com/) rule sets to guide the AI's decisions and maintain game consistency.
- **User Accounts & Data Persistence:** Secure user authentication and data storage using Supabase.
- **Flexible API Key Management:** Users can securely store their OpenAI/Google API keys either server-side (encrypted) or locally on their device.
- **Guest Mode:** Allows users to try the application and engage in adventures without creating an account.
- **Modern Web Experience:** Built with the latest Next.js features for optimal performance and safety.

## Technology Stack

This project leverages a modern, type-safe technology stack:

- **Framework:** [Next.js](https://nextjs.org/) 15 (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Backend & Database:** [Supabase](https://supabase.io/) (PostgreSQL, Auth, Storage)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Schema Validation:** [Zod](https://zod.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/)
- **Package Manager:** [pnpm](https://pnpm.io/)

## Project Structure Highlights

- **App Router:** Organizes routes, layouts, loading states, and error boundaries intuitively within the `src/app/` directory.
- **Server Components & Actions:** Leverages React Server Components for efficient data fetching and Server Actions for mutations, minimizing client-side JavaScript.
- **Feature-Based Organization:** Routes and components are grouped by feature (e.g., `adventures`, `characters`, `auth`).
- **Database Services:** Clear separation of database interaction logic in `src/db/services/`.
- **Type Safety:** End-to-end type safety from database schema (Drizzle) to API routes/actions (Zod) and frontend components (TypeScript).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [pnpm](https://pnpm.io/installation)
- A [Supabase](https://supabase.io/) account or local Supabase setup.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Johardt/runelogic
    cd runelogic
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

### Environment Variables

1.  Create a `.env.local` file in the root of the project.
2.  Add your Supabase project URL and anon key:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```
3.  Add your Supabase service role key (for server-side operations, keep this secret!):
    ```env
    SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
    ```
4.  Add a secret key for encrypting server-stored API keys (generate a strong random string):
    ```env
    ENCRYPTION_KEY=YOUR_STRONG_SECRET_ENCRYPTION_KEY
    ```
5.  (Optional) Add default OpenAI/Google API keys if needed for specific server functions or testing:
    ```env
    # OPENAI_API_KEY=YOUR_DEFAULT_OPENAI_KEY
    # GOOGLE_API_KEY=YOUR_DEFAULT_GOOGLE_KEY
    ```

### Database Setup

1.  Ensure your Supabase project is running (cloud or local).
2.  Apply the database schema using Drizzle migrations:
    ```bash
    pnpm drizzle:generate # Generate migration SQL based on schema changes
    pnpm drizzle:push     # Apply the migration to your database
    ```
    _Note: Review the generated SQL before pushing._

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Roadmap

### Minimum Lovable Product (MLP)

- [ ] Robust Onboarding / Tutorial System (e.g., using tooltips).
- [ ] Pre-defined Scenarios / Adventure Starters.
- [ ] Basic NPC generation and interaction tracking.
- [ ] Implement Guest Mode functionality.

### Towards 1.0

- [ ] Quest Tracking System.
- [ ] Player Inventory Management.
- [ ] Adventure Summarization & Title Generation.
- [ ] Refined UI/UX, potentially custom font and design system polish.
- [ ] Implement basic rule enforcement logic for the AI DM.

### Beyond 1.0

- [ ] Support for user-defined system prompts.
- [ ] Integration with additional AI providers (e.g., Anthropic Claude, Groq).
- [ ] Multiplayer capabilities.
- [ ] Image generation for scenes/characters..
