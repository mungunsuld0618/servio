import Link from 'next/link';

const categories = [
  { name: 'Гоо сайхан', icon: '💄', desc: 'Нүүр будалт, арьс арчилгаа' },
  { name: 'Маникюр', icon: '💅', desc: 'Хумс засах, гель лак' },
  { name: 'Үсчин', icon: '✂️', desc: 'Үс засалт, будалт' },
  { name: 'Цэвэрлэгээ', icon: '🧹', desc: 'Гэр, оффис цэвэрлэгээ' },
  { name: 'Тогооч', icon: '👨‍🍳', desc: 'Хоол хүргэлт, тогооч' },
  { name: 'Асрагч', icon: '👶', desc: 'Хүүхэд, ахмад асрах' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">Гэртээ мэргэжлийн<br /><span className="text-yellow-300">үйлчилгээ</span> аваарай</h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">Монголын хамгийн том үйлчилгээний платформ.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/dashboard" className="inline-flex items-center justify-center px-8 py-3 bg-white text-purple-700 font-semibold rounded-full hover:bg-yellow-300 transition-all shadow-lg">Үйлчилгээ захиалах</Link>
              <Link href="/dashboard" className="inline-flex items-center justify-center px-8 py-3 border-2 border-white/50 text-white font-semibold rounded-full hover:bg-white/10 transition-all">Мастер болох</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-gray-900">Бүх төрлийн үйлчилгээ</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link key={cat.name} href="/dashboard" className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 hover:-translate-y-1 transition-all">
              <span className="text-4xl mb-3">{cat.icon}</span>
              <span className="font-semibold text-gray-900 text-sm">{cat.name}</span>
              <span className="text-xs text-gray-500 mt-1 text-center">{cat.desc}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-gray-900">Хэрхэн ажилладаг вэ?</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center space-y-3"><div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">1</div><h3 className="font-semibold text-lg text-gray-900">Үйлчилгээ сонгох</h3><p className="text-gray-600">Хүссэн үйлчилгээгээ хайж олоорой</p></div>
            <div className="text-center space-y-3"><div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">2</div><h3 className="font-semibold text-lg text-gray-900">Мастер сонгох</h3><p className="text-gray-600">Үнэлгээ, зураг харж мастераа сонгоно</p></div>
            <div className="text-center space-y-3"><div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">3</div><h3 className="font-semibold text-lg text-gray-900">Захиалга өгөх</h3><p className="text-gray-600">Цаг товлож, гэртээ үйлчилгээ аваарай</p></div>
          </div>
        </div>
      </section>
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2026 Servio. Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </footer>
    </main>
  );
}
