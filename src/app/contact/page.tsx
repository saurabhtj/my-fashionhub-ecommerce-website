'use client';

import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';

/* ── Real Oruma contact details ── */
const CONTACT_INFO = [
  {
    icon: '📍',
    title: 'Store Address',
    lines: ['Beach Road, Chentrappinni', 'Thrissur, Kerala – 680687'],
    action: { label: 'Get Directions', href: 'https://maps.google.com/?q=Oruma+Fashion+Hub+Chentrappinni+Thrissur+Kerala' },
    color: '#e53935',
    light: '#fff5f5',
  },
  {
    icon: '📞',
    title: 'Call Us',
    lines: ['+91 62357 77700', '+91 62350 77700'],
    action: { label: 'Call Now', href: 'tel:+916235777700' },
    color: '#1565c0',
    light: '#e8f0fb',
  },
  {
    icon: '💬',
    title: 'WhatsApp',
    lines: ['+91 62357 77700', 'Quick replies during store hours'],
    action: { label: 'Open WhatsApp', href: 'https://wa.me/916235777700' },
    color: '#2e7d32',
    light: '#e8f5e9',
  },
  {
    icon: '✉️',
    title: 'Email Us',
    lines: ['sales@orumaweddings.com', 'We reply within 24 hours'],
    action: { label: 'Send Email', href: 'mailto:sales@orumaweddings.com' },
    color: '#6a1b9a',
    light: '#f3e5f5',
  },
];

const HOURS = [
  { day: 'Monday',    time: '9:00 AM – 9:00 PM', open: true },
  { day: 'Tuesday',   time: '9:00 AM – 9:00 PM', open: true },
  { day: 'Wednesday', time: '9:00 AM – 9:00 PM', open: true },
  { day: 'Thursday',  time: '9:00 AM – 9:00 PM', open: true },
  { day: 'Friday',    time: '9:00 AM – 9:00 PM', open: true },
  { day: 'Saturday',  time: '9:00 AM – 9:00 PM', open: true },
  { day: 'Sunday',    time: '9:00 AM – 9:00 PM', open: true },
];

const FAQ = [
  {
    q: 'What types of clothing do you carry?',
    a: 'We carry men\'s formals, casuals and dhotis (Ground Floor), ladies sarees, kurtis, gowns and co-ord sets (First Floor), and kids\' partywear and ethnic wear (Second Floor).',
  },
  {
    q: 'Do you offer personalized styling assistance?',
    a: 'Yes! Our in-store staff offer personalized styling consultations to help you find the perfect outfit for any occasion — from weddings to daily wear.',
  },
  {
    q: 'Can I order products online?',
    a: 'You can browse and purchase through our Fashion Hub online store. For special requests or bulk orders, contact us via WhatsApp or email.',
  },
  {
    q: 'What is your return policy?',
    a: 'We accept returns and exchanges within 7 days of purchase with original receipt, provided the item is unused and in original condition.',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long' });
  const isOpen = true; // store is always open 9–9

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate submission (would wire to backend/email in production)
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    setSubmitted(true);
  };

  return (
    <PageLayout>
      <div className="bg-white">

        {/* ══ HERO ══ */}
        <section className="relative min-h-[380px] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1596702874230-a7a49ce98a26?w=1600&q=80"
              alt="Contact Oruma Fashion Hub"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,20,40,0.88) 0%, rgba(10,20,40,0.65) 60%, rgba(10,20,40,0.45) 100%)' }} />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20">
            <div className="max-w-2xl">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-amber-400 mb-4 border border-amber-400/40 px-3 py-1 rounded-full">
                Get In Touch
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-4">
                Contact
                <span className="block" style={{ color: '#f59e0b' }}>Oruma Fashion Hub</span>
              </h1>
              <p className="text-lg text-white/75 leading-relaxed max-w-xl">
                Visit us in Chentrappinni, reach us on WhatsApp, or send a message below.
                We're here 7 days a week, 9 AM to 9 PM.
              </p>
              {/* Live status badge */}
              <div className="mt-5 inline-flex items-center gap-2 bg-green-500/20 border border-green-400/40 text-green-300 text-sm font-semibold px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Store Open Today · 9:00 AM – 9:00 PM
              </div>
            </div>
          </div>
        </section>

        {/* ══ CONTACT CARDS ══ */}
        <section className="py-16 px-6 lg:px-12 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {CONTACT_INFO.map((info) => (
                <div key={info.title}
                  className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-1 transition-transform duration-200 group-hover:scale-110"
                    style={{ background: info.light }}>
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{info.title}</p>
                    {info.lines.map((line, i) => (
                      <p key={i} className={`font-${i === 0 ? 'bold text-gray-900' : 'medium text-gray-500 text-sm'}`}>{line}</p>
                    ))}
                  </div>
                  <a href={info.action.href}
                    target={info.action.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold transition-all duration-200 hover:gap-3"
                    style={{ color: info.color }}>
                    {info.action.label} →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CONTACT FORM + STORE INFO ══ */}
        <section className="py-20 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

              {/* ── Left: Form ── */}
              <div className="lg:col-span-3">
                <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-amber-600 mb-3">
                  Send a Message
                </span>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                  We'd love to hear from you
                </h2>
                <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                  Fill in the form and our team will get back to you within 24 hours. For instant help, use WhatsApp.
                </p>

                {submitted ? (
                  <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-10 text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="text-xl font-extrabold text-green-800 mb-2">Message Sent!</h3>
                    <p className="text-green-700 text-sm mb-6">
                      Thank you, <strong>{form.name}</strong>! We've received your message and will get back to you at <strong>{form.email}</strong> within 24 hours.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                        className="text-sm font-bold text-green-700 border border-green-300 px-5 py-2.5 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                        Send Another
                      </button>
                      <a href="https://wa.me/916235777700" target="_blank" rel="noopener noreferrer"
                        className="text-sm font-bold text-white bg-[#25d366] px-5 py-2.5 rounded-lg hover:bg-[#1ebe5c] transition-colors">
                        Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Full Name *</label>
                        <input id="contact-name" type="text" required placeholder="Your full name"
                          value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all" />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email Address *</label>
                        <input id="contact-email" type="email" required placeholder="you@example.com"
                          value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all" />
                      </div>
                    </div>

                    {/* Phone + Subject row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-phone" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Phone Number</label>
                        <input id="contact-phone" type="tel" placeholder="+91 XXXXX XXXXX"
                          value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all" />
                      </div>
                      <div>
                        <label htmlFor="contact-subject" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Subject *</label>
                        <select id="contact-subject" required
                          value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all bg-white">
                          <option value="">Select a topic…</option>
                          <option value="product-enquiry">Product Enquiry</option>
                          <option value="styling-visit">Book a Styling Visit</option>
                          <option value="bulk-order">Bulk / Wedding Order</option>
                          <option value="return-exchange">Return or Exchange</option>
                          <option value="online-order">Online Order Support</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Message *</label>
                      <textarea id="contact-message" rows={5} required
                        placeholder="Tell us how we can help you…"
                        value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all resize-none" />
                    </div>

                    <button type="submit" disabled={sending}
                      className="w-full flex items-center justify-center gap-2 font-bold text-sm px-6 py-4 rounded-xl transition-all duration-200 disabled:opacity-70 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000' }}>
                      {sending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* ── Right: Store Info ── */}
              <div className="lg:col-span-2 space-y-6">

                {/* Store Hours */}
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-extrabold text-gray-900 text-base mb-5 flex items-center gap-2">
                    🕐 Store Hours
                  </h3>
                  <div className="space-y-2.5">
                    {HOURS.map((h) => {
                      const isToday = today.toLowerCase() === h.day.toLowerCase();
                      return (
                        <div key={h.day}
                          className={`flex justify-between items-center py-2 px-3 rounded-lg text-sm transition-colors
                            ${isToday ? 'bg-amber-50 border border-amber-200' : 'hover:bg-white'}`}>
                          <span className={`font-${isToday ? 'extrabold text-amber-700' : 'medium text-gray-700'}`}>
                            {h.day} {isToday && <span className="text-xs ml-1">(Today)</span>}
                          </span>
                          <span className={`font-semibold ${isToday ? 'text-amber-600' : 'text-gray-600'}`}>{h.time}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Open all days including public holidays
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl border border-gray-100 p-6 bg-white">
                  <h3 className="font-extrabold text-gray-900 text-base mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <a href="https://wa.me/916235777700?text=Hello%20Oruma%20Fashion%20Hub!%20I%20want%20to%20know%20more%20about%20your%20collections."
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#e8fdf1] border border-[#b2f0cc] hover:bg-[#d4f7e2] transition-colors group">
                      <div className="w-10 h-10 bg-[#25d366] rounded-lg flex items-center justify-center text-white text-lg shrink-0">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Chat on WhatsApp</p>
                        <p className="text-xs text-gray-500">+91 62357 77700</p>
                      </div>
                    </a>

                    <a href="tel:+916235777700"
                      className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors">
                      <div className="w-10 h-10 bg-[#1565c0] rounded-lg flex items-center justify-center text-white text-lg shrink-0">📞</div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Call the Store</p>
                        <p className="text-xs text-gray-500">+91 62350 77700</p>
                      </div>
                    </a>

                    <a href="mailto:sales@orumaweddings.com"
                      className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-colors">
                      <div className="w-10 h-10 bg-[#6a1b9a] rounded-lg flex items-center justify-center text-white text-lg shrink-0">✉️</div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Email Us</p>
                        <p className="text-xs text-gray-500">sales@orumaweddings.com</p>
                      </div>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ══ MAP EMBED ══ */}
        <section className="px-6 lg:px-12 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md">
              <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex flex-wrap items-center gap-2">
                <span className="text-lg">📍</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">Oruma Fashion Hub</p>
                  <p className="text-xs text-gray-500">Beach Road, Chentrappinni, Thrissur, Kerala 680687</p>
                </div>
                <a href="https://maps.google.com/?q=Oruma+Fashion+Hub+Chentrappinni+Thrissur+Kerala"
                  target="_blank" rel="noopener noreferrer"
                  className="ml-auto text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  Open in Google Maps →
                </a>
              </div>
              <iframe
                title="Oruma Fashion Hub Location"
                width="100%"
                height="380"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Oruma+Fashion+Hub+Chentrappinni+Thrissur+Kerala&output=embed"
              />
            </div>
          </div>
        </section>

        {/* ══ FAQ ══ */}
        <section className="py-20 px-6 lg:px-12 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-amber-600 mb-3">FAQ</span>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-3">
              {FAQ.map((item, i) => (
                <div key={i}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden
                    ${openFaq === i ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white hover:border-amber-200'}`}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer gap-4">
                    <span className="text-sm font-bold text-gray-900">{item.q}</span>
                    <span className={`text-lg text-gray-400 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5">
                      <p className="text-sm text-gray-600 leading-relaxed border-t border-amber-200 pt-3">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
