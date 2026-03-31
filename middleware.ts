import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { adminClient } from '@/lib/supabase/admin';
import { env } from '@/lib/env';

const ratelimit = new Ratelimit({
  redis: new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  }),
  limiter: Ratelimit.slidingWindow(
    env.RATE_LIMIT_MAX_REQUESTS,
    `${env.RATE_LIMIT_WINDOW_MS} ms`
  ),
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/api/') || pathname.startsWith('/admin')) {
    const ip =
      request.ip ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      '127.0.0.1';

    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('sb-access-token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const {
      data: { user },
    } = await adminClient.auth.getUser(token);

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { data: dbUser } = await adminClient
      .from('users')
      .select('user_type')
      .eq('id', user.id)
      .single();

    if (dbUser?.user_type !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
};
