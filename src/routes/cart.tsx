import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingBag, Info } from "lucide-react";
import { bill, getRestaurant, PRICING } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Loading, Stepper, VegMark, rupee } from "@/components/ui-bits";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — OrderPulse" },
      { name: "description", content: "Review your items and place a demo order on OrderPulse." },
      { property: "og:title", content: "Cart — OrderPulse" },
      { property: "og:description", content: "Review your items and place a demo order." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { ready, cart, setQty, placeOrder, clearCart, location } = useStore();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!ready) return <Loading />;
  const r = cart.restaurantId ? getRestaurant(cart.restaurantId) : undefined;
  const lines = r ? r.menu.filter((m) => cart.items[m.id]) : [];

  if (!r || !lines.length)
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-1 text-muted-foreground">Browse restaurants and add something delicious.</p>
        <Link to="/" className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground">Find food</Link>
      </div>
    );

  const b = bill(lines.reduce((a, m) => a + m.price * (cart.items[m.id] ?? 0), 0));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (form.name.trim().length < 2) er["name"] = "Please enter your name.";
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) er["phone"] = "Enter a 10-digit phone number.";
    if (form.address.trim().length < 10) er["address"] = "Enter a full delivery address (at least 10 characters).";
    setErrors(er);
    if (Object.keys(er).length) return;
    setSubmitting(true);
    setTimeout(() => {
      const id = placeOrder({ name: form.name.trim(), phone: form.phone.replace(/\s/g, ""), address: form.address.trim() });
      nav({ to: "/order/$id", params: { id }, search: { placed: true } });
    }, 600);
  };

  const field = (k: keyof typeof form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input {...props} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className={`mt-1 w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary ${errors[k] ? "border-warning" : ""}`} />
      {errors[k] && <span className="mt-1 block text-xs font-medium text-warning">{errors[k]}</span>}
    </label>
  );

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 md:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Ordering from</p>
              <Link to="/restaurant/$id" params={{ id: r.id }} className="font-display text-xl font-bold hover:text-primary">{r.name}</Link>
            </div>
            <button onClick={clearCart} className="text-sm font-semibold text-muted-foreground hover:text-warning">Clear cart</button>
          </div>
          <div className="mt-4 divide-y">
            {lines.map((m) => (
              <div key={m.id} className="flex items-center gap-3 py-3">
                <VegMark veg={m.veg} />
                <div className="flex-1"><p className="font-medium">{m.name}</p><p className="text-sm text-muted-foreground">{rupee(m.price)} each</p></div>
                <Stepper qty={cart.items[m.id] ?? 0} onChange={(n) => setQty(r.id, m, n)} />
                <span className="w-16 text-right font-semibold">{rupee(m.price * (cart.items[m.id] ?? 0))}</span>
              </div>
            ))}
          </div>
        </div>

        <form id="checkout" onSubmit={submit} className="space-y-4 rounded-2xl border bg-card p-5" noValidate>
          <h2 className="font-display text-lg font-bold">Delivery details</h2>
          {field("name", "Full name", { autoComplete: "name" })}
          {field("phone", "Phone number", { inputMode: "numeric", placeholder: "10-digit mobile number", autoComplete: "tel" })}
          {field("address", "Delivery address", { placeholder: `House no., street, ${location}` })}
        </form>
      </div>

      <aside className="h-fit space-y-4 rounded-2xl border bg-card p-5 md:sticky md:top-20">
        <h2 className="font-display text-lg font-bold">Bill details</h2>
        <Row l="Item total" v={rupee(b.subtotal)} />
        <Row l={`Delivery fee${b.deliveryFee === 0 ? " (free)" : ""}`} v={rupee(b.deliveryFee)} />
        {b.deliveryFee > 0 && <p className="-mt-2 text-xs text-muted-foreground">Add {rupee(PRICING.freeDeliveryAbove - b.subtotal)} more for free delivery</p>}
        <Row l="Platform fee" v={rupee(b.platformFee)} />
        <Row l="GST (5%)" v={rupee(b.taxes)} />
        <div className="border-t pt-3"><Row l="To pay" v={rupee(b.total)} bold /></div>
        <div className="flex gap-2 rounded-xl bg-accent p-3 text-xs text-accent-foreground">
          <Info className="h-4 w-4 shrink-0" /> Demo checkout — no payment is collected or processed.
        </div>
        <button form="checkout" disabled={submitting} className="w-full rounded-xl bg-primary py-3.5 font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
          {submitting ? "Placing order…" : `Place demo order · ${rupee(b.total)}`}
        </button>
      </aside>
    </div>
  );
}

const Row = ({ l, v, bold }: { l: string; v: string; bold?: boolean }) => (
  <div className={`flex justify-between text-sm ${bold ? "text-base font-bold" : ""}`}><span className={bold ? "" : "text-muted-foreground"}>{l}</span><span>{v}</span></div>
);
