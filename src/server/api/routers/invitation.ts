import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";
import { sendInvitationEmail } from "~/server/email";
import { env } from "~/env";

export const invitationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        organizationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email, organizationId } = input;

      const orgUser = await ctx.db.organizationUser.findUnique({
        where: {
          userId_organizationId: {
            userId: ctx.session.user.id,
            organizationId,
          },
        },
      });

      if (orgUser?.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You must be an admin to send invitations.",
        });
      }

      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date();
      expires.setDate(expires.getDate() + 7); // 7 days from now

      const invitation = await ctx.db.invitation.create({
        data: {
          email,
          organizationId,
          token,
          expires,
        },
      });

      const invitationLink = `${env.NEXTAUTH_URL}/invitations/${token}`;
      await sendInvitationEmail({ email, invitationLink });

      return invitation;
    }),

  list: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { organizationId } = input;

      const orgUser = await ctx.db.organizationUser.findUnique({
        where: {
          userId_organizationId: {
            userId: ctx.session.user.id,
            organizationId,
          },
        },
      });

      if (orgUser?.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You must be an admin to view invitations.",
        });
      }

      return ctx.db.invitation.findMany({
        where: {
          organizationId,
        },
      });
    }),

  accept: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { token } = input;

      const invitation = await ctx.db.invitation.findUnique({
        where: { token },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not found.",
        });
      }

      if (invitation.expires < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invitation has expired.",
        });
      }

      if (invitation.email !== ctx.session.user.email) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This invitation is for a different email address.",
        });
      }

      return ctx.db.$transaction(async (tx) => {
        await tx.organizationUser.create({
          data: {
            organizationId: invitation.organizationId,
            userId: ctx.session.user.id,
            role: "MEMBER",
          },
        });

        await tx.invitation.delete({
          where: { id: invitation.id },
        });

        return tx.organization.findUnique({
            where: { id: invitation.organizationId },
        });
      });
    }),
});
