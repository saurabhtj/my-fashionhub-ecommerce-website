'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DeliveryAddress {
  houseNumber: string;
  street: string;
  area: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  addressType: string;
}

interface SavedAddress extends DeliveryAddress {
  id: string;
  address: string;
}

interface CartItem {
  id: string;
  quantity: number;
  size: string | null;
  color: string | null;
  product: { id: string; name: string; price: number; image: string; stock: number };
}

interface OrderConfirmation {
  orderId: string;
  createdAt: string;
  amount: number;
  subtotal: number;
  shippingFee: number;
  expectedDelivery: string;
  paymentMethod: 'COD' | 'RAZORPAY';
  customer: { name: string; phone: string; email: string | null };
  deliveryAddress: DeliveryAddress;
  items: { id: string; productName: string; unitPrice: number; quantity: number; size?: string | null; color?: string | null }[];
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email?: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpayPaymentResponse) => void | Promise<void>;
  modal: { ondismiss: () => void };
}

interface RazorpayCheckoutInstance {
  open: () => void;
  on: (event: 'payment.failed', handler: (response: { error?: { description?: string } }) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayCheckoutInstance;
  }
}

const EMPTY_ADDRESS: DeliveryAddress = {
  houseNumber: '',
  street: '',
  area: '',
  landmark: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  addressType: 'HOME',
};

const ADDRESS_FIELDS: { key: keyof DeliveryAddress; label: string; optional?: boolean }[] = [
  { key: 'houseNumber', label: 'House / Flat / Building number' },
  { key: 'street', label: 'Street / Locality' },
  { key: 'area', label: 'Area / Village' },
  { key: 'landmark', label: 'Landmark', optional: true },
  { key: 'city', label: 'City / Town / Village' },
  { key: 'state', label: 'State' },
  { key: 'pincode', label: 'PIN code' },
  { key: 'country', label: 'Country' },
];

async function loadRazorpay() {
  if (window.Razorpay) return;

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('#razorpay-checkout-script');
    const script = existingScript || document.createElement('script');

    script.onload = () => window.Razorpay ? resolve() : reject(new Error('Razorpay checkout did not initialize.'));
    script.onerror = () => reject(new Error('Could not load Razorpay checkout. Check your internet connection and try again.'));

    if (!existingScript) {
      script.id = 'razorpay-checkout-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  });
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '' });
  const [address, setAddress] = useState<DeliveryAddress>(EMPTY_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY' | ''>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);
  const [checkoutRequestKey, setCheckoutRequestKey] = useState('');
  const [pendingVerification, setPendingVerification] = useState<{
    payment: RazorpayPaymentResponse;
    order: OrderConfirmation;
  } | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    let cancelled = false;
    const loadCheckoutData = async () => {
      try {
        const { getGuestCart, saveGuestCart } = await import('@/lib/cartStorage');
        const guestItems = getGuestCart();
        if (guestItems.length > 0) {
          for (const item of guestItems) {
            const response = await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                productId: item.productId,
                quantity: item.quantity,
                size: item.size || 'M',
                color: item.color || 'Default',
              }),
            });
            if (!response.ok) {
              throw new Error('Could not move your guest cart into your account. Please review your cart and try again.');
            }
          }
          saveGuestCart([]);
        }

        const [cartResponse, profileResponse, addressesResponse] = await Promise.all([
          fetch('/api/cart'),
          fetch('/api/user/profile'),
          fetch('/api/user/addresses'),
        ]);
        if (!cartResponse.ok) throw new Error('Could not load your cart.');
        if (!profileResponse.ok) throw new Error('Could not load your customer details.');
        if (!addressesResponse.ok) throw new Error('Could not load your saved addresses.');

        const [items, profile, addresses] = await Promise.all([
          cartResponse.json() as Promise<CartItem[]>,
          profileResponse.json(),
          addressesResponse.json() as Promise<SavedAddress[]>,
        ]);
        if (cancelled) return;

        setCartItems(items);
        setCustomer({
          name: profile.name || '',
          phone: profile.phone || '',
          email: profile.email || session?.user?.email || '',
        });
        setSavedAddresses(addresses);
        if (addresses.length > 0) {
          const defaultAddress = addresses[0];
          setSelectedAddressId(defaultAddress.id);
          setAddress({
            houseNumber: defaultAddress.houseNumber || defaultAddress.address || '',
            street: defaultAddress.street || '',
            area: defaultAddress.area || '',
            landmark: defaultAddress.landmark || '',
            city: defaultAddress.city || '',
            state: defaultAddress.state || '',
            pincode: defaultAddress.pincode || '',
            country: defaultAddress.country || 'India',
            addressType: defaultAddress.addressType || 'HOME',
          });
        }
      } catch (loadError) {
        console.error('Checkout data loading error:', loadError);
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Could not load checkout details.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadCheckoutData();
    return () => { cancelled = true; };
  }, [status, session?.user?.email]);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartItems]
  );
  const shippingFee = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shippingFee;

  const updateAddress = (field: keyof DeliveryAddress, value: string) => {
    setSelectedAddressId('');
    setCheckoutRequestKey('');
    setAddress((current) => ({ ...current, [field]: value }));
  };

  const showConfirmation = (order: OrderConfirmation) => {
    submittingRef.current = false;
    setConfirmation(order);
    setCartItems([]);
    setPendingVerification(null);
    setCheckoutRequestKey('');
  };

  const verifyPayment = async (payment: RazorpayPaymentResponse, order: OrderConfirmation) => {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payment),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Payment could not be verified.');
    if (result.paymentStatus === 'FAILED') {
      setPendingVerification(null);
      setError(result.message || 'Payment failed. You can safely retry checkout.');
      return;
    }
    if (result.paymentStatus !== 'PAID' || result.orderId !== order.orderId) {
      throw new Error('Payment is not yet confirmed. Retry verification shortly; do not pay again while it is pending.');
    }
    showConfirmation(order);
    setError('');
  };

  const retryPaymentVerification = async () => {
    if (!pendingVerification || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setError('');
    try {
      await verifyPayment(pendingVerification.payment, pendingVerification.order);
    } catch (verificationError) {
      setError(verificationError instanceof Error
        ? `${verificationError.message} Order ID: ${pendingVerification.order.orderId}`
        : `Payment confirmation is pending. Order ID: ${pendingVerification.order.orderId}`);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const handleCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;
    setError('');

    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    if (!paymentMethod) {
      setError('Choose a payment method to continue.');
      return;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      setError('Enter a valid 6-digit PIN code.');
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    try {
      if (paymentMethod === 'RAZORPAY') {
        await loadRazorpay();
        if (!window.Razorpay) throw new Error('Razorpay checkout is unavailable. Please try again.');
      }

      const requestKey = checkoutRequestKey || crypto.randomUUID();
      if (!checkoutRequestKey) setCheckoutRequestKey(requestKey);
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': requestKey },
        body: JSON.stringify({
          customer,
          address: selectedAddressId ? undefined : address,
          addressId: selectedAddressId || undefined,
          paymentMethod,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not place the order.');

      if (paymentMethod === 'COD') {
        showConfirmation(result as OrderConfirmation);
        return;
      }

      if (!result.razorpayOrder?.id || !result.razorpayKeyId) {
        throw new Error('Razorpay Test Mode is not configured. Please check the test API credentials or choose Cash on Delivery.');
      }
      if (result.razorpayMode !== 'test') {
        throw new Error('This checkout is restricted to Razorpay Test Mode.');
      }

      const RazorpayCheckout = window.Razorpay;
      if (!RazorpayCheckout) throw new Error('Razorpay checkout is unavailable. Please try again.');

      const checkout = new RazorpayCheckout({
        key: result.razorpayKeyId,
        amount: result.amountPaise,
        currency: result.razorpayOrder.currency,
        name: 'Fashion Hub',
        description: `Order ${result.orderId}`,
        order_id: result.razorpayOrder.id,
        prefill: {
          name: customer.name,
          email: customer.email || undefined,
          contact: customer.phone,
        },
        theme: { color: '#111827' },
        handler: async (payment) => {
          const orderConfirmation = result as OrderConfirmation;
          setPendingVerification({ payment, order: orderConfirmation });
          try {
            await verifyPayment(payment, orderConfirmation);
          } catch (verificationError) {
            setError(verificationError instanceof Error
              ? `${verificationError.message} Order ID: ${result.orderId}.`
              : 'Payment could not be verified. Contact support with your order ID.');
          } finally {
            submittingRef.current = false;
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            submittingRef.current = false;
            setSubmitting(false);
          },
        },
      });
      checkout.on('payment.failed', (failure) => {
        submittingRef.current = false;
        setPendingVerification(null);
        setError(failure.error?.description || 'Payment did not complete. You can safely try again.');
        setSubmitting(false);
      });
      checkout.open();
    } catch (checkoutError) {
      submittingRef.current = false;
      setError(checkoutError instanceof Error ? checkoutError.message : 'Could not place the order. Please try again.');
      setSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading checkout…</div>;
  }

  if (confirmation) {
    const orderDate = new Date(confirmation.createdAt);
    const isPaidOnline = confirmation.paymentMethod === 'RAZORPAY';
    return (
      <main id="checkout-receipt" className="receipt-document mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <header className="receipt-header flex flex-wrap items-start justify-between gap-6 border-b border-neutral-200 px-6 py-7 sm:px-9">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">ORUMA FASHION HUB</p>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">Order receipt</h1>
              <p className="mt-2 text-sm text-neutral-600">
                {isPaidOnline
                  ? 'Thank you. Your payment has been verified.'
                  : 'Thank you. Payment is due when your order is delivered.'}
              </p>
            </div>
            <div className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${isPaidOnline ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
              {isPaidOnline ? 'Paid · verified' : 'Cash on delivery · due'}
            </div>
          </header>

          <div className="receipt-content space-y-8 px-6 py-7 sm:px-9">
            <section aria-label="Receipt details" className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Receipt / order number</p>
                <p className="mt-1 break-all font-mono text-sm font-semibold text-neutral-900">{confirmation.orderId}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Order date</p>
                <time dateTime={orderDate.toISOString()} className="mt-1 block text-sm font-medium text-neutral-900">
                  {orderDate.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </time>
              </div>
            </section>

            <section aria-label="Customer and delivery details" className="grid gap-6 border-y border-neutral-200 py-6 sm:grid-cols-2">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Billed to</h2>
                <p className="mt-2 text-sm font-semibold text-neutral-900">{confirmation.customer.name}</p>
                <p className="mt-1 text-sm text-neutral-700">{confirmation.customer.phone}</p>
                {confirmation.customer.email && <p className="mt-1 break-all text-sm text-neutral-700">{confirmation.customer.email}</p>}
              </div>
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Delivering to</h2>
                <address className="mt-2 not-italic text-sm leading-6 text-neutral-800">
                  {[
                    confirmation.deliveryAddress.houseNumber,
                    confirmation.deliveryAddress.street,
                    confirmation.deliveryAddress.area,
                    confirmation.deliveryAddress.landmark,
                    confirmation.deliveryAddress.city,
                    confirmation.deliveryAddress.state,
                    confirmation.deliveryAddress.pincode,
                    confirmation.deliveryAddress.country,
                  ].filter(Boolean).join(', ')}
                </address>
              </div>
            </section>

            <section aria-label="Purchased items">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Items purchased</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-300 text-xs uppercase tracking-wider text-neutral-500">
                      <th scope="col" className="py-3 pr-3 font-semibold">Item</th>
                      <th scope="col" className="px-2 py-3 text-center font-semibold">Qty</th>
                      <th scope="col" className="px-2 py-3 text-right font-semibold">Unit price</th>
                      <th scope="col" className="py-3 pl-2 text-right font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {confirmation.items.map((item) => (
                      <tr key={item.id}>
                        <th scope="row" className="py-4 pr-3 font-medium text-neutral-900">
                          {item.productName}
                          {(item.size || item.color) && (
                            <span className="mt-1 block text-xs font-normal text-neutral-500">
                              {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(' · ')}
                            </span>
                          )}
                        </th>
                        <td className="px-2 py-4 text-center text-neutral-700">{item.quantity}</td>
                        <td className="whitespace-nowrap px-2 py-4 text-right text-neutral-700">₹{item.unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td className="whitespace-nowrap py-4 pl-2 text-right font-medium text-neutral-900">₹{(item.unitPrice * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-label="Receipt total" className="ml-auto w-full max-w-sm space-y-3 border-t border-neutral-200 pt-5">
              <div className="flex justify-between gap-4 text-sm text-neutral-600">
                <span>Subtotal</span>
                <span>₹{confirmation.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between gap-4 text-sm text-neutral-600">
                <span>Shipping</span>
                <span>{confirmation.shippingFee === 0 ? 'Free' : `₹${confirmation.shippingFee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}</span>
              </div>
              <div className="flex justify-between gap-4 border-t border-neutral-300 pt-4 text-base font-bold text-neutral-950">
                <span>{isPaidOnline ? 'Paid total' : 'Total due on delivery'}</span>
                <span>₹{confirmation.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <p className="text-right text-xs text-neutral-500">
                Payment method: {isPaidOnline ? 'Razorpay · payment verified' : 'Cash on delivery'}
              </p>
            </section>

            <section className="receipt-footer border-t border-neutral-200 pt-5 text-sm text-neutral-600">
              <p>
                Expected delivery: 5–7 business days (by {new Date(confirmation.expectedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })})
              </p>
              <p className="mt-2">For order updates, visit My Orders. Thank you for shopping with Oruma Fashion Hub.</p>
            </section>
          </div>
        </article>
        <div className="receipt-actions mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={() => window.print()} className="rounded-lg bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-700">
            Print receipt
          </button>
          <Link href="/profile" className="rounded-lg border border-neutral-300 px-5 py-3 text-center text-sm font-semibold text-neutral-800 hover:bg-neutral-50">
            View My Orders
          </Link>
          <Link href="/shop" className="rounded-lg border border-neutral-300 px-5 py-3 text-center text-sm font-semibold text-neutral-800 hover:bg-neutral-50">
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Checkout</h1>

      {error && (
        <p role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}
      {pendingVerification && (
        <div className="mb-6 flex flex-col gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
          <p>Do not pay again while we confirm your payment. Order ID: <strong className="break-all">{pendingVerification.order.orderId}</strong></p>
          <button type="button" disabled={submitting} onClick={() => void retryPaymentVerification()}
            className="shrink-0 rounded-md bg-gray-900 px-4 py-2 font-semibold text-white disabled:opacity-60">
            {submitting ? 'Checking…' : 'Retry payment verification'}
          </button>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <form onSubmit={handleCheckout} className="lg:col-span-7 space-y-8">
          <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900">1. Customer Details</h2>
            <p className="mt-1 mb-5 text-sm text-gray-500">We use these details for delivery and order updates.</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="customer-name" className="block text-sm font-medium text-gray-700">Full name *</label>
                <input id="customer-name" autoComplete="name" required maxLength={100} value={customer.name}
                  onChange={(event) => { setCheckoutRequestKey(''); setCustomer((current) => ({ ...current, name: event.target.value })); }}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:ring-black" />
              </div>
              <div>
                <label htmlFor="customer-phone" className="block text-sm font-medium text-gray-700">Mobile number *</label>
                <input id="customer-phone" type="tel" autoComplete="tel" required pattern="\+?[0-9\s\(\)\-]{10,18}"
                  title="Enter a valid mobile number" value={customer.phone}
                  onChange={(event) => { setCheckoutRequestKey(''); setCustomer((current) => ({ ...current, phone: event.target.value })); }}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:ring-black" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="customer-email" className="block text-sm font-medium text-gray-700">Email address (optional for delivery, useful for order updates)</label>
                <input id="customer-email" type="email" autoComplete="email" value={customer.email}
                  onChange={(event) => { setCheckoutRequestKey(''); setCustomer((current) => ({ ...current, email: event.target.value })); }}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:ring-black" />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900">2. Delivery Address</h2>
            <p className="mt-1 mb-5 text-sm text-gray-500">Enter an address or select one saved to your account.</p>
            {savedAddresses.length > 0 && (
              <div className="mb-5">
                <label htmlFor="saved-address" className="block text-sm font-medium text-gray-700">Choose a saved address</label>
                <select id="saved-address" value={selectedAddressId}
                  onChange={(event) => {
                    const selected = savedAddresses.find((saved) => saved.id === event.target.value);
                    setSelectedAddressId(selected?.id || '');
                    setCheckoutRequestKey('');
                    if (selected) {
                      setAddress({
                        houseNumber: selected.houseNumber || selected.address || '',
                        street: selected.street || '',
                        area: selected.area || '',
                        landmark: selected.landmark || '',
                        city: selected.city || '',
                        state: selected.state || '',
                        pincode: selected.pincode || '',
                        country: selected.country || 'India',
                        addressType: selected.addressType || 'HOME',
                      });
                    }
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-black focus:ring-black">
                  <option value="">Enter a new address</option>
                  {savedAddresses.map((saved) => (
                    <option key={saved.id} value={saved.id}>
                      {saved.addressType || 'Address'}: {saved.address}, {saved.city} – {saved.pincode}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {ADDRESS_FIELDS.map(({ key, label, optional }) => (
                <div key={key} className={key === 'landmark' ? '' : undefined}>
                  <label htmlFor={`checkout-${key}`} className="block text-sm font-medium text-gray-700">
                    {label}{optional ? ' (optional)' : ' *'}
                  </label>
                  <input id={`checkout-${key}`} type="text" required={!optional}
                    autoComplete={key === 'pincode' ? 'postal-code' : key === 'street' ? 'address-line1' : undefined}
                    maxLength={key === 'pincode' ? 6 : 120}
                    value={address[key]}
                    onChange={(event) => updateAddress(key, key === 'pincode' ? event.target.value.replace(/\D/g, '') : event.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:ring-black" />
                </div>
              ))}
              <div>
                <label htmlFor="checkout-address-type" className="block text-sm font-medium text-gray-700">Address type *</label>
                <select id="checkout-address-type" required value={address.addressType}
                  onChange={(event) => updateAddress('addressType', event.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-black focus:ring-black">
                  <option value="HOME">Home</option>
                  <option value="WORK">Work</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900">3. Delivery Options</h2>
            <div className="mt-4 flex flex-col gap-2 rounded-lg bg-gray-50 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-gray-900">Standard delivery</p>
                <p className="text-gray-500">Estimated delivery in 5–7 business days</p>
              </div>
              <p className="font-bold text-gray-900">{shippingFee === 0 ? 'Free' : `₹${shippingFee.toLocaleString('en-IN')}`}</p>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900">4. Payment Details</h2>
            <p className="mt-1 text-sm text-gray-500">Card and UPI details are entered securely in Razorpay and are never stored by this website.</p>
            <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
              Razorpay Test Mode — use test credentials only; no real payment will be taken.
            </p>
            <fieldset className="mt-4 space-y-3">
              <legend className="sr-only">Choose a payment method</legend>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 hover:border-gray-400">
                <input type="radio" name="payment-method" value="RAZORPAY" required checked={paymentMethod === 'RAZORPAY'}
                  onChange={() => { setPaymentMethod('RAZORPAY'); setCheckoutRequestKey(''); }} className="mt-1 accent-gray-900" />
                <span>
                  <span className="block text-sm font-semibold text-gray-900">Pay online with Razorpay</span>
                  <span className="block text-sm text-gray-500">UPI, debit / credit cards, net banking, and other methods supported by Razorpay.</span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 hover:border-gray-400">
                <input type="radio" name="payment-method" value="COD" required checked={paymentMethod === 'COD'}
                  onChange={() => { setPaymentMethod('COD'); setCheckoutRequestKey(''); }} className="mt-1 accent-gray-900" />
                <span>
                  <span className="block text-sm font-semibold text-gray-900">Cash on Delivery (COD)</span>
                  <span className="block text-sm text-gray-500">Pay the delivery partner when your order arrives.</span>
                </span>
              </label>
            </fieldset>
          </section>

          <button type="submit" disabled={submitting || cartItems.length === 0 || !!pendingVerification}
            className="w-full rounded-lg bg-black px-4 py-3.5 text-base font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? 'Processing…' : paymentMethod === 'COD' ? 'Place COD Order' : paymentMethod === 'RAZORPAY' ? 'Continue to Secure Payment' : 'Choose a Payment Method'}
          </button>
        </form>

        <aside className="mt-10 lg:mt-0 lg:col-span-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">5. Review Products, Quantities and Total</h2>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            {cartItems.length === 0 ? (
              <p className="p-6 text-sm text-gray-500">Your cart is empty.</p>
            ) : (
              <ul className="divide-y divide-gray-200 px-4 sm:px-6">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex min-w-0 py-5">
                    <div className="h-20 w-16 shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="ml-4 flex min-w-0 flex-1 flex-col">
                      <div className="flex min-w-0 flex-wrap justify-between gap-2 text-sm font-medium text-gray-900">
                        <h3 className="min-w-0 break-words">{item.product.name}</h3>
                        <p className="shrink-0">₹{(item.product.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{[item.color, item.size].filter(Boolean).join(' · ')}</p>
                      <p className="mt-2 text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <dl className="space-y-4 border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="flex justify-between text-sm"><dt>Subtotal</dt><dd>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</dd></div>
              <div className="flex justify-between text-sm"><dt>Shipping fee</dt><dd>{shippingFee === 0 ? 'Free' : `₹${shippingFee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}</dd></div>
              <div className="flex justify-between border-t border-gray-200 pt-4 text-base font-bold"><dt>Total</dt><dd>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</dd></div>
            </dl>
          </div>
        </aside>
      </div>
    </main>
  );
}
