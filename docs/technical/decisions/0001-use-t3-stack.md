# 1. Use T3 Stack with create-t3-app

## Status

Accepted

## Context

We needed to bootstrap a new project with a simple, well-known architecture that would be familiar to AI agents and developers. The goal was to minimize complexity while using widely adopted technologies that provide good developer experience and type safety.

Key requirements:
- Simple architecture that's easy for AI agents to understand and work with
- Type safety throughout the stack
- Fast development experience
- Minimal boilerplate and configuration
- Good integration between frontend and backend

## Decision

We chose to use the T3 stack bootstrapped with `create-t3-app` using the following command:

```bash
pnpm create t3-app@latest expensify --CI --prisma --tailwind --dbProvider postgres --appRouter --eslint
```

### Technology Choices:

1. **T3 Stack (create-t3-app)**: Provides a well-integrated, type-safe full-stack solution with minimal configuration
2. **Next.js with App Router**: Enables server components, reducing the need for a separate API layer and simplifying the architecture
3. **Prisma**: Type-safe database access with automatic migration generation and schema definition that's LLM-friendly
4. **PostgreSQL**: Reliable, well-supported database that the team is familiar with
5. **pnpm**: Fast package manager that stays close to the Node.js ecosystem (avoided Bun to maintain familiarity)
6. **Tailwind CSS**: Utility-first CSS framework for rapid UI development
7. **ESLint**: Code quality and consistency
8. **tRPC**: End-to-end type-safe APIs with TanStack Query integration for client-server communication
9. **NextAuth**: Authentication framework for Next.js with session management integrated into tRPC context

## Consequences

### Positive:
- **AI Agent Friendly**: The stack uses widely known technologies that AI agents can easily understand and work with
- **Type Safety**: Full-stack type safety from database to UI through tRPC
- **Rapid Development**: Server components eliminate the need for a separate API layer, reducing context complexity
- **LLM-Friendly Schema**: Prisma's schema definition is clear and easy for LLMs to understand and modify
- **Familiar Ecosystem**: Stays within the Node.js ecosystem while using modern tooling
- **Seamless Client-Server**: tRPC provides type-safe API calls without manual type definitions
- **Integrated Auth**: NextAuth seamlessly integrates with tRPC context for protected procedures

### Trade-offs:
- **Learning Curve**: Team needs to understand the integrated stack rather than individual technologies
- **Flexibility**: Some architectural decisions are pre-made by the T3 stack, but components can be easily swapped out

### Risks:
- **Complexity**: While simpler than a custom setup, still requires understanding multiple integrated technologies
- **Server vs Client segregation**: Server components while useful makes it easy to mix client and server code in ways that could impact performance and security if not carefully managed - sensitive data or operations could accidentally be exposed to the client
- **Testing Complexity**: Transactional testing with tRPC requires understanding the testing helper patterns