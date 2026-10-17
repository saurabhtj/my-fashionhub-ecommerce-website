'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PageLayout from '@/components/PageLayout';
import { dispatchWishlistUpdated } from '@/lib/cartStorage';
import { isWishlistResponse, type WishlistItem } from '@/lib/wishlist';

/* ─────────────────────────────── types ─────────────────────────────── */
interface Profile { id: string; name: string | null; email: string | null; phone: string | null; image: string | null; role: string; }
interface Address {
  id: string;
  address: string;
  houseNumber: string | null;
  street: string | null;
  area: string | null;
  landmark: string | null;
  city: string;
  state: string | null;
  pincode: string;
  country: string;
  addressType: string;
  createdAt: string;
}
interface OrderItem { id: string; productName: string; quantity: number; unitPrice: number; }
interface Order {
  id: string;
  razorpayOrderId: string | null;
  amount: number;
  subtotal: number;
  shippingFee: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  deliveryStatus: string;
  expectedDelivery: string | null;
  trackingNumber: string | null;
  shippingAddress: { houseNumber: string; street: string; area: string; landmark: string; city: string; state: string; pincode: string; country: string; addressType: string } | null;
  items: OrderItem[];
  createdAt: string;
  paymentId?: string | null;
}
type Section = 'overview' | 'orders' | 'addresses' | 'wishlist' | 'security';

/* ─────────────────────────────── helpers ─────────────────────────────── */
const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  PROCESSING: { label: 'Processing', color: '#f57c00', bg: '#fff3e0' },
  PACKED: { label: 'Packed', color: '#1565c0', bg: '#e3f2fd' },
  SHIPPED: { label: 'Shipped', color: '#1565c0', bg: '#e3f2fd' },
  OUT_FOR_DELIVERY: { label: 'Out for delivery', color: '#6a1b9a', bg: '#f3e5f5' },
  DELIVERED: { label: 'Delivered', color: '#388e3c', bg: '#e8f5e9' },
  CREATED: { label: 'Awaiting payment', color: '#f57c00', bg: '#fff3e0' },
  AWAITING_PAYMENT: { label: 'Awaiting payment', color: '#f57c00', bg: '#fff3e0' },
  CONFIRMED: { label: 'Order confirmed', color: '#1565c0', bg: '#e3f2fd' },
  PAID: { label: 'Processing', color: '#f57c00', bg: '#fff3e0' },
  FAILED: { label: 'Payment failed', color: '#c62828', bg: '#ffebee' },
};

const createEmptyAddressForm = () => ({
  houseNumber: '', street: '', area: '', landmark: '', city: '', state: '',
  pincode: '', country: 'India', addressType: 'HOME',
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function avatarLetters(name?: string | null, email?: string | null) {
  if (name) return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  if (email) return email[0].toUpperCase();
  return 'U';
}

/* ══════════════════════════════ PAGE ══════════════════════════════ */
export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();

  const [active, setActive] = useState<Section>('overview');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders]   = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [wishlistError, setWishlistError] = useState('');

  /* edit profile */
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  /* password change */
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });

  /* address */
  const [addrForm, setAddrForm] = useState(createEmptyAddressForm);
  const [addrMsg, setAddrMsg] = useState('');
  const [addrAdding, setAddrAdding] = useState(false);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  /* redirect if not authenticated */
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/profile');
  }, [status, router]);

  /* fetch profile */
  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setForm({ name: data.name || '', phone: data.phone || '' });
      }
    } finally { setLoading(false); }
  }, []);

  /* fetch orders */
  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) setOrders(await res.json());
    } catch {}
  }, []);

  /* fetch addresses */
  const fetchAddresses = useCallback(async () => {
    try {
      const res = await fetch('/api/user/addresses');
      if (res.ok) setAddresses(await res.json());
    } catch {}
  }, []);

  const fetchWishlist = useCallback(async () => {
    setWishlistLoading(true);
    setWishlistError('');
    try {
      const response = await fetch('/api/wishlist');
      if (!response.ok) throw new Error('Could not load your wishlist.');

      const data: unknown = await response.json();
      if (!isWishlistResponse(data)) {
        throw new Error('The wishlist response was invalid. Please refresh and try again.');
      }
      setWishlistItems(data);
    } catch (error) {
      console.error('Error fetching profile wishlist:', error);
      setWishlistError(error instanceof Error ? error.message : 'Could not load your wishlist.');
    } finally {
      setWishlistLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
      fetchOrders();
      fetchAddresses();
      void fetchWishlist();
    }
  }, [status, fetchProfile, fetchOrders, fetchAddresses, fetchWishlist]);

  const handleRemoveWishlistItem = async (productId: string) => {
    setWishlistError('');
    try {
      const response = await fetch(`/api/wishlist/${encodeURIComponent(productId)}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Could not remove this product from your wishlist.');
      setWishlistItems((items) => items.filter((item) => item.productId !== productId));
      dispatchWishlistUpdated();
    } catch (error) {
      console.error('Error removing profile wishlist item:', error);
      setWishlistError(error instanceof Error ? error.message : 'Could not update your wishlist.');
    }
  };

  /* save profile */
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setSaveMsg('');
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data); setEditMode(false);
        setSaveMsg('✓ Profile updated successfully');
        setTimeout(() => setSaveMsg(''), 3000);
      } else setSaveMsg('Failed to update profile. Try again.');
    } finally { setSaving(false); }
  };

  /* change password */
  const handleChangePw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) { setPwMsg('New passwords do not match.'); return; }
    if (pwForm.next.length < 8) { setPwMsg('Password must be at least 8 characters.'); return; }
    setPwSaving(true); setPwMsg('');
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwForm.current, newPassword: pwForm.next }),
      });
      const data = await res.json();
      if (res.ok) { setPwMsg('✓ Password changed successfully!'); setPwForm({ current: '', next: '', confirm: '' }); }
      else setPwMsg(data.error || 'Failed to change password.');
    } finally { setPwSaving(false); }
  };

  /* add address */
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddrAdding(true); setAddrMsg('');
    const isEditing = Boolean(editingAddressId);
    try {
      const url = editingAddressId ? `/api/user/addresses?id=${encodeURIComponent(editingAddressId)}` : '/api/user/addresses';
      const res = await fetch(url, {
        method: editingAddressId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addrForm),
      });
      if (res.ok) {
        const savedAddress = await res.json();
        setAddresses(prev => isEditing
          ? prev.map(address => address.id === savedAddress.id ? savedAddress : address)
          : [savedAddress, ...prev]);
        setEditingAddressId(null);
        setAddrForm(createEmptyAddressForm());
        setShowAddrForm(false);
        setAddrMsg(isEditing ? '✓ Address updated successfully' : '✓ Address added successfully');
        setTimeout(() => setAddrMsg(''), 3000);
      } else {
        const data = await res.json();
        setAddrMsg(data.error || (isEditing ? 'Failed to update address.' : 'Failed to add address.'));
      }
    } catch (error) {
      console.error('Save address error:', error);
      setAddrMsg('Could not save the address. Please try again.');
    } finally { setAddrAdding(false); }
  };

  /* delete address */
  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Remove this address?')) return;
    await fetch(`/api/user/addresses?id=${id}`, { method: 'DELETE' });
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  /* ─── loading / unauthenticated ─── */
  if (status === 'loading' || loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#f1f3f6]">
          <div className="w-10 h-10 border-3 border-[#2874f0] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-600 font-medium">Loading your account…</p>
        </div>
      </PageLayout>
    );
  }

  if (!profile) return null;

  const initials = avatarLetters(profile.name, profile.email);

  /* ─── nav items ─── */
  const NAV_ITEMS: { key: Section; icon: string; label: string; badge?: number }[] = [
    { key: 'overview',   icon: '👤', label: 'My Profile' },
    { key: 'orders',     icon: '📦', label: 'My Orders',   badge: orders.length },
    { key: 'addresses',  icon: '📍', label: 'My Addresses', badge: addresses.length },
    { key: 'wishlist',   icon: '❤️', label: 'My Wishlist', badge: wishlistItems.length },
    { key: 'security',   icon: '🔒', label: 'Security' },
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-[#f1f3f6]">

        {/* ── Top Header Banner ── */}
        <div style={{ background: 'linear-gradient(135deg, #2874f0 0%, #1a5dc8 60%, #0f3fa0 100%)' }} className="py-8 px-4 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-xl border-2 border-white/40"
                style={{ background: 'linear-gradient(135deg, #64b5f6 0%, #1565c0 100%)' }}>
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#4caf50] rounded-full border-2 border-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-0.5">Welcome back</p>
              <h1 className="break-words text-white text-2xl font-extrabold leading-tight tracking-tight">{profile.name || 'Valued Customer'}</h1>
              <p className="break-all text-blue-200 text-sm mt-0.5">{profile.email}</p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-center px-4">
                <p className="text-white font-bold text-lg">{orders.length}</p>
                <p className="text-blue-200 text-xs font-medium">Orders</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center px-4">
                <p className="text-white font-bold text-lg">{addresses.length}</p>
                <p className="text-blue-200 text-xs font-medium">Addresses</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center px-4">
                <p className="text-white font-bold text-lg">{wishlistItems.length}</p>
                <p className="text-blue-200 text-xs font-medium">Wishlist</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-5 items-start">

            {/* ────────── LEFT SIDEBAR ────────── */}
            <aside className="w-full lg:w-64 shrink-0">
              <div className="bg-white rounded-sm border border-gray-200 shadow-xs overflow-hidden">
                {/* User info card in sidebar */}
                <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, #42a5f5, #1565c0)' }}>
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium">Hello,</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{profile.name || 'User'}</p>
                  </div>
                </div>

                {/* Nav items */}
                <nav className="py-2">
                  {NAV_ITEMS.map(item => (
                    <button
                      key={item.key}
                      onClick={() => setActive(item.key)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all cursor-pointer text-left
                        ${active === item.key
                          ? 'bg-blue-50 text-[#2874f0] border-r-3 border-[#2874f0]'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-base w-5 text-center">{item.icon}</span>
                        {item.label}
                      </span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="text-xs font-bold text-white bg-[#2874f0] rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>

                {/* Divider + Quick Links */}
                <div className="border-t border-gray-100 py-2">
                  <Link href="/cart" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <span className="text-base w-5 text-center">🛒</span> My Cart
                  </Link>
                  <Link href="/shop" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <span className="text-base w-5 text-center">🏪</span> Shop Now
                  </Link>
                </div>

                {/* Sign out */}
                <div className="border-t border-gray-100 p-3">
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded text-sm font-semibold text-[#c62828] hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </aside>

            {/* ────────── MAIN CONTENT ────────── */}
            <main className="flex-1 min-w-0 space-y-4">

              {/* ══ OVERVIEW ══ */}
              {active === 'overview' && (
                <div className="bg-white rounded-sm border border-gray-200 shadow-xs overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900 text-base">Personal Information</h2>
                    {!editMode && (
                      <button onClick={() => setEditMode(true)}
                        className="text-[#2874f0] text-sm font-semibold hover:text-[#1a5dc8] transition-colors cursor-pointer px-3 py-1 rounded border border-[#2874f0] hover:bg-blue-50">
                        Edit
                      </button>
                    )}
                  </div>

                  {saveMsg && (
                    <div className={`mx-5 mt-4 px-4 py-2.5 rounded text-sm font-medium ${saveMsg.startsWith('✓') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {saveMsg}
                    </div>
                  )}

                  {editMode ? (
                    <form onSubmit={handleSaveProfile} className="px-5 py-6 space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                          <input type="text" autoComplete="name" required maxLength={100} value={form.name}
                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                            placeholder="Enter your full name"
                            className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Mobile Number *</label>
                          <input type="tel" autoComplete="tel" required pattern="\+?[0-9\s()-]{10,18}" title="Enter a valid mobile number" value={form.phone}
                            onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                            placeholder="+91 98765 43210"
                            className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] transition-colors" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                        <input type="email" value={profile.email || ''} disabled
                          className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-500 bg-gray-50 cursor-not-allowed" />
                        <p className="text-xs text-gray-400 mt-1">This is your account email. You can change the optional delivery update email at checkout.</p>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={saving}
                          className="bg-[#fb641b] hover:bg-[#e85d18] text-white font-bold text-sm px-8 py-2.5 rounded transition-colors disabled:opacity-60 cursor-pointer">
                          {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                        <button type="button" onClick={() => { setEditMode(false); setForm({ name: profile.name || '', phone: profile.phone || '' }); }}
                          className="border border-gray-300 text-gray-700 font-semibold text-sm px-6 py-2.5 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {[
                        { label: 'Full Name',     value: profile.name || '—', icon: '👤' },
                        { label: 'Email Address', value: profile.email || '—', icon: '✉️' },
                        { label: 'Phone Number',  value: profile.phone || 'Not set', icon: '📱' },
                        { label: 'Account Role',  value: profile.role === 'ADMIN' ? '🛡 Administrator' : '🛍 Customer', icon: '🎭' },
                      ].map(row => (
                        <div key={row.label} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                          <span className="text-lg mt-0.5 shrink-0">{row.icon}</span>
                          <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{row.label}</p>
                            <p className="text-sm font-medium text-gray-900 mt-0.5">{row.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick stats */}
                  <div className="border-t border-gray-100 px-5 py-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Account Summary</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Orders', value: orders.length, icon: '📦', color: '#2874f0', light: '#e3f0ff' },
                        { label: 'Addresses', value: addresses.length, icon: '📍', color: '#388e3c', light: '#e8f5e9' },
                        { label: 'Wishlist', value: wishlistItems.length, icon: '❤️', color: '#e53935', light: '#ffebee' },
                      ].map(stat => (
                        <div key={stat.label} className="rounded-lg p-3 text-center border" style={{ background: stat.light, borderColor: stat.color + '30' }}>
                          <p className="text-2xl mb-1">{stat.icon}</p>
                          <p className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</p>
                          <p className="text-xs font-medium text-gray-600">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ══ ORDERS ══ */}
              {active === 'orders' && (
                <div className="bg-white rounded-sm border border-gray-200 shadow-xs overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900 text-base">My Orders</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
                  </div>

                  {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <div className="text-6xl">📦</div>
                      <h3 className="font-bold text-gray-900 text-lg">No orders yet</h3>
                      <p className="text-sm text-gray-500 text-center max-w-xs">You haven&apos;t placed any orders. Start shopping to see your order history here.</p>
                      <Link href="/shop"
                        className="mt-2 bg-[#2874f0] hover:bg-[#1a5dc8] text-white font-bold text-sm px-8 py-2.5 rounded transition-colors">
                        Shop Now
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {orders.map(order => {
                        const st = STATUS_MAP[order.deliveryStatus] || { label: order.deliveryStatus, color: '#666', bg: '#f5f5f5' };
                        const savedAddress = order.shippingAddress;
                        const fullAddress = savedAddress
                          ? [
                              savedAddress.houseNumber,
                              savedAddress.street,
                              savedAddress.area,
                              savedAddress.landmark,
                              savedAddress.city,
                              savedAddress.state,
                              savedAddress.pincode,
                              savedAddress.country,
                            ].filter(Boolean).join(', ')
                          : 'Delivery address unavailable';
                        return (
                          <article key={order.id} className="px-5 py-5 hover:bg-gray-50/40 transition-colors space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-2xl shrink-0">🛍</div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Order ID</p>
                                  <p className="break-all text-sm font-bold text-gray-900 font-mono">{order.id}</p>
                                  <p className="text-xs text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
                                </div>
                              </div>
                              <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 ml-16 sm:ml-0">
                                <p className="text-base font-bold text-gray-900">₹{order.amount.toLocaleString('en-IN')}</p>
                                <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ color: st.color, background: st.bg }}>
                                  {order.status === 'FAILED' ? 'Payment failed' : st.label}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 text-sm">
                              <div>
                                <p className="font-semibold text-gray-800 mb-1">Items</p>
                                {order.items.length > 0 ? order.items.map(item => (
                                  <p key={item.id} className="text-gray-600">{item.productName} × {item.quantity}</p>
                                )) : <p className="text-gray-500">Item details unavailable</p>}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800 mb-1">Delivery and payment</p>
                                <p className="text-gray-600">Shipping: {order.shippingFee === 0 ? 'Free' : `₹${order.shippingFee.toLocaleString('en-IN')}`}</p>
                                <p className="text-gray-600">Payment: {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Razorpay'}</p>
                                <p className="text-gray-600">Payment status: {order.paymentStatus === 'PAID' ? 'Paid' : order.paymentStatus === 'REFUNDED' ? 'Refunded' : order.paymentStatus === 'PARTIALLY_REFUNDED' ? 'Partially refunded' : order.paymentMethod === 'COD' ? 'Due on delivery' : order.paymentStatus === 'FAILED' ? 'Failed' : 'Pending'}</p>
                                <p className="text-gray-600">Expected: {order.expectedDelivery ? `5–7 business days (by ${formatDate(order.expectedDelivery)})` : 'To be confirmed'}</p>
                                <p className="text-gray-600">Tracking: {order.trackingNumber || 'Not available yet'}</p>
                              </div>
                              <div className="sm:col-span-2">
                                <p className="font-semibold text-gray-800 mb-1">Delivering to</p>
                                <p className="text-gray-600">{fullAddress}</p>
                              </div>
                              {order.paymentId && (
                                <p className="sm:col-span-2 break-all text-xs text-gray-400">Payment reference: {order.paymentId}</p>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ══ ADDRESSES ══ */}
              {active === 'addresses' && (
                <div className="space-y-4">
                  {/* Header */}
                  <div className="bg-white rounded-sm border border-gray-200 shadow-xs px-5 py-4 flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-gray-900 text-base">My Addresses</h2>
                      <p className="text-xs text-gray-500 mt-0.5">{addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowAddrForm(p => !p);
                        setEditingAddressId(null);
                        setAddrForm(createEmptyAddressForm());
                        setAddrMsg('');
                      }}
                      className="flex items-center gap-2 text-[#2874f0] font-semibold text-sm border border-[#2874f0] rounded px-3 py-1.5 hover:bg-blue-50 transition-colors cursor-pointer">
                      <span className="text-lg leading-none">+</span> Add New
                    </button>
                  </div>

                  {addrMsg && (
                    <div className={`px-4 py-2.5 rounded text-sm font-medium ${addrMsg.startsWith('✓') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {addrMsg}
                    </div>
                  )}

                  {/* Add address form */}
                  {showAddrForm && (
                    <div className="bg-white rounded-sm border border-[#2874f0]/40 shadow-xs overflow-hidden">
                      <div className="px-5 py-3 border-b border-gray-100 bg-blue-50/50">
                        <h3 className="font-bold text-[#2874f0] text-sm">{editingAddressId ? 'Edit Saved Address' : 'Add New Address'}</h3>
                      </div>
                      <form onSubmit={handleAddAddress} className="px-5 py-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {([
                            ['houseNumber', 'House / Flat / Building number', 'House or flat number'],
                            ['street', 'Street / Locality', 'Street or locality'],
                            ['area', 'Area / Village', 'Area or village'],
                            ['landmark', 'Landmark (optional)', 'Nearby landmark'],
                            ['city', 'City / Town / Village', 'City or town'],
                            ['state', 'State', 'State'],
                            ['pincode', 'PIN code', '6-digit PIN code'],
                            ['country', 'Country', 'Country'],
                          ] as const).map(([field, label, placeholder]) => (
                            <div key={field}>
                              <label htmlFor={`address-${field}`} className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
                              <input
                                id={`address-${field}`}
                                type="text"
                                value={addrForm[field]}
                                maxLength={field === 'pincode' ? 6 : undefined}
                                onChange={e => setAddrForm(p => ({
                                  ...p,
                                  [field]: field === 'pincode' ? e.target.value.replace(/\D/g, '') : e.target.value,
                                }))}
                                placeholder={placeholder}
                                required={field !== 'landmark'}
                                className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] transition-colors"
                              />
                            </div>
                          ))}
                          <div>
                            <label htmlFor="address-type" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Address type</label>
                            <select id="address-type" value={addrForm.addressType}
                              onChange={e => setAddrForm(p => ({ ...p, addressType: e.target.value }))}
                              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#2874f0]">
                              <option value="HOME">Home</option>
                              <option value="WORK">Work</option>
                              <option value="OTHER">Other</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-3 pt-1">
                          <button type="submit" disabled={addrAdding}
                            className="bg-[#fb641b] hover:bg-[#e85d18] text-white font-bold text-sm px-7 py-2.5 rounded transition-colors disabled:opacity-60 cursor-pointer">
                            {addrAdding ? 'Saving…' : editingAddressId ? 'Update Address' : 'Save Address'}
                          </button>
                          <button type="button" onClick={() => { setShowAddrForm(false); setEditingAddressId(null); setAddrForm(createEmptyAddressForm()); }}
                            className="border border-gray-300 text-gray-700 font-semibold text-sm px-5 py-2.5 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Address list */}
                  {addresses.length === 0 && !showAddrForm ? (
                    <div className="bg-white rounded-sm border border-gray-200 shadow-xs flex flex-col items-center justify-center py-20 gap-4">
                      <div className="text-6xl">📍</div>
                      <h3 className="font-bold text-gray-900 text-lg">No saved addresses</h3>
                      <p className="text-sm text-gray-500 text-center max-w-xs">Add a delivery address so you can checkout faster next time.</p>
                      <button onClick={() => setShowAddrForm(true)}
                        className="mt-2 bg-[#2874f0] hover:bg-[#1a5dc8] text-white font-bold text-sm px-8 py-2.5 rounded transition-colors cursor-pointer">
                        Add Address
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map(addr => (
                        <div key={addr.id} className="bg-white rounded-sm border border-gray-200 shadow-xs p-5 flex flex-col gap-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-3">
                              <span className="text-xl mt-0.5">🏠</span>
                              <div>
                                <p className="text-xs font-bold text-[#2874f0] uppercase mb-1">{addr.addressType}</p>
                                <p className="text-sm font-semibold text-gray-900 leading-snug">
                                  {[addr.houseNumber || addr.address, addr.street, addr.area, addr.landmark].filter(Boolean).join(', ')}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">{addr.city}, {addr.state || 'India'} – {addr.pincode}, {addr.country}</p>
                                <p className="text-xs text-gray-400 mt-1">Added {formatDate(addr.createdAt)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                aria-label={`Edit ${addr.addressType.toLowerCase()} address`}
                                onClick={() => {
                                  setEditingAddressId(addr.id);
                                  setAddrForm({
                                    houseNumber: addr.houseNumber || addr.address,
                                    street: addr.street || '',
                                    area: addr.area || '',
                                    landmark: addr.landmark || '',
                                    city: addr.city,
                                    state: addr.state || '',
                                    pincode: addr.pincode,
                                    country: addr.country || 'India',
                                    addressType: addr.addressType || 'HOME',
                                  });
                                  setShowAddrForm(true);
                                  setAddrMsg('');
                                }}
                                className="text-xs font-semibold text-[#2874f0] hover:text-blue-800 transition-colors cursor-pointer p-1">
                                Edit
                              </button>
                              <button
                                type="button"
                                aria-label={`Delete ${addr.addressType.toLowerCase()} address`}
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer shrink-0 p-1">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ══ WISHLIST ══ */}
              {active === 'wishlist' && (
                <div className="bg-white rounded-sm border border-gray-200 shadow-xs overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
                    <h2 className="font-bold text-gray-900 text-base">My Wishlist ({wishlistItems.length})</h2>
                    <Link href="/wishlist" className="text-sm font-semibold text-[#2874f0] hover:text-[#1a5dc8]">
                      Open wishlist
                    </Link>
                  </div>
                  {wishlistError && (
                    <p role="alert" className="mx-5 mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {wishlistError}
                    </p>
                  )}
                  {wishlistLoading ? (
                    <p className="px-5 py-12 text-center text-sm text-gray-500">Loading your wishlist…</p>
                  ) : wishlistItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                      <div className="text-6xl" aria-hidden="true">❤️</div>
                      <h3 className="font-bold text-gray-900 text-lg">Your wishlist is empty</h3>
                      <p className="text-sm text-gray-500 text-center max-w-xs">Browse products and tap the heart icon to save items you love.</p>
                      <Link href="/shop"
                        className="bg-[#2874f0] hover:bg-[#1a5dc8] text-white font-bold text-sm px-6 py-2.5 rounded transition-colors">
                        Browse Shop
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
                      {wishlistItems.map((item) => (
                        <article key={item.id} className="flex min-w-0 gap-4 rounded-lg border border-gray-200 p-3">
                          <Link href={`/product/${item.productId}`} className="relative h-28 w-24 shrink-0 overflow-hidden rounded bg-gray-100">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              sizes="96px"
                              className="object-cover"
                            />
                          </Link>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <Link href={`/product/${item.productId}`} className="break-words text-sm font-semibold text-gray-900 hover:text-[#2874f0]">
                              {item.product.name}
                            </Link>
                            <p className="mt-1 text-xs text-gray-500">{item.product.category}</p>
                            <p className="mt-2 text-sm font-bold text-gray-900">₹{item.product.price.toLocaleString('en-IN')}</p>
                            <button
                              type="button"
                              onClick={() => void handleRemoveWishlistItem(item.productId)}
                              aria-label={`Remove ${item.product.name} from wishlist`}
                              className="mt-auto self-start pt-2 text-xs font-semibold text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ══ SECURITY ══ */}
              {active === 'security' && (
                <div className="space-y-4">
                  {/* Change Password */}
                  <div className="bg-white rounded-sm border border-gray-200 shadow-xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                      <h2 className="font-bold text-gray-900 text-base">Change Password</h2>
                      <p className="text-xs text-gray-500 mt-0.5">Choose a strong password to keep your account secure.</p>
                    </div>

                    {pwMsg && (
                      <div className={`mx-5 mt-4 px-4 py-2.5 rounded text-sm font-medium ${pwMsg.startsWith('✓') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {pwMsg}
                      </div>
                    )}

                    <form onSubmit={handleChangePw} className="px-5 py-6 space-y-4 max-w-md">
                      {/* Current password */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Current Password</label>
                        <div className="relative">
                          <input type={showPw.current ? 'text' : 'password'} value={pwForm.current}
                            onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
                            placeholder="Enter current password" required
                            className="w-full border border-gray-300 rounded px-3 py-2.5 pr-10 text-sm text-gray-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] transition-colors" />
                          <button type="button" onClick={() => setShowPw(p => ({ ...p, current: !p.current }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-xs">
                            {showPw.current ? '🙈' : '👁'}
                          </button>
                        </div>
                      </div>
                      {/* New password */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">New Password</label>
                        <div className="relative">
                          <input type={showPw.next ? 'text' : 'password'} value={pwForm.next}
                            onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))}
                            placeholder="Min 8 characters" required
                            className="w-full border border-gray-300 rounded px-3 py-2.5 pr-10 text-sm text-gray-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] transition-colors" />
                          <button type="button" onClick={() => setShowPw(p => ({ ...p, next: !p.next }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-xs">
                            {showPw.next ? '🙈' : '👁'}
                          </button>
                        </div>
                        {/* Strength bar */}
                        {pwForm.next && (
                          <div className="mt-2">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4].map(n => {
                                const strength = Math.min(4, [/[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/, /.{8,}/].filter(r => r.test(pwForm.next)).length);
                                const colors = ['#ef5350', '#ff9800', '#ffc107', '#66bb6a'];
                                return <div key={n} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ background: n <= strength ? colors[strength - 1] : '#e0e0e0' }} />;
                              })}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {[/[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/, /.{8,}/].filter(r => r.test(pwForm.next)).length < 2 ? 'Weak' :
                               [/[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/, /.{8,}/].filter(r => r.test(pwForm.next)).length < 4 ? 'Moderate' : 'Strong'} password
                            </p>
                          </div>
                        )}
                      </div>
                      {/* Confirm new */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                        <div className="relative">
                          <input type={showPw.confirm ? 'text' : 'password'} value={pwForm.confirm}
                            onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                            placeholder="Repeat new password" required
                            className="w-full border border-gray-300 rounded px-3 py-2.5 pr-10 text-sm text-gray-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] transition-colors" />
                          <button type="button" onClick={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-xs">
                            {showPw.confirm ? '🙈' : '👁'}
                          </button>
                        </div>
                        {pwForm.confirm && pwForm.next !== pwForm.confirm && (
                          <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                        )}
                      </div>

                      <button type="submit" disabled={pwSaving}
                        className="bg-[#fb641b] hover:bg-[#e85d18] text-white font-bold text-sm px-8 py-2.5 rounded transition-colors disabled:opacity-60 cursor-pointer mt-2">
                        {pwSaving ? 'Updating…' : 'Update Password'}
                      </button>
                    </form>
                  </div>

                  {/* Danger zone */}
                  <div className="bg-white rounded-sm border border-red-100 shadow-xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-red-100 bg-red-50/40">
                      <h2 className="font-bold text-red-700 text-base flex items-center gap-2">
                        <span>⚠️</span> Danger Zone
                      </h2>
                    </div>
                    <div className="px-5 py-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-red-200 rounded-lg bg-red-50/30">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">Sign out of all devices</p>
                          <p className="text-xs text-gray-500 mt-0.5">This will end all active sessions across all your devices.</p>
                        </div>
                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="shrink-0 bg-[#c62828] hover:bg-[#b71c1c] text-white font-bold text-xs px-5 py-2.5 rounded transition-colors cursor-pointer">
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </main>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
