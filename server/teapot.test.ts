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

describe("teapot.analyzeClay", () => {
  it("should analyze clay type from image URL", { timeout: 30000 }, async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.teapot.analyzeClay({
      photoUrl: "https://example.com/teapot.jpg",
    });

    expect(result).toHaveProperty("clayType");
    expect(result).toHaveProperty("claySubtype");
    expect(result).toHaveProperty("confidence");
    expect(["purple", "green", "vermilion", "duan", "jiangpo"]).toContain(result.clayType);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(100);
  });
});

describe("teapot.analyzeCraft", () => {
  it("should analyze craft type from image URL", { timeout: 30000 }, async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.teapot.analyzeCraft({
      insidePhotoUrl: "https://example.com/teapot-inner.jpg",
    });

    expect(result).toHaveProperty("craftType");
    expect(result).toHaveProperty("confidence");
    expect(["full_handmade", "semi_handmade", "slip_casting", "wheel_thrown"]).toContain(result.craftType);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(100);
  });
});

describe("teapot.analyzeShape", () => {
  it("should analyze shape type from image URL", { timeout: 30000 }, async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.teapot.analyzeShape({
      frontPhotoUrl: "https://example.com/teapot-front.jpg",
    });

    expect(result).toHaveProperty("shapeType");
    expect(result).toHaveProperty("matchScore");
    expect(result.shapeType).toBeTruthy();
    expect(result.matchScore).toBeGreaterThanOrEqual(0);
    expect(result.matchScore).toBeLessThanOrEqual(100);
  });
});

describe("teapot.create", () => {
  it("should create a new teapot with required fields", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.teapot.create({
      name: "測試紫砂壺",
      clayType: "purple",
      photos: {
        front: "https://example.com/front.jpg",
        back: "https://example.com/back.jpg",
        top: "https://example.com/top.jpg",
      },
    });

    expect(result).toEqual({ success: true });
  });

  it("should create a teapot with optional fields", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.teapot.create({
      name: "完整信息測試壺",
      description: "這是一把測試用的紫砂壺",
      clayType: "vermilion",
      claySubtype: "大紅袍",
      photos: {
        front: "https://example.com/front.jpg",
        back: "https://example.com/back.jpg",
        top: "https://example.com/top.jpg",
        inside: "https://example.com/inside.jpg",
      },
    });

    expect(result).toEqual({ success: true });
  });
});

describe("teapot.update", () => {
  it("should allow user to update their own teapot", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First create a teapot
    await caller.teapot.create({
      name: "待更新壺",
      clayType: "purple",
      photos: {
        front: "https://example.com/front.jpg",
        back: "https://example.com/back.jpg",
        top: "https://example.com/top.jpg",
      },
    });

    // Get the created teapot
    const teapots = await caller.teapot.getMyTeapots();
    const teapot = teapots[0];

    if (teapot) {
      // Update it
      const result = await caller.teapot.update({
        id: teapot.id,
        claySubtype: "底槽清",
        manualCorrected: true,
      });

      expect(result).toEqual({ success: true });
    }
  });
});

describe("teapot.approve", () => {
  it("should allow admin to approve teapot", async () => {
    const userCtx = createAuthContext("user");
    const adminCtx = createAuthContext("admin");
    const userCaller = appRouter.createCaller(userCtx);
    const adminCaller = appRouter.createCaller(adminCtx);

    // User creates a teapot
    await userCaller.teapot.create({
      name: "待審核壺",
      clayType: "purple",
      photos: {
        front: "https://example.com/front.jpg",
        back: "https://example.com/back.jpg",
        top: "https://example.com/top.jpg",
      },
    });

    // Get pending teapots
    const pending = await adminCaller.teapot.getPending();
    const teapot = pending[0];

    if (teapot) {
      // Admin approves it
      const result = await adminCaller.teapot.approve({
        id: teapot.id,
        status: "approved",
      });

      expect(result).toEqual({ success: true });
    }
  });

  it("should reject non-admin user from approving", async () => {
    const userCtx = createAuthContext("user");
    const caller = appRouter.createCaller(userCtx);

    await expect(
      caller.teapot.approve({
        id: 1,
        status: "approved",
      })
    ).rejects.toThrow();
  });
});

describe("teapot.getPublic", () => {
  it("should return approved public teapots", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const teapots = await caller.teapot.getPublic();

    expect(Array.isArray(teapots)).toBe(true);
  });
});
