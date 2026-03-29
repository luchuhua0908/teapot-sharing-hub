import { eq, desc, and, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  teapots, 
  InsertTeapot,
  classicTeapots,
  InsertClassicTeapot,
  auctionTeapots,
  InsertAuctionTeapot,
  collections,
  InsertCollection,
  comments,
  InsertComment
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ========== 用戶相關 ==========
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ========== 紫砂壺相關 ==========
export async function createTeapot(teapot: InsertTeapot) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(teapots).values(teapot);
  return result;
}

export async function getTeapotById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(teapots).where(eq(teapots.id, id)).limit(1);
  return result[0];
}

export async function getTeapotsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(teapots).where(eq(teapots.userId, userId)).orderBy(desc(teapots.createdAt));
}

export async function getPublicTeapots() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(teapots)
    .where(and(eq(teapots.isPublic, true), eq(teapots.status, "approved")))
    .orderBy(desc(teapots.createdAt));
}

export async function getPendingTeapots() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(teapots)
    .where(eq(teapots.status, "pending"))
    .orderBy(desc(teapots.createdAt));
}

export async function updateTeapot(id: number, data: Partial<InsertTeapot>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(teapots).set(data).where(eq(teapots.id, id));
}

// ========== 經典作品相關 ==========
export async function createClassicTeapot(teapot: InsertClassicTeapot) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(classicTeapots).values(teapot);
}

export async function getAllClassicTeapots() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(classicTeapots).orderBy(desc(classicTeapots.createdAt));
}

export async function getClassicTeapotById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(classicTeapots).where(eq(classicTeapots.id, id)).limit(1);
  return result[0];
}

// ========== 拍賣會作品相關 ==========
export async function createAuctionTeapot(teapot: InsertAuctionTeapot) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(auctionTeapots).values(teapot);
}

export async function getAllAuctionTeapots() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(auctionTeapots).orderBy(desc(auctionTeapots.auctionDate));
}

// ========== 收藏相關 ==========
export async function addToCollection(userId: number, teapotId: number, notes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(collections).values({ userId, teapotId, notes });
}

export async function getUserCollections(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(collections).where(eq(collections.userId, userId)).orderBy(desc(collections.createdAt));
}

export async function removeFromCollection(userId: number, teapotId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(collections).where(
    and(eq(collections.userId, userId), eq(collections.teapotId, teapotId))
  );
}

// ========== 留言相關 ==========
export async function createComment(comment: InsertComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(comments).values(comment);
}

export async function getApprovedComments(teapotId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(comments.status, "approved")];
  if (teapotId) {
    conditions.push(eq(comments.teapotId, teapotId));
  }
  
  return await db.select().from(comments)
    .where(and(...conditions))
    .orderBy(desc(comments.createdAt));
}

export async function getPendingComments() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(comments)
    .where(eq(comments.status, "pending"))
    .orderBy(desc(comments.createdAt));
}

export async function updateCommentStatus(
  id: number, 
  status: "approved" | "rejected", 
  reviewedBy: number,
  reviewNote?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(comments).set({
    status,
    reviewedBy,
    reviewedAt: new Date(),
    reviewNote
  }).where(eq(comments.id, id));
}
