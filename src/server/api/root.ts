import { organizationRouter } from "~/server/api/routers/organization";
import { invitationRouter } from "~/server/api/routers/invitation";
import { categoryRouter } from "~/server/api/routers/category";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  organization: organizationRouter,
  invitation: invitationRouter,
  category: categoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.organization.list();
 *       ^? OrganizationUser[]
 */
export const createCaller = createCallerFactory(appRouter);
