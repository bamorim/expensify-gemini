import { z } from "zod";
import { createTRPCRouter, protectedProcedure, requireAdmin, requireMembership } from "~/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      organizationId: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      await requireAdmin(ctx.session.user, input.organizationId);
      return ctx.db.category.create({
        data: {
          name: input.name,
          description: input.description,
          organizationId: input.organizationId,
        },
      });
    }),

  list: protectedProcedure
    .input(z.object({
      organizationId: z.string().min(1),
    }))
    .query(async ({ ctx, input }) => {
      await requireMembership(ctx.session.user, input.organizationId);
      return ctx.db.category.findMany({
        where: {
          organizationId: input.organizationId,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string().min(1),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      organizationId: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      await requireAdmin(ctx.session.user, input.organizationId);
      return ctx.db.category.update({
        where: {
          id: input.id,
          organizationId: input.organizationId, // Ensure category belongs to the organization
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({
      id: z.string().min(1),
      organizationId: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      await requireAdmin(ctx.session.user, input.organizationId);
      return ctx.db.category.delete({
        where: {
          id: input.id,
          organizationId: input.organizationId, // Ensure category belongs to the organization
        },
      });
    }),
});
