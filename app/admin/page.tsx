import Link from 'next/link';

const stats = [
  { label: 'Нийт хэрэглэгч', value: '1,234', change: '+12%' },
  { label: 'Нийт мастер', value: '89', change: '+5%' },
  { label: 'Энэ сарын захиалга', value: '456', change: '+23%' },
  { label: 'Нийт орлого', value: '12.5M₮', change: '+18%' },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'Батбаяр Д.', service: 'Нүүр будалт', amount: '45,000₮', status: 'Дууссан' },
  { id: 'ORD-002', customer: 'Сүрэн О.', service: 'Гэр цэвэрлэгээ', amount: '60,000₮', status: 'Хүлээгдэж буй' },
  { id: 'ORD-003', customer: 'Энхжин Б.', service: 'Маникюр', amount: '35,000₮', status: 'Баталгаажсан' },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Админ самбар</h1>
            <p className="text-gray-600 mt-1">Servio платформын удирдлага</p>
          </div>
          <Link href="/dashboard" className="text-sm text-purple-600 hover:underline">Dashboard руу буцах</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white p-5 rounded-xl border">
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
              <p className="text-sm text-green-600 mt-1">{s.change} энэ сар</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border">
          <div className="p-5 border-b">
            <h2 className="font-semibold text-gray-900">Сүүлийн захиалгууд</h2>
          </div>
          <div className="divide-y">
            {recentOrders.map((o) => (
              <div key={o.id} className="p-5 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{o.customer}</p>
                  <p className="text-sm text-gray-500">{o.id} — {o.service}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{o.amount}</p>
                  <p className="text-sm text-gray-500">{o.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
