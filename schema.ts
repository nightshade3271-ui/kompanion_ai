import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
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
 * Memory system - stores different types of persistent memory for the AI companion
 * Inspired by the original backend's wide-table approach but modernized
 */
export const memories = mysqlTable("memories", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),

  // Memory columns - each represents a different type of persistent context
  core: text("core"), // Core identity and personality - who the user is
  notebook: text("notebook"), // Long-term notes and important information
  experience: text("experience"), // Shared history and experiences
  conversation: text("conversation"), // Recent conversation history
  contact: text("contact"), // People and relationships (formerly "lead")
  mentalHealth: text("mentalHealth"), // Emotional journey and mental health tracking

  // Token management
  tokenLimit: int("tokenLimit").default(8000).notNull(),
  currentTokens: int("currentTokens").default(0).notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Memory = typeof memories.$inferSelect;
export type InsertMemory = typeof memories.$inferInsert;

/**
 * User settings for API keys and preferences
 */
export const settings = mysqlTable("settings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),

  // OpenRouter configuration
  openRouterApiKey: text("openRouterApiKey"),
  selectedModel: varchar("selectedModel", { length: 255 }),
  customModel: varchar("customModel", { length: 255 }),

  // Email configuration (optional)
  smtpServer: varchar("smtpServer", { length: 255 }),
  smtpPort: int("smtpPort"),
  smtpUser: varchar("smtpUser", { length: 255 }),
  smtpPassword: text("smtpPassword"),
  imapServer: varchar("imapServer", { length: 255 }),
  imapPort: int("imapPort"),
  imapUser: varchar("imapUser", { length: 255 }),
  imapPassword: text("imapPassword"),

  // Calendar configuration (optional)
  calendarType: varchar("calendarType", { length: 50 }), // 'google', 'generic', etc.
  calendarApiKey: text("calendarApiKey"),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Settings = typeof settings.$inferSelect;
export type InsertSettings = typeof settings.$inferInsert;

/**
 * Chat messages - stores the conversation history
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  content: text("content").notNull(),
  model: varchar("model", { length: 255 }),
  tokensUsed: int("tokensUsed"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Files uploaded by users
 */
export const files = mysqlTable("files", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  url: text("url").notNull(),
  mimeType: varchar("mimeType", { length: 100 }),
  size: int("size"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type File = typeof files.$inferSelect;
export type InsertFile = typeof files.$inferInsert;
