import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: "user" | "admin" = "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

function createPublicContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("comment.create", () => {
  it("should create a comment with authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.comment.create({
      content: "這是一個測試留言",
    });

    expect(result).toEqual({ success: true });
  });

  it("should create an anonymous comment", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.comment.create({
      authorName: "匿名壺友",
      content: "匿名測試留言",
    });

    expect(result).toEqual({ success: true });
  });

  it("should create a comment with photos", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.comment.create({
      content: "帶圖片的留言",
      photos: [
        "https://example.com/photo1.jpg",
        "https://example.com/photo2.jpg",
      ],
    });

    expect(result).toEqual({ success: true });
  });

  it("should create a comment associated with a teapot", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.comment.create({
      teapotId: 1,
      content: "這把壺真漂亮！",
    });

    expect(result).toEqual({ success: true });
  });
});

describe("comment.review", () => {
  it("should allow admin to approve comment", async () => {
    const userCtx = createAuthContext("user");
    const adminCtx = createAuthContext("admin");
    const userCaller = appRouter.createCaller(userCtx);
    const adminCaller = appRouter.createCaller(adminCtx);

    // User creates a comment
    await userCaller.comment.create({
      content: "待審核留言",
    });

    // Get pending comments
    const pending = await adminCaller.comment.getPending();
    const comment = pending[0];

    if (comment) {
      // Admin approves it
      const result = await adminCaller.comment.review({
        id: comment.id,
        status: "approved",
      });

      expect(result).toEqual({ success: true });
    }
  });

  it("should allow admin to reject comment", async () => {
    const userCtx = createAuthContext("user");
    const adminCtx = createAuthContext("admin");
    const userCaller = appRouter.createCaller(userCtx);
    const adminCaller = appRouter.createCaller(adminCtx);

    // User creates a comment
    await userCaller.comment.create({
      content: "待拒絕留言",
    });

    // Get pending comments
    const pending = await adminCaller.comment.getPending();
    const comment = pending[0];

    if (comment) {
      // Admin rejects it
      const result = await adminCaller.comment.review({
        id: comment.id,
        status: "rejected",
        reviewNote: "內容不符合社區規範",
      });

      expect(result).toEqual({ success: true });
    }
  });

  it("should reject non-admin user from reviewing", async () => {
    const userCtx = createAuthContext("user");
    const caller = appRouter.createCaller(userCtx);

    await expect(
      caller.comment.review({
        id: 1,
        status: "approved",
      })
    ).rejects.toThrow();
  });
});

describe("comment.getApproved", () => {
  it("should return only approved comments", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const comments = await caller.comment.getApproved();

    expect(Array.isArray(comments)).toBe(true);
    // All returned comments should be approved
    comments.forEach((comment) => {
      expect(comment.status).toBe("approved");
    });
  });

  it("should return approved comments for specific teapot", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const comments = await caller.comment.getApproved(1);

    expect(Array.isArray(comments)).toBe(true);
    // All returned comments should be for teapot 1
    comments.forEach((comment) => {
      expect(comment.status).toBe("approved");
      if (comment.teapotId) {
        expect(comment.teapotId).toBe(1);
      }
    });
  });
});

describe("comment.getPending", () => {
  it("should allow admin to get pending comments", async () => {
    const adminCtx = createAuthContext("admin");
    const caller = appRouter.createCaller(adminCtx);

    const comments = await caller.comment.getPending();

    expect(Array.isArray(comments)).toBe(true);
    // All returned comments should be pending
    comments.forEach((comment) => {
      expect(comment.status).toBe("pending");
    });
  });

  it("should reject non-admin user from getting pending comments", async () => {
    const userCtx = createAuthContext("user");
    const caller = appRouter.createCaller(userCtx);

    await expect(caller.comment.getPending()).rejects.toThrow();
  });
});
