import {
  pgTable,
  serial,
  text,
  timestamp,
  decimal,
  integer,
  boolean,
  jsonb,
  uuid,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// ==================== ENUMS ====================
export const userTypeEnum = pgEnum("user_type", ["customer", "provider", "admin"]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "accepted",
  "in_progress",
  "completed",
  "cancelled",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
  "bank_transfer",
  "cash_on_delivery",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "stripe",
  "bank_transfer",
  "cash_on_delivery",
]);

export const complaintStatusEnum = pgEnum("complaint_status", [
  "pending",
  "investigating",
  "resolved",
]);

export const messageTypeEnum = pgEnum("message_type", ["text", "image", "location"]);

// Product marketplace enums
export const productTypesEnum = pgEnum("product_type", ["single", "package"]);
export const productCategoryEnum = pgEnum("product_category", [
  "tool",
  "material",
  "consumable",
  "package",
]);

// ==================== USERS ====================
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").unique(),
    phone: text("phone").unique(),
    fullName: text("full_name"),
    avatarUrl: text("avatar_url"),
    userType: userTypeEnum("user_type").default("customer"),
    locationLat: decimal("location_lat", { precision: 10, scale: 8 }),
    locationLng: decimal("location_lng", { precision: 11, scale: 8 }),
    address: text("address"),
    ratingAvg: decimal("rating_avg", { precision: 3, scale: 2 }).default("0"),
    ratingCount: integer("rating_count").default(0),
    isVerified: boolean("is_verified").default(false),
    isOnline: boolean("is_online").default(false),
    lastSeen: timestamp("last_seen"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    locationIdx: index("location_idx").on(table.locationLat, table.locationLng),
    emailIdx: uniqueIndex("email_idx").on(table.email),
    onlineIdx: index("online_idx").on(table.isOnline, table.userType),
  })
);

// ==================== PROVIDER PROFILES ====================
export const providerProfiles = pgTable("provider_profiles", {
  id: uuid("id").primaryKey().references(() => users.id),
  experienceYears: integer("experience_years"),
  bio: text("bio"),
  skills: text("skills").array(),
  education: text("education").array(),
  certifications: jsonb("certifications"),
  toolsUsed: text("tools_used").array(),
  brands: text("brands").array(),
  bankAccount: text("bank_account"),
  bankName: text("bank_name"),
  accountHolder: text("account_holder"),
  isBackgroundChecked: boolean("is_background_checked").default(false),
  travelRadius: integer("travel_radius").default(10),
  gender: text("gender"),
  portfolio: jsonb("portfolio").default([]),
  availability: jsonb("availability").default({}),
  deletedAt: timestamp("deleted_at"),
});

// ==================== CUSTOMER PROFILES ====================
export const customerProfiles = pgTable("customer_profiles", {
  id: uuid("id").primaryKey().references(() => users.id),
  preferences: jsonb("preferences"),
  preferredProviders: uuid("preferred_providers").array(),
  isVip: boolean("is_vip").default(false),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default("0"),
  bookingCount: integer("booking_count").default(0),
  loyaltyPoints: integer("loyalty_points").default(0),
  referralCode: text("referral_code").unique(),
  referredBy: uuid("referred_by").references(() => users.id),
  deletedAt: timestamp("deleted_at"),
});

// ==================== CATEGORIES ====================
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name"),
  nameMn: text("name_mn"),
  icon: text("icon"),
  description: text("description"),
  parentId: integer("parent_id").references(() => categories.id),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).default("15"),
  isActive: boolean("is_active").default(true),
  orderIndex: integer("order_index").default(0),
  deletedAt: timestamp("deleted_at"),
});

// ==================== SERVICES ====================
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => categories.id),
  providerId: uuid("provider_id").references(() => users.id),
  name: text("name"),
  nameMn: text("name_mn"),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }),
  durationMinutes: integer("duration_minutes"),
  isActive: boolean("is_active").default(true),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// ==================== BOOKINGS ====================
export const bookings = pgTable(
  "bookings",
  {
    id: serial("id").primaryKey(),
    customerId: uuid("customer_id").references(() => users.id),
    providerId: uuid("provider_id").references(() => users.id),
    serviceId: integer("service_id").references(() => services.id),
    status: bookingStatusEnum("status").default("pending"),
    bookingDate: timestamp("booking_date"),
    locationLat: decimal("location_lat", { precision: 10, scale: 8 }),
    locationLng: decimal("location_lng", { precision: 11, scale: 8 }),
    address: text("address"),
    specialRequests: text("special_requests"),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
    commissionAmount: decimal("commission_amount", { precision: 10, scale: 2 }),
    providerEarnings: decimal("provider_earnings", { precision: 10, scale: 2 }),
    paymentStatus: paymentStatusEnum("payment_status").default("pending"),
    paymentMethod: paymentMethodEnum("payment_method"),
    paymentIntentId: text("payment_intent_id"),
    bankTransferReference: text("bank_transfer_reference"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    customerIdx: index("booking_customer_idx").on(table.customerId),
    providerIdx: index("booking_provider_idx").on(table.providerId),
    statusDateIdx: index("booking_status_date_idx").on(table.status, table.bookingDate),
    bookingDateIdx: index("booking_date_idx").on(table.bookingDate),
  })
);

// ==================== REVIEWS ====================
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id),
  reviewerId: uuid("reviewer_id").references(() => users.id),
  revieweeId: uuid("reviewee_id").references(() => users.id),
  rating: integer("rating"),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== NOTIFICATIONS ====================
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  title: text("title"),
  body: text("body"),
  type: text("type"),
  isRead: boolean("is_read").default(false),
  data: jsonb("data"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== MESSAGES ====================
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: uuid("sender_id").references(() => users.id),
  receiverId: uuid("receiver_id").references(() => users.id),
  bookingId: integer("booking_id").references(() => bookings.id),
  messageType: messageTypeEnum("message_type").default("text"),
  content: text("content"),
  metadata: jsonb("metadata"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== COURSES ====================
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => categories.id),
  title: text("title"),
  titleMn: text("title_mn"),
  description: text("description"),
  instructorId: uuid("instructor_id").references(() => users.id),
  price: decimal("price", { precision: 10, scale: 2 }).default("0"),
  thumbnailUrl: text("thumbnail_url"),
  videoUrl: text("video_url"),
  duration: integer("duration"),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== COMPLAINTS ====================
export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  reporterId: uuid("reporter_id").references(() => users.id),
  reportedId: uuid("reported_id").references(() => users.id),
  bookingId: integer("booking_id").references(() => bookings.id),
  subject: text("subject"),
  description: text("description"),
  status: complaintStatusEnum("status").default("pending"),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// ==================== LOYALTY TRANSACTIONS ====================
export const loyaltyTransactions = pgTable("loyalty_transactions", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  points: integer("points"),
  type: text("type"),
  description: text("description"),
  bookingId: integer("booking_id").references(() => bookings.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== REFERRAL REWARDS ====================
export const referralRewards = pgTable("referral_rewards", {
  id: serial("id").primaryKey(),
  referrerId: uuid("referrer_id").references(() => users.id),
  referredId: uuid("referred_id").references(() => users.id),
  bookingId: integer("booking_id").references(() => bookings.id),
  rewardAmount: decimal("reward_amount", { precision: 10, scale: 2 }),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== AUDIT LOGS ====================
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  action: text("action"),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  oldData: jsonb("old_data"),
  newData: jsonb("new_data"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== PRODUCTS (Marketplace) ====================
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name"),
  nameMn: text("name_mn"),
  description: text("description"),
  type: productTypesEnum("type").default("single"),
  category: productCategoryEnum("category"),
  price: decimal("price", { precision: 10, scale: 2 }),
  quantity: integer("quantity").default(0),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const productOrders = pgTable("product_orders", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  bookingId: integer("booking_id").references(() => bookings.id),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  paymentStatus: paymentStatusEnum("payment_status").default("pending"),
  paymentMethod: paymentMethodEnum("payment_method"),
  status: text("status").default("pending"),
  shippingAddress: text("shipping_address"),
  trackingNumber: text("tracking_number"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productOrderItems = pgTable("product_order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => productOrders.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").default(1),
  priceAtPurchase: decimal("price_at_purchase", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== RELATIONS ====================
export const usersRelations = relations(users, ({ one, many }) => ({
  providerProfile: one(providerProfiles, {
    fields: [users.id],
    references: [providerProfiles.id],
  }),
  customerProfile: one(customerProfiles, {
    fields: [users.id],
    references: [customerProfiles.id],
  }),
  bookingsAsCustomer: many(bookings, { relationName: "customer" }),
  bookingsAsProvider: many(bookings, { relationName: "provider" }),
  reviewsGiven: many(reviews, { relationName: "reviewer" }),
  reviewsReceived: many(reviews, { relationName: "reviewee" }),
  notifications: many(notifications),
  messagesSent: many(messages, { relationName: "sender" }),
  messagesReceived: many(messages, { relationName: "receiver" }),
  courses: many(courses, { relationName: "instructor" }),
  complaintsFiled: many(complaints, { relationName: "reporter" }),
  complaintsAgainst: many(complaints, { relationName: "reported" }),
  loyaltyTransactions: many(loyaltyTransactions),
  productOrders: many(productOrders),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  customer: one(users, {
    fields: [bookings.customerId],
    references: [users.id],
    relationName: "customer",
  }),
  provider: one(users, {
    fields: [bookings.providerId],
    references: [users.id],
    relationName: "provider",
  }),
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
  reviews: many(reviews),
  messages: many(messages),
  productOrders: many(productOrders),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receiver",
  }),
  booking: one(bookings, {
    fields: [messages.bookingId],
    references: [bookings.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(productOrderItems),
}));

export const productOrdersRelations = relations(productOrders, ({ one, many }) => ({
  user: one(users, { fields: [productOrders.userId], references: [users.id] }),
  booking: one(bookings, { fields: [productOrders.bookingId], references: [bookings.id] }),
  items: many(productOrderItems),
}));

export const productOrderItemsRelations = relations(productOrderItems, ({ one }) => ({
  order: one(productOrders, {
    fields: [productOrderItems.orderId],
    references: [productOrders.id],
  }),
  product: one(products, {
    fields: [productOrderItems.productId],
    references: [products.id],
  }),
}));
