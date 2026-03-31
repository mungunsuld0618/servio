import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { CustomerDashboard } from '@/components/dashboards/customer-dashboard';
import { ProviderDashboard } from '@/components/dashboards/provider-dashboard';
import { AdminDashboard } from '@/components/dashboards/admin-dashboard';

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    with: {
      providerProfile: true,
      customerProfile: true,
    },
  });

  if (!user) redirect('/register');

  if (user.userType === 'customer') return <CustomerDashboard user={user} />;
  if (user.userType === 'provider') return <ProviderDashboard user={user} />;
  if (user.userType === 'admin') return <AdminDashboard user={user} />;

  redirect('/login');
}
