import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: varchar("phone", { length: 15 }).notNull().unique(),
  name: text("name").notNull(),
  role: varchar("role", { length: 20 }).notNull(), // 'customer' or 'technician'
  walletBalance: decimal("wallet_balance", { precision: 10, scale: 2 }).notNull().default("0.00"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const technicians = pgTable("technicians", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  skills: text("skills").array().notNull(),
  experience: integer("experience").notNull(), // years
  location: text("location").notNull(), // city or PIN
  pinCode: varchar("pin_code", { length: 10 }),
  bio: text("bio"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalReviews: integer("total_reviews").notNull().default(0),
  email: text("email"),
  isAvailable: boolean("is_available").notNull().default(true),
  profileImage: text("profile_image"),
});

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  location: text("location").notNull(),
  pinCode: varchar("pin_code", { length: 10 }),
  status: varchar("status", { length: 20 }).notNull().default("open"), // 'open', 'assigned', 'completed', 'cancelled'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bids = pgTable("bids", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull().references(() => jobs.id),
  technicianId: varchar("technician_id").notNull().references(() => technicians.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  message: text("message"),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // 'pending', 'accepted', 'rejected'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type", { length: 20 }).notNull(), // 'recharge', 'chat_unlock', 'earning'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  relatedId: varchar("related_id"), // job/technician/customer id
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const chatUnlocks = pgTable("chat_unlocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().references(() => users.id),
  technicianId: varchar("technician_id").notNull().references(() => technicians.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  technicianId: varchar("technician_id").notNull().references(() => technicians.id),
  customerId: varchar("customer_id").notNull().references(() => users.id),
  jobId: varchar("job_id").references(() => jobs.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const otpCodes = pgTable("otp_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: varchar("phone", { length: 15 }).notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").notNull().default(false),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // 'tips', 'news', 'guides', 'stories'
  image: text("image"), // image URL
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  walletBalance: true,
  createdAt: true,
});

export const insertTechnicianSchema = createInsertSchema(technicians).omit({
  id: true,
  rating: true,
  totalReviews: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertBidSchema = createInsertSchema(bids).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type User = typeof users.$inferSelect;
export type InsertTechnician = z.infer<typeof insertTechnicianSchema>;
export type Technician = typeof technicians.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertBid = z.infer<typeof insertBidSchema>;
export type Bid = typeof bids.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
export type ChatUnlock = typeof chatUnlocks.$inferSelect;
export type OtpCode = typeof otpCodes.$inferSelect;

// Extended types with joins
export type TechnicianWithUser = Technician & { user: User };
export type JobWithCustomer = Job & { customer: User };
export type BidWithTechnician = Bid & { technician: TechnicianWithUser };

// Categories - 100+ labour categories
export const LABOUR_CATEGORIES = [
  // Construction & Civil Work
  { id: 'mason', name: 'Mason (Rajmistri)', icon: 'construction' },
  { id: 'carpenter', name: 'Carpenter', icon: 'hammer' },
  { id: 'electrician', name: 'Electrician', icon: 'zap' },
  { id: 'plumber', name: 'Plumber', icon: 'droplet' },
  { id: 'welder', name: 'Welder / Fabricator', icon: 'flame' },
  { id: 'tile-worker', name: 'Tile / Marble Worker', icon: 'square' },
  { id: 'painter', name: 'Painter / POP Technician', icon: 'paintbrush' },
  { id: 'bar-bender', name: 'Bar Bender / Steel Fixer', icon: 'wrench' },
  { id: 'scaffolder', name: 'Scaffolder', icon: 'layout-grid' },
  { id: 'machine-operator', name: 'Heavy Machinery Operator', icon: 'truck' },
  { id: 'construction-helper', name: 'Construction Helper', icon: 'hard-hat' },
  { id: 'site-cleaner', name: 'Site Cleaner', icon: 'broom' },
  
  // Household & Domestic
  { id: 'housemaid', name: 'Housemaid', icon: 'home' },
  { id: 'cook', name: 'Cook', icon: 'chef-hat' },
  { id: 'babysitter', name: 'Babysitter', icon: 'baby' },
  { id: 'elderly-care', name: 'Elderly Caretaker', icon: 'heart' },
  { id: 'driver', name: 'Driver', icon: 'car' },
  { id: 'gardener', name: 'Gardener / Mali', icon: 'flower' },
  { id: 'watchman', name: 'Watchman / Security', icon: 'shield' },
  
  // Technical Services
  { id: 'ac-tech', name: 'AC Technician', icon: 'wind' },
  { id: 'refrigerator-tech', name: 'Refrigerator Technician', icon: 'refrigerator' },
  { id: 'washing-machine-tech', name: 'Washing Machine Technician', icon: 'washing-machine' },
  { id: 'ev-tech', name: 'EV Technician', icon: 'car-front' },
  { id: 'solar-tech', name: 'Solar Panel Technician', icon: 'sun' },
  { id: 'cctv-tech', name: 'CCTV Technician', icon: 'camera' },
  { id: 'ro-tech', name: 'RO Technician', icon: 'filter' },
  { id: 'computer-tech', name: 'Computer Technician', icon: 'laptop' },
  
  // Industrial & Factory
  { id: 'factory-worker', name: 'Factory Worker', icon: 'factory' },
  { id: 'packaging-worker', name: 'Packaging Worker', icon: 'package' },
  { id: 'loader', name: 'Loader / Unloader', icon: 'package-open' },
  { id: 'warehouse-worker', name: 'Warehouse Worker', icon: 'warehouse' },
  { id: 'forklift-operator', name: 'Forklift Operator', icon: 'forklift' },
  
  // Agricultural
  { id: 'farm-labour', name: 'Farm Labour', icon: 'wheat' },
  { id: 'tractor-driver', name: 'Tractor Driver', icon: 'tractor' },
  { id: 'irrigation-worker', name: 'Irrigation Worker', icon: 'sprout' },
  
  // Event & Hospitality
  { id: 'waiter', name: 'Waiter / Server', icon: 'utensils' },
  { id: 'event-setup', name: 'Event Setup Labour', icon: 'party-popper' },
  { id: 'catering-worker', name: 'Catering Worker', icon: 'chef-hat' },
  
  // Retail & Commercial
  { id: 'store-helper', name: 'Store Helper', icon: 'shopping-bag' },
  { id: 'delivery-helper', name: 'Delivery Helper', icon: 'bike' },
  
  // Maintenance & Repair
  { id: 'house-repair', name: 'House Repair Worker', icon: 'tool' },
  { id: 'waterproofing', name: 'Waterproofing Worker', icon: 'droplets' },
  { id: 'pest-control', name: 'Pest Control Worker', icon: 'bug' },
] as const;
