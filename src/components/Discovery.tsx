import { useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, MapPin, Search, Star, Clock, X } from "lucide-react";
import { categories, distanceFrom, locations, restaurants } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Img, rupee } from "./ui-bits";
import { cn } from "@/lib/utils";

const FILTERS = [
  { id: "rating", label: "Rating 4.3+" },
  { id: "veg", label: "Pure Veg" },
  { id: "near", label: "Within 5 km" },
  { id: "fast", label: "Under 30 min" },
  { id: "budget", label: "Under ₹500 for two" },
] as const;
const SORTS = { relevance: "Relevance", rating: "Rating", eta: "Delivery time", low: "Cost: low to high", high: "Cost: high to low" };

export function Discovery({ autoFocus = false }: { autoFocus?: boolean }) {
  const { location, setLocation } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [filters, setFilters] = useState<string[]>([]);
  const [sort, setSort] = useState<keyof typeof SORTS>("relevance");
  const rail = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = restaurants.map((r) => ({ r, dist: distanceFrom(r, location) }));
    list = list.filter(({ r, dist }) => {
      if (cat && !r.categories.includes(cat)) return false;
      if (filters.includes("rating") && r.rating < 4.3) return false;
      if (filters.includes("veg") && !r.pureVeg) return false;
      if (filters.includes("near") && dist > 5) return false;
      if (filters.includes("fast") && r.etaMin >= 30) return false;
      if (filters.includes("budget") && r.costForTwo >= 500) return false;
      if (!term) return true;
      return (
        r.name.toLowerCase().includes(term) ||
        r.cuisines.some((c) => c.toLowerCase().includes(term)) ||
        r.menu.some((m) => m.name.toLowerCase().includes(term))
      );
    });
    const s = [...list];
    if (sort === "rating") s.sort((a, b) => b.r.rating - a.r.rating);
    if (sort === "eta") s.sort((a, b) => a.r.etaMin - b.r.etaMin);
    if (sort === "low") s.sort((a, b) => a.r.costForTwo - b.r.costForTwo);
    if (sort === "high") s.sort((a, b) => b.r.costForTwo - a.r.costForTwo);
    return s;
  }, [q, cat, filters, sort, location]);

  const term = q.trim().toLowerCase();
  const toggle = (id: string) => setFilters((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  return (
    <div>
      <section className="bg-hero text-brand-foreground">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 md:pb-14 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-foreground/60">Delivering to {location}</p>
          <h1 className="mt-2 max-w-2xl font-display text-3xl font-bold leading-tight md:text-5xl">
            Great food, delivered — and we speak up before it's late.
          </h1>
          <div className="mt-6 flex flex-col gap-3 md:flex-row">
            <label className="flex items-center gap-2 rounded-2xl bg-card px-4 py-3 text-foreground md:w-64">
              <MapPin className="h-5 w-5 text-primary" />
              <select aria-label="Delivery location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-transparent font-medium outline-none">
                {locations.map((l) => <option key={l}>{l}</option>)}
              </select>
            </label>
            <label className="flex flex-1 items-center gap-2 rounded-2xl bg-card px-4 py-3 text-foreground">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input autoFocus={autoFocus} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for restaurant, dish or cuisine" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" />
              {q && <button aria-label="Clear search" onClick={() => setQ("")}><X className="h-4 w-4 text-muted-foreground" /></button>}
            </label>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold md:text-2xl">What are you craving?</h2>
          <div className="hidden gap-2 md:flex">
            <button aria-label="Scroll left" onClick={() => rail.current?.scrollBy({ left: -400, behavior: "smooth" })} className="rounded-full bg-muted p-2 hover:bg-accent"><ArrowLeft className="h-4 w-4" /></button>
            <button aria-label="Scroll right" onClick={() => rail.current?.scrollBy({ left: 400, behavior: "smooth" })} className="rounded-full bg-muted p-2 hover:bg-accent"><ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
        <div ref={rail} className="no-scrollbar mt-4 flex gap-4 overflow-x-auto pb-2">
          {categories.map((c) => (
            <button key={c.id} onClick={() => setCat(cat === c.id ? null : c.id)} className="group flex w-24 shrink-0 flex-col items-center gap-2 md:w-32">
              <div className={cn("h-24 w-24 overflow-hidden rounded-full ring-offset-2 ring-offset-background transition md:h-32 md:w-32", cat === c.id ? "ring-4 ring-primary" : "group-hover:ring-2 group-hover:ring-primary/40")}>
                <Img src={c.image} alt={c.name} className="h-full w-full" />
              </div>
              <span className={cn("text-sm font-medium", cat === c.id && "font-bold text-primary")}>{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
          <select aria-label="Sort by" value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)} className="shrink-0 rounded-full border bg-card px-4 py-2 text-sm font-medium">
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>Sort: {v}</option>)}
          </select>
          {FILTERS.map((f) => (
            <button key={f.id} onClick={() => toggle(f.id)} className={cn("shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition", filters.includes(f.id) ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary/50")}>
              {f.label}
            </button>
          ))}
          {(filters.length > 0 || cat || q) && (
            <button onClick={() => { setFilters([]); setCat(null); setQ(""); }} className="shrink-0 px-3 py-2 text-sm font-semibold text-primary">Clear all</button>
          )}
        </div>

        <h2 className="mt-6 font-display text-xl font-bold">
          {results.length} restaurant{results.length !== 1 && "s"} {cat && `for ${categories.find((c) => c.id === cat)?.name}`} {q && `matching "${q}"`}
        </h2>

        {results.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed p-10 text-center">
            <p className="font-semibold">No restaurants match these choices.</p>
            <p className="mt-1 text-sm text-muted-foreground">Try removing a filter or searching for something else.</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map(({ r, dist }) => {
              const dish = term ? r.menu.find((m) => m.name.toLowerCase().includes(term)) : undefined;
              return (
                <Link key={r.id} to="/restaurant/$id" params={{ id: r.id }} className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-card">
                  <div className="relative h-44">
                    <Img src={r.image} alt={r.name} className="h-full w-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand/90 via-brand/10 to-transparent" />
                    <div className="absolute inset-x-3 bottom-3 flex items-end justify-between text-brand-foreground">
                      <h3 className="font-display text-lg font-bold">{r.name}</h3>
                      <span className="flex items-center gap-1 rounded-md bg-success px-1.5 py-0.5 text-xs font-bold text-success-foreground"><Star className="h-3 w-3 fill-current" />{r.rating}</span>
                    </div>
                  </div>
                  <div className="space-y-2 p-4 text-sm">
                    <div className="flex justify-between text-muted-foreground"><span>{r.cuisines.join(" • ")}</span><span>{rupee(r.costForTwo)} for two</span></div>
                    <div className="flex justify-between text-muted-foreground"><span>{r.area}</span><span>{dist} km</span></div>
                    <div className="flex items-center gap-1 font-semibold"><Clock className="h-4 w-4 text-primary" />{r.etaMin}–{r.etaMin + 8} min</div>
                    {dish && <p className="text-xs text-primary">Serves: {dish.name}</p>}
                    {r.offers.map((o) => <div key={o} className="rounded-lg bg-success/15 px-3 py-1.5 text-xs font-semibold text-success-strong">{o}</div>)}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
