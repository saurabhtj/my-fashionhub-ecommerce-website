"use client";

import { signOut } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

type Overview = {
  totalOrders: number;
  successfulPayments: number;
  pendingPayments: number;
  capturedSales: number;
};

type Order = {
  id: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentId: string | null;
  razorpayOrderId: string | null;
  paymentSignatureVerified: boolean;
  deliveryStatus: string;
  createdAt: string;
  customerName: string | null;
  customerPhone: string | null;
  customerEmail: string | null;
  user: { name: string | null; email: string | null; phone: string | null };
  items: Array<{ id: string; productName: string; quantity: number; unitPrice: number; size: string | null; color: string | null }>;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  tag: string | null;
  price: number;
  category: string;
  image: string;
  stock: number;
  isArchived: boolean;
};

type PageResult<T> = { items: T[]; total: number; pages: number };
type Tab = "overview" | "orders" | "products";

const money = (amount: number, currency = "INR") => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency,
  maximumFractionDigits: 2,
}).format(amount);

const inputClass = "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900";
const buttonClass = "rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50";

export default function AdminDashboard({ adminName }: { adminName: string }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [orders, setOrders] = useState<PageResult<Order>>({ items: [], total: 0, pages: 0 });
  const [products, setProducts] = useState<PageResult<Product>>({ items: [], total: 0, pages: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [archived, setArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    tag: "",
    category: "Women",
    image: "",
    price: "",
    stock: "0",
  });
  const [creating, setCreating] = useState(false);

  const requestJson = useCallback(async <T,>(url: string, init?: RequestInit): Promise<T> => {
    const response = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "The request could not be completed.");
    return data as T;
  }, []);

  const loadOverview = useCallback(async () => {
    const data = await requestJson<Overview>("/api/admin/overview");
    setOverview(data);
  }, [requestJson]);

  const loadOrders = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), size: "20", q: search });
    const data = await requestJson<{ orders: Order[]; total: number; pages: number }>(`/api/admin/orders?${params}`);
    setOrders({ items: data.orders, total: data.total, pages: data.pages });
  }, [page, requestJson, search]);

  const loadProducts = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), size: "20", q: search, archived: String(archived) });
    const data = await requestJson<{ products: Product[]; total: number; pages: number }>(`/api/admin/products?${params}`);
    setProducts({ items: data.products, total: data.total, pages: data.pages });
  }, [archived, page, requestJson, search]);

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (tab === "overview") await loadOverview();
      if (tab === "orders") await loadOrders();
      if (tab === "products") await loadProducts();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load admin data.");
    } finally {
      setLoading(false);
    }
  }, [loadOrders, loadOverview, loadProducts, tab]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) void reload();
    });
    return () => {
      active = false;
    };
  }, [reload]);

  async function updateDeliveryStatus(orderId: string, deliveryStatus: string) {
    setSavingId(orderId);
    setError("");
    setNotice("");
    try {
      await requestJson(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
        method: "PATCH",
        body: JSON.stringify({ deliveryStatus }),
      });
      setNotice("Fulfilment status updated.");
      await loadOrders();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not update this order.");
    } finally {
      setSavingId(null);
    }
  }

  async function saveProduct(product: Product, changes: Partial<Product>) {
    setSavingId(product.id);
    setError("");
    setNotice("");
    try {
      await requestJson(`/api/admin/products/${encodeURIComponent(product.id)}`, {
        method: "PATCH",
        body: JSON.stringify(changes),
      });
      setNotice("Product updated.");
      await loadProducts();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not update this product.");
    } finally {
      setSavingId(null);
    }
  }

  async function createProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setError("");
    setNotice("");
    try {
      await requestJson("/api/admin/products", {
        method: "POST",
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price),
          stock: Number(newProduct.stock),
        }),
      });
      setNewProduct({ name: "", description: "", tag: "", category: "Women", image: "", price: "", stock: "0" });
      setArchived(false);
      setPage(1);
      setSearch("");
      setNotice("Product created and made available in the shop.");
      await loadProducts();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create product.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Fashion Hub</p>
            <h1 className="mt-1 text-2xl font-semibold">Admin dashboard</h1>
            <p className="mt-1 text-sm text-neutral-600">Signed in as {adminName}</p>
          </div>
          <button className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-white" onClick={() => void signOut({ callbackUrl: "/login" })}>
            Sign out
          </button>
        </header>

        <nav aria-label="Admin sections" className="mb-6 flex flex-wrap gap-2">
          {(["overview", "orders", "products"] as const).map((item) => (
            <button
              key={item}
              onClick={() => {
                setPage(1);
                setTab(item);
              }}
              className={`rounded-md px-4 py-2 text-sm font-medium capitalize ${tab === item ? "bg-neutral-900 text-white" : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100"}`}
            >
              {item}
            </button>
          ))}
        </nav>

        {error && <p role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        {notice && <p role="status" className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
        {loading && <p className="mb-4 text-sm text-neutral-600">Loading…</p>}

        {tab === "overview" && overview && (
          <section aria-label="Store overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Total orders", overview.totalOrders.toLocaleString("en-IN")],
              ["Successful payments", overview.successfulPayments.toLocaleString("en-IN")],
              ["Pending payments", overview.pendingPayments.toLocaleString("en-IN")],
              ["Captured sales", money(overview.capturedSales)],
            ].map(([label, value]) => (
              <article key={label} className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-neutral-500">{label}</p>
                <p className="mt-2 text-2xl font-semibold">{value}</p>
              </article>
            ))}
          </section>
        )}

        {tab === "orders" && (
          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Orders <span className="text-sm font-normal text-neutral-500">({orders.total})</span></h2>
              <input aria-label="Search orders by order ID" className={`${inputClass} max-w-sm`} placeholder="Search order ID" value={search} onChange={(event) => { setPage(1); setSearch(event.target.value); }} />
            </div>
            <div className="space-y-4">
              {orders.items.map((order) => {
                const customerName = order.customerName || order.user.name || "Customer";
                const phone = order.customerPhone || order.user.phone || "—";
                const email = order.customerEmail || order.user.email || "—";
                return (
                  <article key={order.id} className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-100 p-4">
                      <div className="min-w-0">
                        <p className="break-all text-sm font-semibold">Order {order.id}</p>
                        <p className="mt-1 text-sm text-neutral-600">{customerName} · {phone} · {email}</p>
                        <p className="mt-1 text-xs text-neutral-500">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-lg font-semibold">{money(order.amount, order.currency)}</p>
                        <p className="text-sm text-neutral-600">Payment: {order.paymentStatus}</p>
                        <p className="text-xs text-neutral-500">
                          {order.paymentSignatureVerified ? "Checkout signature verified" : order.paymentStatus === "PAID" || order.paymentStatus === "PARTIALLY_REFUNDED" || order.paymentStatus === "REFUNDED" ? "Webhook-confirmed" : "Not verified"} · {order.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-4 p-4 lg:grid-cols-[1fr_auto]">
                      <div>
                        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Items</h3>
                        <ul className="space-y-1 text-sm">
                          {order.items.map((item) => (
                            <li key={item.id} className="flex flex-wrap justify-between gap-x-4">
                              <span>{item.productName} × {item.quantity}{item.size ? ` · ${item.size}` : ""}{item.color ? ` · ${item.color}` : ""}</span>
                              <span>{money(item.unitPrice * item.quantity, order.currency)}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-3 break-all text-xs text-neutral-500">Razorpay order: {order.razorpayOrderId || "—"}</p>
                        <p className="break-all text-xs text-neutral-500">Payment ID: {order.paymentId || "—"}</p>
                      </div>
                      <label className="flex flex-col gap-1 text-sm">
                        Fulfilment status
                        <select
                          className={`${inputClass} min-w-44`}
                          value={order.deliveryStatus.toUpperCase()}
                          disabled={savingId === order.id}
                          onChange={(event) => void updateDeliveryStatus(order.id, event.target.value)}
                        >
                          {["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                      </label>
                    </div>
                  </article>
                );
              })}
              {!loading && orders.items.length === 0 && <p className="rounded-lg border border-neutral-200 bg-white p-6 text-sm text-neutral-600">No orders found.</p>}
            </div>
            <Pagination page={page} pages={orders.pages} setPage={setPage} />
          </section>
        )}

        {tab === "products" && (
          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Products <span className="text-sm font-normal text-neutral-500">({products.total})</span></h2>
              <div className="flex flex-wrap items-center gap-3">
                <input aria-label="Search products" className={`${inputClass} max-w-sm`} placeholder="Search name or ID" value={search} onChange={(event) => { setPage(1); setSearch(event.target.value); }} />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={archived} onChange={(event) => { setPage(1); setArchived(event.target.checked); }} />
                  Archived
                </label>
              </div>
            </div>

            <form onSubmit={createProduct} className="mb-6 grid gap-3 rounded-lg border border-neutral-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
              <h3 className="sm:col-span-2 lg:col-span-4 text-sm font-semibold">Add product</h3>
              <input aria-label="Product name" className={inputClass} placeholder="Product name" required value={newProduct.name} onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })} />
              <select aria-label="Product category" className={inputClass} value={newProduct.category} onChange={(event) => setNewProduct({ ...newProduct, category: event.target.value })}>
                {["Women", "Men", "Kids", "Accessories"].map((category) => <option key={category}>{category}</option>)}
              </select>
              <input aria-label="Price" className={inputClass} type="number" min="0.01" step="0.01" placeholder="Price (INR)" required value={newProduct.price} onChange={(event) => setNewProduct({ ...newProduct, price: event.target.value })} />
              <input aria-label="Stock" className={inputClass} type="number" min="0" step="1" placeholder="Stock" required value={newProduct.stock} onChange={(event) => setNewProduct({ ...newProduct, stock: event.target.value })} />
              <input aria-label="Image URL" className={`${inputClass} sm:col-span-2`} placeholder="Image URL (https://… or /image.jpg)" required value={newProduct.image} onChange={(event) => setNewProduct({ ...newProduct, image: event.target.value })} />
              <input aria-label="Tag" className={inputClass} placeholder="Tag (optional)" value={newProduct.tag} onChange={(event) => setNewProduct({ ...newProduct, tag: event.target.value })} />
              <button className={buttonClass} type="submit" disabled={creating}>{creating ? "Adding…" : "Add product"}</button>
              <textarea aria-label="Description" className={`${inputClass} min-h-20 sm:col-span-2 lg:col-span-4`} placeholder="Description (optional)" value={newProduct.description} onChange={(event) => setNewProduct({ ...newProduct, description: event.target.value })} />
            </form>

            <div className="space-y-3">
              {products.items.map((product) => (
                <ProductRow key={product.id} product={product} saving={savingId === product.id} onSave={(changes) => saveProduct(product, changes)} />
              ))}
              {!loading && products.items.length === 0 && <p className="rounded-lg border border-neutral-200 bg-white p-6 text-sm text-neutral-600">No products found.</p>}
            </div>
            <Pagination page={page} pages={products.pages} setPage={setPage} />
          </section>
        )}
      </div>
    </main>
  );
}

function ProductRow({
  product,
  saving,
  onSave,
}: {
  product: Product;
  saving: boolean;
  onSave: (changes: Partial<Product>) => void;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        onSave({
          name: String(formData.get("name")),
          category: String(formData.get("category")),
          image: String(formData.get("image")),
          description: String(formData.get("description")),
          price: Number(formData.get("price")),
          stock: Number(formData.get("stock")),
        });
      }}
      className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-4 sm:grid-cols-2 xl:grid-cols-6"
    >
      <p className="break-all text-xs text-neutral-500 sm:col-span-2 xl:col-span-6">{product.id}</p>
      <label className="text-xs text-neutral-500 sm:col-span-2 xl:col-span-2">
        Name
        <input name="name" className={`${inputClass} mt-1`} defaultValue={product.name} />
      </label>
      <label className="text-xs text-neutral-500">
        Category
        <select name="category" className={`${inputClass} mt-1`} defaultValue={product.category}>
          {["Women", "Men", "Kids", "Accessories"].map((value) => <option key={value}>{value}</option>)}
        </select>
      </label>
      <label className="text-xs text-neutral-500">
        Price (INR)
        <input name="price" className={`${inputClass} mt-1`} type="number" min="0.01" step="0.01" defaultValue={product.price} />
      </label>
      <label className="text-xs text-neutral-500">
        Stock
        <input name="stock" className={`${inputClass} mt-1`} type="number" min="0" step="1" defaultValue={product.stock} />
      </label>
      <label className="text-xs text-neutral-500 sm:col-span-2 xl:col-span-4">
        Image URL
        <input name="image" className={`${inputClass} mt-1`} defaultValue={product.image} />
      </label>
      <label className="text-xs text-neutral-500 sm:col-span-2 xl:col-span-4">
        Description
        <textarea name="description" className={`${inputClass} mt-1 min-h-20`} defaultValue={product.description ?? ""} />
      </label>
      <div className="flex flex-wrap items-end gap-2">
        <button className={buttonClass} disabled={saving} type="submit">Save</button>
        <button
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100 disabled:opacity-50"
          disabled={saving}
          type="button"
          onClick={() => onSave({ isArchived: !product.isArchived })}
        >
          {product.isArchived ? "Restore" : "Archive"}
        </button>
      </div>
    </form>
  );
}

function Pagination({ page, pages, setPage }: { page: number; pages: number; setPage: (page: number) => void }) {
  if (pages <= 1) return null;
  return (
    <div className="mt-5 flex items-center justify-center gap-3">
      <button className="rounded-md border border-neutral-300 px-3 py-2 text-sm disabled:opacity-40" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
      <span className="text-sm text-neutral-600">Page {page} of {pages}</span>
      <button className="rounded-md border border-neutral-300 px-3 py-2 text-sm disabled:opacity-40" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}
