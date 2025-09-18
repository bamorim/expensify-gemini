import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  requireAdmin,
  requireMembership,
} from "~/server/api/trpc";

export const organizationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        const organization = await tx.organization.create({
          data: {
            name: input.name,
          },
        });

        await tx.organizationUser.create({
          data: {
            organizationId: organization.id,
            userId: ctx.session.user.id,
            role: "ADMIN",
          },
        });

        return organization;
      });
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.organizationUser.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        organization: true,
      },
    });
  }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { id, name } = input;
      await requireAdmin(ctx.session.user, id);

      return ctx.db.organization.update({
        where: { id },
        data: { name },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      await requireAdmin(ctx.session.user, id);

      return ctx.db.organization.delete({
        where: { id },
      });
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { organization, role } = await requireMembership(ctx.session.user, input.id);
      return { organization, role };
    }),

  listMembers: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { organizationId } = input;
      await requireMembership(ctx.session.user, organizationId);

      return ctx.db.organizationUser.findMany({
        where: {
          organizationId: organizationId,
        },
        include: {
          user: true,
        },
      });
    }),
});
