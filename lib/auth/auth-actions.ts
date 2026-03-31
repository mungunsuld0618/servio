"use server";

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { users, providerProfiles, customerProfiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const signUpSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(8),
  fullName: z.string().min(2),
  password: z.string().min(6),
  userType: z.enum(['customer', 'provider']),
});

export async function signUp(formData: FormData) {
  const supabase = createClient();

  const parsed = signUpSchema.safeParse({
    email: formData.get('email'),
    phone: formData.get('phone'),
    fullName: formData.get('fullName'),
    password: formData.get('password'),
    userType: formData.get('userType'),
  });

  if (!parsed.success) return { error: parsed.error.message };

  const { email, phone, fullName, password, userType } = parsed.data;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, user_type: userType },
    },
  });

  if (authError) return { error: authError.message };

  await db.insert(users).values({
    id: authData.user!.id,
    email,
    phone,
    fullName,
    userType,
    isVerified: false,
  });

  if (userType === 'provider') {
    await db.insert(providerProfiles).values({ id: authData.user!.id });
  } else {
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    await db.insert(customerProfiles).values({ id: authData.user!.id, referralCode });
  }

  revalidatePath('/');
  redirect('/verify-phone?phone=' + encodeURIComponent(phone));
}

export async function signIn(formData: FormData) {
  const supabase = createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  revalidatePath('/');
  redirect('/dashboard');
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath('/');
  redirect('/');
}
