import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * 核心用戶表，支持認證流程
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 紫砂壺主表
 */
export const teapots = mysqlTable("teapots", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // 上傳者
  name: varchar("name", { length: 255 }).notNull(), // 壺名
  description: text("description"), // 描述
  
  // 泥料分類
  clayType: mysqlEnum("clayType", [
    "purple", // 紫泥
    "green", // 綠泥
    "vermilion", // 朱泥
    "duan", // 段泥
    "jiangpo" // 降坡泥
  ]).notNull(),
  claySubtype: varchar("claySubtype", { length: 100 }), // 子類別（如老紫泥、底槽清等）
  
  // 工藝類型
  craftType: mysqlEnum("craftType", [
    "full_handmade", // 全手工
    "semi_handmade", // 手半
    "slip_casting", // 點搪
    "wheel_thrown" // 車一刀
  ]),
  
  // 器型
  shapeType: varchar("shapeType", { length: 100 }), // 器型名稱（如西施、石瓢等）
  shapeMatchScore: int("shapeMatchScore"), // 器型匹配度分數（0-100）
  
  // AI識別狀態
  aiAnalyzed: boolean("aiAnalyzed").default(false),
  manualCorrected: boolean("manualCorrected").default(false), // 是否經過人工修正
  
  // 照片URLs（JSON數組）
  photos: json("photos").$type<{
    front?: string; // 正面
    back?: string; // 反面
    top?: string; // 俯視
    inside?: string; // 壺內
  }>().notNull(),
  
  // 審核狀態
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  
  // 是否公開
  isPublic: boolean("isPublic").default(true).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Teapot = typeof teapots.$inferSelect;
export type InsertTeapot = typeof teapots.$inferInsert;

/**
 * 經典紫砂壺作品表
 */
export const classicTeapots = mysqlTable("classicTeapots", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  artist: varchar("artist", { length: 255 }).notNull(), // 大師名稱
  dynasty: varchar("dynasty", { length: 100 }), // 朝代
  description: text("description"),
  
  clayType: mysqlEnum("clayType", [
    "purple", "green", "vermilion", "duan", "jiangpo"
  ]),
  shapeType: varchar("shapeType", { length: 100 }),
  
  // 照片和參考資料
  photos: json("photos").$type<string[]>().notNull(),
  referenceUrl: text("referenceUrl"), // 參考資料來源
  
  // 器型輪廓數據（用於AI比對）
  contourData: json("contourData").$type<number[][]>(), // 輪廓點陣列
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClassicTeapot = typeof classicTeapots.$inferSelect;
export type InsertClassicTeapot = typeof classicTeapots.$inferInsert;

/**
 * 當代作品與拍賣會數據表
 */
export const auctionTeapots = mysqlTable("auctionTeapots", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  artist: varchar("artist", { length: 255 }),
  auctionHouse: varchar("auctionHouse", { length: 255 }), // 拍賣行
  auctionDate: timestamp("auctionDate"), // 拍賣日期
  estimatedPrice: varchar("estimatedPrice", { length: 100 }), // 估價
  finalPrice: varchar("finalPrice", { length: 100 }), // 成交價
  
  description: text("description"),
  clayType: mysqlEnum("clayType", [
    "purple", "green", "vermilion", "duan", "jiangpo"
  ]),
  shapeType: varchar("shapeType", { length: 100 }),
  
  photos: json("photos").$type<string[]>().notNull(),
  sourceUrl: text("sourceUrl"), // 來源URL
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AuctionTeapot = typeof auctionTeapots.$inferSelect;
export type InsertAuctionTeapot = typeof auctionTeapots.$inferInsert;

/**
 * 用戶收藏表
 */
export const collections = mysqlTable("collections", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  teapotId: int("teapotId").notNull(),
  notes: text("notes"), // 收藏筆記
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Collection = typeof collections.$inferSelect;
export type InsertCollection = typeof collections.$inferInsert;

/**
 * 留言版表
 */
export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // 可為空（匿名留言）
  authorName: varchar("authorName", { length: 255 }), // 匿名用戶名稱
  teapotId: int("teapotId"), // 關聯的壺（可選）
  content: text("content").notNull(),
  photos: json("photos").$type<string[]>(), // 附帶的圖片
  
  // 審核狀態
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  reviewedBy: int("reviewedBy"), // 審核者ID
  reviewedAt: timestamp("reviewedAt"),
  reviewNote: text("reviewNote"), // 審核備註
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;
