'use client';

import PageLayout from '@/components/PageLayout';
import Link from 'next/link';

/* ── Real Oruma data ── */
const STATS = [
  { number: '3',    label: 'Dedicated Floors',  icon: '🏬', desc: 'Three full floors of fashion for every family member' },
  { number: '50+',  label: 'Partner Brands',    icon: '🤝', desc: 'Curated collections from top fashion labels' },
  { number: '10k+', label: 'Happy Customers',   icon: '❤️', desc: 'Families served across Thrissur & beyond' },
  { number: '7',    label: 'Days Open',          icon: '📅', desc: '9 AM – 9 PM every day, including holidays' },
];

const FLOORS = [
  {
    floor: 'Ground Floor',
    title: 'Menswear',
    desc: 'Dhotis, formal wear, casuals & T-shirts. From crisp office formals to comfortable everyday casuals, our ground floor is dedicated to the modern Indian man.',
    tag: 'Men',
    color: '#1a3c5e',
    light: '#e8f0f9',
    emoji: '👔',
  },
  {
    floor: 'First Floor',
    title: 'Ladieswear & Sarees',
    desc: 'Authentic Kanchipuram silks, traditional Kasavu drapes, elegant gowns, kurtis, co-ord sets and more — a world of feminine elegance for every occasion.',
    tag: 'Women',
    color: '#7b1f4b',
    light: '#fce8f3',
    emoji: '👗',
  },
  {
    floor: 'Second Floor',
    title: 'Kidswear',
    desc: 'Vibrant partywear for children alongside elegant Pardhas and Kurtis. Bright, durable and stylish outfits that kids love and parents trust.',
    tag: 'Kids',
    color: '#1a6640',
    light: '#e8f7ee',
    emoji: '👧',
  },
];

const VALUES = [
  { icon: '✨', title: 'Quality First',       desc: 'Every garment is handpicked for fabric quality, craftsmanship and lasting durability.' },
  { icon: '🎉', title: 'Celebration Ready',   desc: 'From weddings to festivals, our collections are curated for India\'s most cherished moments.' },
  { icon: '🤗', title: 'Personal Assistance', desc: 'Our trained staff offer personalized styling advice to help you find the perfect outfit.' },
  { icon: '🏡', title: 'Community Roots',     desc: 'A proud Chentrappinni brand that has grown alongside the families of Thrissur for years.' },
];

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="bg-white">

        {/* ══ HERO SECTION ══ */}
        <section className="relative min-h-[480px] flex items-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80"
              alt="Oruma Fashion Hub Store"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,20,40,0.85) 0%, rgba(10,20,40,0.6) 60%, rgba(10,20,40,0.4) 100%)' }} />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20">
            <div className="max-w-2xl">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-amber-400 mb-4 border border-amber-400/40 px-3 py-1 rounded-full">
                Our Story
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
                About
                <span className="block" style={{ color: '#f59e0b' }}>Oruma Fashion Hub</span>
              </h1>
              <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
                Your fashion destination in Chentrappinni, Kerala — where style meets tradition,
                and every visit is a celebration.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/shop"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm px-6 py-3 rounded-lg transition-all hover:shadow-lg hover:-translate-y-0.5 duration-200">
                  Explore Collections
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
                <Link href="/contact"
                  className="inline-flex items-center gap-2 border border-white/50 text-white hover:bg-white/10 font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-200">
                  Visit Our Store
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══ STATS BANNER ══ */}
        <section style={{ background: 'linear-gradient(135deg, #0f1e3a 0%, #1a3c6e 100%)' }} className="py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center group">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-extrabold text-amber-400 mb-1">{stat.number}</div>
                  <div className="text-sm font-bold text-white mb-1">{stat.label}</div>
                  <div className="text-xs text-white/50 leading-snug hidden md:block">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ ABOUT STORY ══ */}
        <section className="py-20 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

              {/* Text */}
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-amber-600 mb-4">
                  Who We Are
                </span>
                <h2 className="text-4xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
                  Fashion for Every Family,<br />
                  <span className="text-amber-500">Style for Every Occasion</span>
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Welcome to <strong className="text-gray-900">Oruma Fashion Hub</strong>, your fashion destination in Chentrappinni, Kerala.
                    Located on Chentrappinni Beach Road, we bring together stylish fashion collections and carefully selected
                    outfits for weddings, celebrations, special occasions, and everyday wear.
                  </p>
                  <p>
                    At Oruma, we believe fashion is a way to express your personality and make every moment memorable.
                    Whether you are preparing for a wedding, choosing an outfit for a celebration, or refreshing your wardrobe,
                    we aim to help you find styles that suit your taste and occasion.
                  </p>
                  <p>
                    We welcome customers from Chentrappinni and nearby areas to explore our three floors of curated
                    collections and enjoy a warm, friendly, personalized shopping experience.
                  </p>
                </div>
                <div className="mt-8 p-4 border-l-4 border-amber-400 bg-amber-50 rounded-r-lg">
                  <p className="text-gray-700 font-semibold italic">
                    "Oruma Fashion Hub — Your Style, Your Celebration."
                  </p>
                </div>
              </div>

              {/* Image collage */}
              <div className="relative h-[300px] sm:h-[400px] lg:h-[480px] max-w-xl mx-auto w-full lg:max-w-none">
                <img
                  src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80"
                  alt="Fashion collection"
                  className="absolute top-0 left-0 w-[65%] h-[65%] object-cover rounded-2xl shadow-xl"
                />
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80"
                  alt="Traditional sarees"
                  className="absolute bottom-0 right-0 w-[60%] h-[60%] object-cover rounded-2xl shadow-xl border-4 border-white"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full flex items-center justify-center text-center shadow-2xl border-4 border-white z-10"
                  style={{ background: 'linear-gradient(135deg, #0f1e3a, #1a3c6e)' }}>
                  <div>
                    <div className="text-amber-400 font-extrabold text-xl leading-none">3</div>
                    <div className="text-white text-[10px] font-bold uppercase tracking-wide leading-tight">Floors of<br/>Fashion</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ THREE FLOORS ══ */}
        <section className="py-20 px-6 lg:px-12 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-amber-600 mb-3">
                Explore Our Space
              </span>
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Three Floors of <span className="text-amber-500">Kerala Fashion</span>
              </h2>
              <p className="text-gray-500 mt-3 text-base max-w-xl mx-auto">
                Every floor is designed to offer a dedicated, immersive shopping experience for each member of your family.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FLOORS.map((floor) => (
                <div key={floor.floor}
                  className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                  {/* Header */}
                  <div className="px-6 pt-8 pb-6" style={{ background: floor.light }}>
                    <div className="text-4xl mb-3">{floor.emoji}</div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: floor.color }}>{floor.floor}</div>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-0">{floor.title}</h3>
                  </div>
                  {/* Body */}
                  <div className="px-6 py-5">
                    <p className="text-sm text-gray-600 leading-relaxed">{floor.desc}</p>
                    <Link href={`/shop?q=${floor.tag}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold transition-all duration-200 group-hover:gap-3"
                      style={{ color: floor.color }}>
                      Shop {floor.tag} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ VALUES ══ */}
        <section className="py-20 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-amber-600 mb-3">
                Why Choose Us
              </span>
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Our Commitment to <span className="text-amber-500">Excellence</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((v) => (
                <div key={v.title}
                  className="p-6 rounded-2xl border border-gray-100 bg-white hover:border-amber-200 hover:shadow-lg transition-all duration-300 group text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">{v.icon}</div>
                  <h4 className="font-extrabold text-gray-900 text-base mb-2">{v.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ LOCATION STRIP ══ */}
        <section className="py-16 px-6 lg:px-12" style={{ background: 'linear-gradient(135deg, #0f1e3a 0%, #1a3c6e 100%)' }}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-4xl mb-4">📍</div>
            <h2 className="text-3xl font-extrabold text-white mb-3">Visit Us in Chentrappinni</h2>
            <p className="text-white/70 text-base mb-2">Beach Road, Chentrappinni, Thrissur, Kerala 680687</p>
            <p className="text-white/70 text-sm mb-8">Open 7 Days a Week &nbsp;·&nbsp; 9:00 AM – 9:00 PM</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://wa.me/916235777700" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25d366] hover:bg-[#1ebe5c] text-white font-bold text-sm px-6 py-3 rounded-lg transition-all hover:shadow-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp Us
              </a>
              <Link href="/contact"
                className="inline-flex items-center gap-2 border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black font-bold text-sm px-6 py-3 rounded-lg transition-all duration-200">
                Contact Page →
              </Link>
            </div>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
