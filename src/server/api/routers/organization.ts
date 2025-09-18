import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
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

      const orgUser = await ctx.db.organizationUser.findUnique({
        where: {
          userId_organizationId: {
            userId: ctx.session.user.id,
            organizationId: id,
          },
        },
      });

      if (orgUser?.role !== "ADMIN") {
        throw new Error("You must be an admin to update this organization.");
      }

      return ctx.db.organization.update({
        where: { id },
        data: { name },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const orgUser = await ctx.db.organizationUser.findUnique({
        where: {
          userId_organizationId: {
            userId: ctx.session.user.id,
            organizationId: id,
          },
        },
      });

      if (orgUser?.role !== "ADMIN") {
        throw new Error("You must be an admin to delete this organization.");
      }

      return ctx.db.organization.delete({
        where: { id },
      });
    }),
});
