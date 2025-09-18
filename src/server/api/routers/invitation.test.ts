import { describe, it, expect, vi, beforeEach } from "vitest";
import { invitationRouter } from "./invitation";
import { db } from "~/server/db";
import { faker } from "@faker-js/faker";
import { sendInvitationEmail } from "~/server/email";

// Mock the database to use the transactional testing wrapper
vi.mock("~/server/db");

// Mock the auth module
vi.mock("~/server/auth", () => ({
  auth: vi.fn(),
}));

// Mock the email module
vi.mock("~/server/email", () => ({
  sendInvitationEmail: vi.fn(),
}));

describe("InvitationRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should create an invitation and send an email", async () => {
      const user = await db.user.create({
        data: {
          name: "Test User",
          email: faker.internet.email(),
        },
      });

      const organization = await db.organization.create({
        data: {
          name: "Test Organization",
        },
      });

      await db.organizationUser.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: "ADMIN",
        },
      });

      const mockSession = {
        user,
        expires: "2030-12-31T23:59:59.999Z",
      };

      const caller = invitationRouter.createCaller({
        db: db,
        session: mockSession,
        headers: new Headers(),
      });

      const email = faker.internet.email();
      const result = await caller.create({ email, organizationId: organization.id });

      expect(result.email).toEqual(email);
      expect(sendInvitationEmail).toHaveBeenCalledOnce();
    });
  });

  describe("list", () => {
    it("should return a list of pending invitations", async () => {
        const user = await db.user.create({
            data: {
              name: "Test User",
              email: faker.internet.email(),
            },
          });
    
          const organization = await db.organization.create({
            data: {
              name: "Test Organization",
            },
          });
    
          await db.organizationUser.create({
            data: {
              userId: user.id,
              organizationId: organization.id,
              role: "ADMIN",
            },
          });
    
          const mockSession = {
            user,
            expires: "2030-12-31T23:59:59.999Z",
          };
    
          const caller = invitationRouter.createCaller({
            db: db,
            session: mockSession,
            headers: new Headers(),
          });

      await caller.create({ email: faker.internet.email(), organizationId: organization.id });

      const list = await caller.list({ organizationId: organization.id });

      expect(list).toHaveLength(1);
    });
  });

  describe("accept", () => {
    it("should allow a user to accept a valid invitation", async () => {
        const user = await db.user.create({
            data: {
              name: "Test User",
              email: faker.internet.email(),
            },
          });
    
          const organization = await db.organization.create({
            data: {
              name: "Test Organization",
            },
          });
    
          const adminUser = await db.user.create({
            data: {
              name: "Admin User",
              email: faker.internet.email(),
            },
          });

          await db.organizationUser.create({
            data: {
              userId: adminUser.id,
              organizationId: organization.id,
              role: "ADMIN",
            },
          });

          const mockAdminSession = {
            user: adminUser,
            expires: "2030-12-31T23:59:59.999Z",
          };

          const adminCaller = invitationRouter.createCaller({
            db: db,
            session: mockAdminSession,
            headers: new Headers(),
          });

      const invitation = await adminCaller.create({ email: user.email, organizationId: organization.id });

      const mockUserSession = {
        user,
        expires: "2030-12-31T23:59:59.999Z",
      };

      const userCaller = invitationRouter.createCaller({
        db: db,
        session: mockUserSession,
        headers: new Headers(),
      });

      await userCaller.accept({ token: invitation.token });

      const orgUser = await db.organizationUser.findFirst({
        where: {
          userId: user.id,
          organizationId: organization.id,
        },
      });

      expect(orgUser).toBeDefined();
      expect(orgUser?.role).toEqual("MEMBER");
    });
  });
});
