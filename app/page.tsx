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
            {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white">
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32">
                                  <div className="text-center space-y-6">
                                              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                                                            Гэртээ мэргэжлийн
                                                            <br />
                                                            <span className="text-yellow-300">үйлчилгээ</span>span> авааарай
                                              </h1>h1>
                                              <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
                                                            Монголын хамгийн том үйлчилгээний платформ. Гоо сайхан, маникюр, үсчин, цэвэрлэгээ, тогооч — бүгдийг нэг дороос.
                                              </p>p>
                                              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                                            <Link
                                                                              href="/dashboard"
                                                                              className="inline-flex items-center justify-center px-8 py-3 bg-white text-purple-700 font-semibold rounded-full hover:bg-yellow-300 hover:text-purple-900 transition-all shadow-lg"
                                                                            >
                                                                            Үйлчилгээ захиалах
                                                            </Link>Link>
                                                            <Link
                                                                              href="/dashboard?role=provider"
                                                                              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white/50 text-white font-semibold rounded-full hover:bg-white/10 transition-all"
                                                                            >
                                                                            Мастер болох
                                                            </Link>Link>
                                              </div>div>
                                  </div>div>
                        </div>div>
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
                </section>section>
          
            {/* Categories */}
                <section className="max-w-6xl mx-auto px-4 py-16">
                        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-gray-900">
                                  Бүх төрлийн үйлчилгээ
                        </h2>h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                          {categories.map((cat) => (
                        <Link
                                        key={cat.name}
                                        href="/dashboard"
                                        className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 hover:-translate-y-1 transition-all"
                                      >
                                      <span className="text-4xl mb-3">{cat.icon}</span>span>
                                      <span className="font-semibold text-gray-900 text-sm">{cat.name}</span>span>
                                      <span className="text-xs text-gray-500 mt-1 text-center">{cat.desc}</span>span>
                        </Link>Link>
                      ))}
                        </div>div>
                </section>section>
          
            {/* How it works */}
                <section className="bg-gray-50 py-16">
                        <div className="max-w-6xl mx-auto px-4">
                                  <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-gray-900">
                                              Хэрхэн ажилладаг вэ?
                                  </h2>h2>
                                  <div className="grid sm:grid-cols-3 gap-8">
                                    {[
            { step: '1', title: 'Үйлчилгээ сонгох', desc: 'Хүссэн үйлчилгээгээ хайж олоорой' },
            { step: '2', title: 'Мастер сонгох', desc: 'Үнэлгээ, зураг харж мастераа сонгоно' },
            { step: '3', title: 'Захиалга өгөх', desc: 'Цаг товлож, гэртээ үйлчилгээ аваарай' },
                        ].map((item) => (
                                        <div key={item.step} className="text-center space-y-3">
                                                        <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                                                          {item.step}
                                                        </div>div>
                                                        <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>h3>
                                                        <p className="text-gray-600">{item.desc}</p>p>
                                        </div>div>
                                      ))}
                                  </div>div>
                        </div>div>
                </section>section>
          
            {/* CTA */}
                <section className="max-w-6xl mx-auto px-4 py-16 text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">
                                  Өнөөдөр эхлээрэй
                        </h2>h2>
                        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                                  Мянга мянган хэрэглэгчид Servio-г ашиглан гэртээ мэргэжлийн үйлчилгээ авч байна.
                        </p>p>
                        <Link
                                    href="/dashboard"
                                    className="inline-flex items-center px-8 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-all shadow-lg"
                                  >
                                  Үнэгүй бүртгүүлэх →
                        </Link>Link>
                </section>section>
          
            {/* Footer */}
                <footer className="border-t border-gray-200 py-8">
                        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
                                  <p>© 2026 Servio. Бүх эрх хуулиар хамгаалагдсан.</p>p>
                        </div>div>
                </footer>footer>
          </main>main>
        );
}</main>
