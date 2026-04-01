'use client';

import Link from 'next/link';

const bookings = [
  { id: 'BK001', service: 'Нүүр будалт', provider: 'Сарнай М.', date: '2026-04-05', time: '14:00', status: 'confirmed', price: 45000 },
  { id: 'BK002', service: 'Гель маникюр', provider: 'Оюунаа Б.', date: '2026-04-03', time: '10:00', status: 'completed', price: 35000 },
  { id: 'BK003', service: 'Гэр цэвэрлэгээ', provider: 'CleanPro', date: '2026-04-01', time: '09:00', status: 'completed', price: 60000 },
];

const statusMap: Record<string, { label: string; color: string }> = {
  confirmed: { label: 'Баталгаажсан', color: 'bg-green-100 text-green-700' },
  pending: { label: 'Хүлээгдэж буй', color: 'bg-yellow-100 text-yellow-700' },
  completed: { label: 'Дууссан', color: 'bg-gray-100 text-gray-700' },
  cancelled: { label: 'Цуцалсан', color: 'bg-red-100 text-red-700' },
};

export default function BookingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Миний захиалгууд</h1>
            <p className="text-gray-600 mt-1">Бүх захиалгуудаа энд хянана</p>
          </div>
          <Link href="/marketplace" className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">+ Шинэ захиалга</Link>
        </div>
        {bookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border">
            <p className="text-gray-500 text-lg mb-4">Одоогоор захиалга байхгүй байна</p>
            <Link href="/marketplace" className="text-purple-600 font-medium hover:underline">Үйлчилгээ захиалах</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900">{b.service}</h3>
                    <p className="text-sm text-gray-600">Мастер: {b.provider}</p>
                    <p className="text-sm text-gray-500">{b.date} | {b.time}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusMap[b.status]?.color || ''}`}>{statusMap[b.status]?.label || b.status}</span>
                    <p className="text-lg font-bold text-purple-600">{b.price.toLocaleString()}₮</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
