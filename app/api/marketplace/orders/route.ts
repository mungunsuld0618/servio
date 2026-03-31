import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { productOrders, productOrderItems, products } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';
import Stripe from 'stripe';
import { env, serverEnv } from '@/lib/env';

const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { items } = await request.json();

  if (!items?.length)
    return NextResponse.json({ error: 'No items' }, { status: 400 });

  const productIds = items.map((i: any) => i.productId);
  const productList = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds));

  const totalAmount = items.reduce((sum: number, item: any) => {
    const product = productList.find((p: any) => p.id === item.productId);
    return sum + (product ? Number(product.price) * item.quantity : 0);
  }, 0);

  const [order] = await db
    .insert(productOrders)
    .values({
      userId: session.user.id,
      totalAmount: totalAmount.toString(),
      paymentStatus: 'pending',
      paymentMethod: 'stripe',
      status: 'pending',
    })
    .returning();

  for (const item of items) {
    const product = productList.find((p: any) => p.id === item.productId);
    if (product) {
      await db.insert(productOrderItems).values({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });
    }
  }

  const lineItems = items.map((item: any) => {
    const product = productList.find((p: any) => p.id === item.productId);
    return {
      price_data: {
        currency: 'usd',
        product_data: { name: product?.nameMn || 'Product' },
        unit_amount: Math.round(Number(product?.price) * 100),
      },
      quantity: item.quantity,
    };
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${env.NEXT_PUBLIC_APP_URL}/marketplace/orders/${order.id}?success=true`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/marketplace?canceled=true`,
    metadata: { orderId: order.id.toString() },
  });

  return NextResponse.json({
    orderId: order.id,
    checkoutSessionId: checkoutSession.id,
  });
}
