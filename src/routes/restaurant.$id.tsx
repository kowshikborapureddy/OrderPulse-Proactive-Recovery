import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, MapPin, Star, ShoppingBag } from "lucide-react";
import { distanceFrom, getRestaurant, bill } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Img, Stepper, VegMark, rupee } from "@/components/ui-bits";
import { useState } from "react";

export const Route = createFileRoute("/restaurant/$id")({
  loader: ({ params }) => {
    const r = getRestaurant(params.id);
    if (!r) throw notFound();
    return { name: r.name, cuisines: r.cuisines.join(", ") };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} menu — OrderPulse` },
          { name: "description", content: `Order ${loaderData.cuisines} from ${loaderData.name} on OrderPulse.` },
          { property: "og:title", content: `${loaderData.name} — OrderPulse` },
          { property: "og:description", content: `Order ${loaderData.cuisines} from ${loaderData.name}.` },
        ]
      : [{ title: "Restaurant not found — OrderPulse" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="p-10 text-center"><p className="font-semibold">Restaurant not found.</p><Link to="/" className="mt-3 inline-block text-primary">Back to restaurants</Link></div>
  ),
  errorComponent: () => <div className="p-10 text-center">Couldn't load this menu.</div>,
  component: RestaurantPage,
});

function RestaurantPage() {
  const { id } = Route.useParams();
  const r = getRestaurant(id)!;
  const { cart, setQty, location } = useStore();
  const [vegOnly, setVegOnly] = useState(false);
  const sections = [...new Set(r.menu.map((m) => m.section))];
  const inCart = cart.restaurantId === r.id;
  const sub = inCart ? r.menu.reduce((a, m) => a + (cart.items[m.id] ?? 0) * m.price, 0) : 0;
  const count = inCart ? Object.values(cart.items).reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 pb-32 pt-6">
      <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        <Img src={r.image} alt={r.name} className="h-48 w-full md:h-64" />
        <div className="space-y-2 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold md:text-3xl">{r.name}</h1>
              <p className="text-muted-foreground">{r.cuisines.join(" • ")}</p>
            </div>
            <span className="flex items-center gap-1 rounded-lg bg-success px-2 py-1 text-sm font-bold text-success-foreground"><Star className="h-4 w-4 fill-current" />{r.rating}</span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{r.area} · {distanceFrom(r, location)} km</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{r.etaMin}–{r.etaMin + 8} min</span>
            <span>{rupee(r.costForTwo)} for two</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">{r.offers.map((o) => <span key={o} className="rounded-lg bg-success/15 px-3 py-1 text-xs font-semibold text-success-strong">{o}</span>)}</div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Menu</h2>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} className="h-4 w-4 accent-primary" /> Veg only
        </label>
      </div>

      {sections.map((s) => {
        const list = r.menu.filter((m) => m.section === s && (!vegOnly || m.veg));
        if (!list.length) return null;
        return (
          <section key={s} className="mt-6">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">{s}</h3>
            <div className="divide-y rounded-2xl border bg-card">
              {list.map((m) => {
                const qty = inCart ? cart.items[m.id] ?? 0 : 0;
                return (
                  <div key={m.id} className="flex gap-4 p-4">
                    <div className="flex-1 space-y-1">
                      <VegMark veg={m.veg} />
                      <h4 className="font-semibold">{m.name}</h4>
                      <p className="font-semibold">{rupee(m.price)}</p>
                      <p className="text-sm text-muted-foreground">{m.description}</p>
                      {!m.available && <p className="text-xs font-semibold text-warning">Currently unavailable</p>}
                    </div>
                    <div className="relative flex w-32 shrink-0 flex-col items-center">
                      <Img src={m.image} alt={m.name} className={`h-28 w-32 rounded-xl ${!m.available ? "grayscale" : ""}`} />
                      <div className="-mt-5"><Stepper qty={qty} disabled={!m.available} onChange={(n) => setQty(r.id, m, n)} /></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {count > 0 && (
        <div className="fixed inset-x-0 bottom-16 z-30 px-4 md:bottom-6">
          <Link to="/cart" className="mx-auto flex max-w-4xl items-center justify-between rounded-2xl bg-primary px-5 py-4 text-primary-foreground shadow-card">
            <span className="font-semibold">{count} item{count > 1 && "s"} · {rupee(sub)} <span className="text-sm opacity-75">(total {rupee(bill(sub).total)} incl. fees)</span></span>
            <span className="flex items-center gap-2 font-bold"><ShoppingBag className="h-5 w-5" />View cart</span>
          </Link>
        </div>
      )}
    </div>
  );
}
