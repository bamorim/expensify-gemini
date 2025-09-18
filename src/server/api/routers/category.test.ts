import { describe, it, expect, vi, beforeEach } from "vitest";
import { categoryRouter } from "./category";
import { organizationRouter } from "./organization";
import { db } from "~/server/db";
import { faker } from "@faker-js/faker";

// Mock the database to use the transactional testing wrapper
vi.mock("~/server/db");

// Mock the auth module
vi.mock("~/server/auth", () => ({
  auth: vi.fn(),
}));

describe("CategoryRouter", () => {
  let adminUser: Awaited<ReturnType<typeof db.user.create>>;
  let memberUser: Awaited<ReturnType<typeof db.user.create>>;
  let organization: Awaited<ReturnType<typeof db.organization.create>>;

  beforeEach(async () => {
    vi.clearAllMocks();

    adminUser = await db.user.create({
      data: {
        name: "Admin User",
        email: faker.internet.email(),
      },
    });

    memberUser = await db.user.create({
      data: {
        name: "Member User",
        email: faker.internet.email(),
      },
    });

    const adminSession = {
      user: adminUser,
      expires: "2030-12-31T23:59:59.999Z",
    };

    const orgCaller = organizationRouter.createCaller({
      db: db,
      session: adminSession,
      headers: new Headers(),
    });

    organization = await orgCaller.create({ name: "Test Organization" });

    await db.organizationUser.create({
      data: {
        organizationId: organization.id,
        userId: memberUser.id,
        role: "MEMBER",
      },
    });
  });

  describe("create", () => {
    it("should allow an admin to create a category", async () => {
      const adminSession = {
        user: adminUser,
        expires: "2030-12-31T23:59:59.999Z",
      };

      const caller = categoryRouter.createCaller({
        db: db,
        session: adminSession,
        headers: new Headers(),
      });

      const categoryName = "Travel";
      const result = await caller.create({
        name: categoryName,
        organizationId: organization.id,
      });

      expect(result.name).toEqual(categoryName);
      expect(result.organizationId).toEqual(organization.id);
    });

    it("should not allow a member to create a category", async () => {
      const memberSession = {
        user: memberUser,
        expires: "2030-12-31T23:59:59.999Z",
      };

      const caller = categoryRouter.createCaller({
        db: db,
        session: memberSession,
        headers: new Headers(),
      });

      await expect(
        caller.create({
          name: "Travel",
          organizationId: organization.id,
        }),
      ).rejects.toThrow();
    });
  });

  describe("list", () => {
    it("should allow a member to list categories", async () => {
      const adminSession = {
        user: adminUser,
        expires: "2030-12-31T23:59:59.999Z",
      };

      const adminCaller = categoryRouter.createCaller({
        db: db,
        session: adminSession,
        headers: new Headers(),
      });

      await adminCaller.create({
        name: "Travel",
        organizationId: organization.id,
      });
      await adminCaller.create({
        name: "Meals",
        organizationId: organization.id,
      });

      const memberSession = {
        user: memberUser,
        expires: "2030-12-31T23:59:59.999Z",
      };

      const memberCaller = categoryRouter.createCaller({
        db: db,
        session: memberSession,
        headers: new Headers(),
      });

      const categories = await memberCaller.list({
        organizationId: organization.id,
      });

      expect(categories).toHaveLength(2);
      expect(categories[0]?.name).toEqual("Travel");
      expect(categories[1]?.name).toEqual("Meals");
    });
  });

  describe("update", () => {
    let category: Awaited<ReturnType<typeof db.category.create>>;

    beforeEach(async () => {
      const adminSession = {
        user: adminUser,
        expires: "2030-12-31T23:59:59.999Z",
      };

      const caller = categoryRouter.createCaller({
        db: db,
        session: adminSession,
        headers: new Headers(),
      });

      category = await caller.create({
        name: "Old Name",
        organizationId: organization.id,
      });
    });

    it("should allow an admin to update a category", async () => {
      const adminSession = {
        user: adminUser,
        expires: "2030-12-31T23:59:59.999Z",
      };

      const caller = categoryRouter.createCaller({
        db: db,
        session: adminSession,
        headers: new Headers(),
      });

      const newName = "New Name";
      const result = await caller.update({
        id: category.id,
        name: newName,
        organizationId: organization.id,
      });

      expect(result.name).toEqual(newName);
    });

    it("should not allow a member to update a category", async () => {
      const memberSession = {
        user: memberUser,
        expires: "2030-12-31T23:59:59.999Z",
      };

      const caller = categoryRouter.createCaller({
        db: db,
        session: memberSession,
        headers: new Headers(),
      });

      await expect(
        caller.update({
          id: category.id,
          name: "New Name",
          organizationId: organization.id,
        }),
      ).rejects.toThrow();
    });
  });

  describe("delete", () => {
    let category: Awaited<ReturnType<typeof db.category.create>>;

    beforeEach(async () => {
      const adminSession = {
        user: adminUser,
        expires: "2030-12-31T23:59:59.999Z",
      };

      const caller = categoryRouter.createCaller({
        db: db,
        session: adminSession,
        headers: new Headers(),
      });

      category = await caller.create({
        name: "To Be Deleted",
        organizationId: organization.id,
      });
    });

    it("should allow an admin to delete a category", async () => {
      const adminSession = {
        user: adminUser,
        expires: "2030-12-31T23:59:59.999Z",
      };

      const caller = categoryRouter.createCaller({
        db: db,
        session: adminSession,
        headers: new Headers(),
      });

      await caller.delete({
        id: category.id,
        organizationId: organization.id,
      });

      const deletedCategory = await db.category.findUnique({
        where: { id: category.id },
      });
      expect(deletedCategory).toBeNull();
    });

    it("should not allow a member to delete a category", async () => {
      const memberSession = {
        user: memberUser,
        expires: "2030-12-31T23:59:59.999Z",
      };

      const caller = categoryRouter.createCaller({
        db: db,
        session: memberSession,
        headers: new Headers(),
      });

      await expect(
        caller.delete({
          id: category.id,
          organizationId: organization.id,
        }),
      ).rejects.toThrow();
    });
  });
});
