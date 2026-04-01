import Link from 'next/link';

const services = [
  { id: 1, name: 'Нүүр будалт', category: 'Гоо сайхан', price: 45000, rating: 4.8, provider: 'Сарнай М.' },
  { id: 2, name: 'Гель маникюр', category: 'Маникюр', price: 35000, rating: 4.9, provider: 'Оюунаа Б.' },
  { id: 3, name: 'Үс засалт', category: 'Үсчин', price: 25000, rating: 4.7, provider: 'Болд Т.' },
  { id: 4, name: 'Гэр цэвэрлэгээ', category: 'Цэвэрлэгээ', price: 60000, rating: 4.6, provider: 'CleanPro' },
  { id: 5, name: 'Хоол бэлтгэл', category: 'Тогооч', price: 80000, rating: 4.9, provider: 'Ганаа Д.' },
  { id: 6, name: 'Хүүхэд асрах', category: 'Асрагч', price: 40000, rating: 4.5, provider: 'Цэцэг Н.' },
];

const categories = ['Бүгд', 'Гоо сайхан', 'Маникюр', 'Үсчин', 'Цэвэрлэгээ', 'Тогооч', 'Асрагч'];

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Маркетплейс</h1>
        <p className="text-gray-600 mb-8">Бүх төрлийн мэргэжлийн үйлчилгээ нэг дороос</p>
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button key={cat} className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-white border border-gray-200 text-gray-700 hover:bg-purple-50 hover:border-purple-300 transition-colors first:bg-purple-600 first:text-white first:border-purple-600">
              {cat}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                <span className="text-5xl">{"\u{1F48E}"}</span>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{s.name}</h3>
                    <p className="text-sm text-gray-500">{s.category}</p>
                  </div>
                  <span className="text-sm font-medium bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg">{"\u2B50"} {s.rating}</span>
                </div>
                <p className="text-sm text-gray-600">Мастер: {s.provider}</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-purple-600">{s.price.toLocaleString()}₮</span>
                  <Link href="/dashboard" className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">Захиалах</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
