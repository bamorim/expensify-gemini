import { describe, it, expect, vi, beforeEach } from "vitest";
import { postRouter } from "./post";
import { auth, signIn } from "~/server/auth";
import { db } from "~/server/db";
import { faker } from "@faker-js/faker";

// Mock the database to use the transactional testing wrapper
vi.mock("~/server/db");

// Mock the auth module
vi.mock("~/server/auth", () => ({
  auth: vi.fn(),
}));

const mockAuth = vi.mocked(auth);

describe("PostRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should create a post successfully", async () => {
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

      const caller = postRouter.createCaller({
        db: db,
        session: mockSession,
        headers: new Headers(),
      });

      const result = await caller.create({ name: "Test Post" });

      expect(result.name).toEqual("Test Post");

      const post = await db.post.findUnique({
        where: {
          id: result.id,
        },
      });

      expect(post).toBeDefined();
    });
  });
});
