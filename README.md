# AI Career Coach

A Next.js application that provides personalized, AI-driven career guidance, interview preparation through industry and skill-tailored assessments, and resume and cover-letter generation functionalities.

## Project Structure

A high-level view of the repository and where to find the main pieces of functionality.

```
./
├──src
    ├──app/
        ├── api/                 - Server routes (Inngest webhook handlers, AI endpoints)
        ├── (auth)/              - Authenticated route group (onboarding, protected pages)
        ├── globals.css          - Tailwind base + global styles
    ├──components/
        ├── ui/                  - shadcn/ui wrappers and shared UI primitives
        ├── layout/              - layout components (Header, Footer)
        ├── landing/             - landing page sections
    ├──lib/
        ├── genAi.ts             - Gemini SDK entry point
        ├── inngest/             - Inngest client & workflow helpers
        ├── prisma.ts            - Prisma client wrapper
        ├── auth.ts              - Clerk helper utilities
    ├──prisma/
        ├── schema.prisma        - DB schema
        ├── migrations/          - generated migration files
├──public/                       - static assets and favicons
```

## Features (overview)

- AI-driven coach: industry trends and recommendations, resume enhancement, interview prep, cover letter generation.
- Auth & user profiles: sign up / sign in, persisted user data and preferences.
- Workflows & background jobs: asynchronous processing for long-running tasks (industry insights generation)
- Persistent storage: user profiles, resumes, cover letters and industry insights in Postgres.

## Key technologies

- Next.js (app router) — core framework.
- React — UI layer.
- Tailwind CSS — utility-first styling.
- shadcn/ui (Radix + Tailwind) — prebuilt accessible components.
- Clerk — user authentication & session management.
- Postgres — primary relational database.
- Prisma — ORM for schema and migrations.
- Inngest — workflows and background job orchestration.
- Gemini API — For AI insights. Configure via environment variable.
- Puppeteer — generate downloadable pdf from html/markdown.

## Requirements

- Node.js (v22+ recommended)
- Postgres database
- [Clerk account](https://clerk.com/docs) (for auth)
- [Inngest account](https://www.inngest.com/) (for workflows)
- [Google AI Studio account](https://aistudio.google.com/) (Gemini)

## Quick start

1. Clone the repo:

   ```bash
   git clone <repo-url>
   cd ai-career-coach
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn
   ```

3. Create a .env from the template (see next section) and fill in secrets.

4. Start the dev server:

   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

   Open http://localhost:3000

5. Start the inngest dev server:
   ```bash
   npx inngest-cli dev
   ```
   Open http://localhost:8288 in your browser to see the Inngest Dev Server UI

## Environment variables (example)

Create a .env with at least:

```
# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_career_coach

# Gemini
GEMINI_API_KEY=sk-...
```

## Authentication (Clerk)

- Register an application at Clerk dashboard.
- Add the publishable key and secret to .env.
- The UI uses Clerk React components for sign-in / user management.

## Workflows (Inngest)

- Run the inngest dev server.
- Inngest automatically detects functions, and they can be invoked from the dev server ui.

## AI provider (Gemini)

- Create a new API key in the Google Studio AI dashboard.
- Copy the API key and set it as the value of **GEMINI_API_KEY** in the .env file.
