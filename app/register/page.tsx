'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, user_type: role } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-purple-600">Servio</h1>
          <p className="mt-2 text-gray-600">Шинэ бүртгэл үүсгэх</p>
        </div>
        <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl shadow-sm border space-y-5">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Нэр</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Таны нэр" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Имэйл</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="example@mail.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Нууц үг</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Төрөл</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="customer">Хэрэглэгч</option>
              <option value="provider">Мастер / Үйлчилгээ үзүүлэгч</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50">
            {loading ? 'Бүртгүүлж байна...' : 'Бүртгүүлэх'}
          </button>
          <p className="text-center text-sm text-gray-600">
            Бүртгэлтэй юу? <Link href="/login" className="text-purple-600 font-medium hover:underline">Нэвтрэх</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
