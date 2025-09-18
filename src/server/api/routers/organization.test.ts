import { describe, it, expect, vi, beforeEach } from "vitest";
import { organizationRouter } from "./organization";
import { db } from "~/server/db";
import { faker } from "@faker-js/faker";

// Mock the database to use the transactional testing wrapper
vi.mock("~/server/db");

// Mock the auth module
vi.mock("~/server/auth", () => ({
  auth: vi.fn(),
}));

describe("OrganizationRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should create an organization and assign the user as admin", async () => {
      const user = await db.user.create({
        data: {
          name: "Test User",
          email: faker.internet.email(),
        },
      });

      const mockSession = {
        user,
        expires: "2030-12-31T23:59:59.999Z",
      };

      const caller = organizationRouter.createCaller({
        db: db,
        session: mockSession,
        headers: new Headers(),
      });

      const orgName = "Test Organization";
      const result = await caller.create({ name: orgName });

      expect(result.name).toEqual(orgName);

      const orgUser = await db.organizationUser.findFirst({
        where: {
          organizationId: result.id,
          userId: user.id,
        },
      });

      expect(orgUser).toBeDefined();
      expect(orgUser?.role).toEqual("ADMIN");
    });
  });

  describe("list", () => {
    it("should return the organizations the user belongs to", async () => {
        const user = await db.user.create({
            data: {
              name: "Test User",
              email: faker.internet.email(),
            },
          });
    
          const mockSession = {
            user,
            expires: "2030-12-31T23:59:59.999Z",
          };
    
          const caller = organizationRouter.createCaller({
            db: db,
            session: mockSession,
            headers: new Headers(),
          });

      const org = await caller.create({ name: "Test Org" });

      const list = await caller.list();

      expect(list).toHaveLength(1);
      expect(list[0]?.organization.name).toEqual("Test Org");
    });
  });

  describe("update", () => {
    it("should update an organization's name if the user is an admin", async () => {
        const user = await db.user.create({
            data: {
              name: "Test User",
              email: faker.internet.email(),
            },
          });
    
          const mockSession = {
            user,
            expires: "2030-12-31T23:59:59.999Z",
          };
    
          const caller = organizationRouter.createCaller({
            db: db,
            session: mockSession,
            headers: new Headers(),
          });

      const org = await caller.create({ name: "Old Name" });

      const newName = "New Name";
      await caller.update({ id: org.id, name: newName });

      const updatedOrg = await db.organization.findUnique({ where: { id: org.id } });
      expect(updatedOrg?.name).toEqual(newName);
    });

    it("should throw an error if the user is not an admin", async () => {
        const user = await db.user.create({
            data: {
              name: "Test User",
              email: faker.internet.email(),
            },
          });
    
          const anotherUser = await db.user.create({
            data: {
              name: "Another User",
              email: faker.internet.email(),
            },
          });

          const mockSession = {
            user,
            expires: "2030-12-31T23:59:59.999Z",
          };
    
          const caller = organizationRouter.createCaller({
            db: db,
            session: mockSession,
            headers: new Headers(),
          });

      const org = await caller.create({ name: "Test Org" });

      const anotherUserSession = {
        user: anotherUser,
        expires: "2030-12-31T23:59:59.999Z",
      };

      const anotherCaller = organizationRouter.createCaller({
        db: db,
        session: anotherUserSession,
        headers: new Headers(),
      });

      await expect(
        anotherCaller.update({ id: org.id, name: "New Name" })
      ).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("should delete an organization if the user is an admin", async () => {
        const user = await db.user.create({
            data: {
              name: "Test User",
              email: faker.internet.email(),
            },
          });
    
          const mockSession = {
            user,
            expires: "2030-12-31T23:59:59.999Z",
          };
    
          const caller = organizationRouter.createCaller({
            db: db,
            session: mockSession,
            headers: new Headers(),
          });

      const org = await caller.create({ name: "Test Org" });

      await caller.delete({ id: org.id });

      const deletedOrg = await db.organization.findUnique({ where: { id: org.id } });
      expect(deletedOrg).toBeNull();
    });
  });
});
