# Architecture Documentation

## Overview

This document outlines the technical architecture of the Expensify application, built using the T3 Stack with Next.js, TypeScript, Prisma, tRPC, NextAuth, and Vitest.

## Technology Stack

### Core Technologies

- **Next.js** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Database ORM with PostgreSQL
- **tRPC** - End-to-end typesafe APIs with TanStack Query integration
- **NextAuth** - Authentication framework for Next.js
- **Tailwind CSS** - Utility-first CSS framework
- **Zod** - Schema validation and type inference

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing framework with multi-environment setup
- **pnpm** - Package manager

## Client-Server Architecture

### tRPC Integration

The application uses tRPC to create a type-safe interface between client and server. This eliminates the need for manual API type definitions and provides end-to-end type safety.

#### Server-Side Structure

```
src/server/
├── api/
│   ├── root.ts              # Main tRPC router
│   ├── trpc.ts              # tRPC configuration and middleware
│   └── routers/             # Domain-specific routers with business logic
│       ├── post.ts          # Post-related procedures and logic
│       └── [other-routers]/
├── auth/                    # NextAuth configuration
│   ├── index.ts            # Auth exports
│   └── config.ts           # Auth configuration
├── db/                     # Database configuration
│   ├── index.ts            # Prisma client
│   └── __mocks__/          # Test database mocks
```

#### Client-Side Integration

The client uses TanStack Query (React Query) for state management and caching:

```typescript
// src/trpc/react.tsx
export const api = createTRPCReact<AppRouter>();

// Usage in components
const { data, isLoading } = api.post.all.useQuery();
const createPost = api.post.create.useMutation();
```

### NextAuth Authentication

NextAuth provides authentication with session management integrated into the tRPC context:

```typescript
// Server context includes session
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth();
  return { db, session, ...opts };
};

// Protected procedures can access session
const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
```

## Business Logic Organization

### tRPC Router Pattern

Business logic is organized directly within tRPC routers, keeping the architecture simple and focused:

```typescript
// src/server/api/routers/post.ts
export const postRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    // Business logic directly in the router
    return await ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),
  
  create: protectedProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Business logic and validation
      return await ctx.db.post.create({
        data: {
          title: input.title,
          content: input.content,
          authorId: ctx.session.user.id,
        },
      });
    }),
});
```

**Benefits of this approach:**
- **Simpler architecture** - No additional abstraction layer
- **Direct database access** - Business logic has immediate access to Prisma client
- **Easy testing** - Test the entire procedure including business logic
- **Type safety** - Full end-to-end type safety with tRPC

**When to consider services:**
- Complex business logic that spans multiple routers
- Logic that needs to be reused across different procedures
- Heavy computational operations that benefit from separation

## Testing Strategy

### Vitest Configuration

The project uses Vitest with a multi-environment setup:

- **Server tests** (`src/server/**/*.test.ts`): Run in `node` environment
- **App tests** (`src/app/**/*.test.{ts,tsx}`): Run in `jsdom` environment with React setup

### Transactional Testing

The application uses transactional testing for database operations using `@chax-at/transactional-prisma-testing`. This approach:

1. **Wraps each test in a transaction** - Database changes are isolated
2. **Automatically rolls back** - No test data persists between tests
3. **Provides realistic testing** - Tests run against actual database operations
4. **Ensures test isolation** - No cross-test contamination

```typescript
// src/server/db/__mocks__/index.ts
import { PrismaTestingHelper } from "@chax-at/transactional-prisma-testing";

const prismaTestingHelper = new PrismaTestingHelper(originalPrismaClient);
export const db = prismaTestingHelper.getProxyClient();

beforeEach(async () => {
  await prismaTestingHelper.startNewTransaction();
});

afterEach(() => {
  prismaTestingHelper?.rollbackCurrentTransaction();
});
```

### Testing Patterns

#### Server-Side Testing (Transactional)

For integration testing with real database operations:

```typescript
import { describe, it, expect } from "vitest";
import { createCaller } from "~/server/api/root";
import { db } from "~/server/db/__mocks__";

describe("Post Router", () => {
  it("should create and retrieve posts", async () => {
    const caller = createCaller({ db, session: null, headers: new Headers() });
    
    // This runs in a transaction and gets rolled back
    const created = await caller.post.create({ 
      title: "Test Post", 
      content: "Test Content" 
    });
    const allPosts = await caller.post.all();
    
    expect(allPosts).toHaveLength(1);
    expect(allPosts[0]).toEqual(created);
  });
});
```

#### Component Testing

**UI Testing Strategy**: Manual testing is preferred for complex UI components. Only test stateless components that are easy to test:

```typescript
// Only test simple, stateless components
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SimpleComponent } from "./SimpleComponent";

describe("SimpleComponent", () => {
  it("should render with correct text", () => {
    render(<SimpleComponent text="Hello" />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

**What to Skip**:
- Complex UI interactions
- Form validation flows
- Animation and visual effects
- Integration with external libraries

**What to Test**:
- Utility functions
- Data transformation logic
- Simple presentational components
- Business logic in services

### Testing Best Practices

1. **Use transactional testing** for database operations in tRPC procedures
2. **Test procedures end-to-end** using `createCaller` for realistic testing
3. **Mock external dependencies** for unit tests when needed
4. **Test business logic** directly in the procedures where it lives
5. **Keep component tests simple** and focused on rendering
6. **Use integration tests** for critical user flows through tRPC
7. **Prefer manual testing** for complex UI interactions

