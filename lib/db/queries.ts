import { db } from '@/lib/db';
import { and, count, desc, eq, ilike, sql } from 'drizzle-orm';
import {
  users,
  bookings,
  services,
  categories,
  complaints,
  providerProfiles,
  customerProfiles,
  products,
  productOrders,
} from './schema';

export const getAdminStats = async () => {
  const [totalBookings, totalUsers, totalProviders, totalRevenue, pendingComplaints] =
    await Promise.all([
      db.select({ count: count() }).from(bookings).where(sql`deleted_at IS NULL`),
      db.select({ count: count() }).from(users).where(sql`deleted_at IS NULL`),
      db
        .select({ count: count() })
        .from(users)
        .where(and(eq(users.userType, 'provider'), sql`deleted_at IS NULL`)),
      db
        .select({ sum: sql<number>`sum(total_amount)` })
        .from(bookings)
        .where(eq(bookings.paymentStatus, 'paid')),
      db
        .select({ count: count() })
        .from(complaints)
        .where(eq(complaints.status, 'pending')),
    ]);

  return {
    totalBookings: totalBookings[0]?.count ?? 0,
    totalUsers: totalUsers[0]?.count ?? 0,
    totalProviders: totalProviders[0]?.count ?? 0,
    totalRevenue: totalRevenue[0]?.sum ?? 0,
    pendingComplaints: pendingComplaints[0]?.count ?? 0,
  };
};

export const getAdminUsers = async (filters: {
  page: number;
  limit: number;
  search?: string;
  userType?: string;
}) => {
  const { page, limit, search, userType } = filters;
  const offset = (page - 1) * limit;
  const conditions = [sql`deleted_at IS NULL`];

  if (search) conditions.push(ilike(users.fullName, `%${search}%`));
  if (userType) conditions.push(eq(users.userType, userType));

  const data = await db
    .select()
    .from(users)
    .where(and(...conditions))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(users.createdAt));

  const total = await db
    .select({ count: count() })
    .from(users)
    .where(and(...conditions));

  return { data, total: total[0]?.count ?? 0, page, limit };
};

export const getAdminProviders = async (filters: {
  page: number;
  limit: number;
  search?: string;
  isVerified?: boolean;
}) => {
  const { page, limit, search, isVerified } = filters;
  const offset = (page - 1) * limit;
  const conditions = [sql`deleted_at IS NULL`, eq(users.userType, 'provider')];

  if (search) conditions.push(ilike(users.fullName, `%${search}%`));
  if (isVerified !== undefined) conditions.push(eq(users.isVerified, isVerified));

  const data = await db
    .select()
    .from(users)
    .where(and(...conditions))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(users.createdAt));

  const total = await db
    .select({ count: count() })
    .from(users)
    .where(and(...conditions));

  return { data, total: total[0]?.count ?? 0 };
};

export const getAdminBookings = async (filters: {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}) => {
  const { page, limit, status, search } = filters;
  const offset = (page - 1) * limit;
  const conditions = [sql`deleted_at IS NULL`];

  if (status) conditions.push(eq(bookings.status, status));
  if (search) {
    conditions.push(
      sql`(SELECT full_name FROM users WHERE id = bookings.customer_id) ILIKE ${`%${search}%`} OR
      (SELECT full_name FROM users WHERE id = bookings.provider_id) ILIKE ${`%${search}%`}`
    );
  }

  const data = await db
    .select({
      id: bookings.id,
      customerId: bookings.customerId,
      providerId: bookings.providerId,
      status: bookings.status,
      bookingDate: bookings.bookingDate,
      totalAmount: bookings.totalAmount,
      paymentStatus: bookings.paymentStatus,
      createdAt: bookings.createdAt,
      customer: sql<{ fullName: string }>`(SELECT row_to_json(users) FROM users WHERE id = bookings.customer_id)`,
      provider: sql<{ fullName: string }>`(SELECT row_to_json(users) FROM users WHERE id = bookings.provider_id)`,
    })
    .from(bookings)
    .where(and(...conditions))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(bookings.createdAt));

  const total = await db
    .select({ count: count() })
    .from(bookings)
    .where(and(...conditions));

  return { data, total: total[0]?.count ?? 0 };
};

export const getAdminServices = async (filters: {
  page: number;
  limit: number;
  search?: string;
  categoryId?: number;
}) => {
  const { page, limit, search, categoryId } = filters;
  const offset = (page - 1) * limit;
  const conditions = [sql`deleted_at IS NULL`];

  if (search) conditions.push(ilike(services.name, `%${search}%`));
  if (categoryId) conditions.push(eq(services.categoryId, categoryId));

  const data = await db
    .select({
      id: services.id,
      name: services.name,
      nameMn: services.nameMn,
      description: services.description,
      price: services.price,
      durationMinutes: services.durationMinutes,
      isActive: services.isActive,
      createdAt: services.createdAt,
      category: sql<{ id: number; nameMn: string }>`(SELECT row_to_json(categories) FROM categories WHERE id = services.category_id)`,
    })
    .from(services)
    .where(and(...conditions))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(services.createdAt));

  const total = await db
    .select({ count: count() })
    .from(services)
    .where(and(...conditions));

  return { data, total: total[0]?.count ?? 0 };
};

export const getAdminComplaints = async (filters: {
  page: number;
  limit: number;
  status?: string;
}) => {
  const { page, limit, status } = filters;
  const offset = (page - 1) * limit;
  const conditions = [sql`deleted_at IS NULL`];

  if (status) conditions.push(eq(complaints.status, status));

  const data = await db
    .select({
      id: complaints.id,
      subject: complaints.subject,
      description: complaints.description,
      status: complaints.status,
      createdAt: complaints.createdAt,
      reporter: sql<{ id: string; fullName: string }>`(SELECT row_to_json(users) FROM users WHERE id = complaints.reporter_id)`,
      reported: sql<{ id: string; fullName: string }>`(SELECT row_to_json(users) FROM users WHERE id = complaints.reported_id)`,
    })
    .from(complaints)
    .where(and(...conditions))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(complaints.createdAt));

  const total = await db
    .select({ count: count() })
    .from(complaints)
    .where(and(...conditions));

  return { data, total: total[0]?.count ?? 0 };
};

export const getAdminProducts = async (filters: {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  type?: string;
}) => {
  const { page, limit, search, category, type } = filters;
  const offset = (page - 1) * limit;
  const conditions = [sql`deleted_at IS NULL`];

  if (search) conditions.push(ilike(products.name, `%${search}%`));
  if (category) conditions.push(eq(products.category, category));
  if (type) conditions.push(eq(products.type, type));

  const data = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .limit(limit)
    .offset(offset)
    .orderBy(desc(products.createdAt));

  const total = await db
    .select({ count: count() })
    .from(products)
    .where(and(...conditions));

  return { data, total: total[0]?.count ?? 0 };
};

export const getMarketplaceProducts = async (filters: {
  category?: string;
  limit?: number;
  offset?: number;
}) => {
  const conditions = [sql`deleted_at IS NULL`, eq(products.isActive, true)];

  if (filters.category) conditions.push(eq(products.category, filters.category));

  const data = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .limit(filters.limit || 50)
    .offset(filters.offset || 0)
    .orderBy(desc(products.createdAt));

  return data;
};

export const getProductOrdersForUser = async (userId: string) => {
  return db
    .select()
    .from(productOrders)
    .where(eq(productOrders.userId, userId))
    .orderBy(desc(productOrders.createdAt));
};
