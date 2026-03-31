import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { bookings } from '@/lib/db/schema';
import { z } from 'zod';
import { env, serverEnv } from '@/lib/env';
import Stripe from 'stripe';

const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY);

const schema = z.object({
  serviceId: z.number(),
  providerId: z.string().uuid(),
  bookingDate: z.string().datetime(),
  address: z.string().min(1),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  specialRequests: z.string().optional(),
  paymentMethod: z.enum(['stripe', 'bank_transfer', 'cash_on_delivery']),
  totalAmount: z.number().positive(),
});

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const {
    serviceId,
    providerId,
    bookingDate,
    address,
    locationLat,
    locationLng,
    specialRequests,
    paymentMethod,
    totalAmount,
  } = parsed.data;

  const commissionRate = 0.15;
  const commissionAmount = totalAmount * commissionRate;
  const providerEarnings = totalAmount - commissionAmount;

  const [newBooking] = await db
    .insert(bookings)
    .values({
      customerId: session.user.id,
      providerId,
      serviceId,
      bookingDate: new Date(bookingDate),
      address,
      locationLat: locationLat?.toString() ?? null,
      locationLng: locationLng?.toString() ?? null,
      specialRequests,
      totalAmount: totalAmount.toString(),
      commissionAmount: commissionAmount.toString(),
      providerEarnings: providerEarnings.toString(),
      paymentMethod,
      paymentStatus: paymentMethod === 'stripe' ? 'pending' : 'paid',
    })
    .returning();

  if (paymentMethod === 'stripe') {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `Servio Booking #${newBooking.id}` },
            unit_amount: Math.round(totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${env.NEXT_PUBLIC_APP_URL}/customer/bookings/${newBooking.id}?success=true`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/customer/bookings/${newBooking.id}?canceled=true`,
      metadata: { bookingId: newBooking.id.toString() },
    });

    return NextResponse.json({
      booking: newBooking,
      checkoutSessionId: checkoutSession.id,
    });
  }

  return NextResponse.json({ booking: newBooking });
}
