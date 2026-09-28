import { createFileRoute, Link } from "@tanstack/react-router";
import { Receipt, ChevronRight } from "lucide-react";
import { useNow, useStore } from "@/lib/store";
import { statusLabel } from "@/lib/recovery";
import { Loading, rupee } from "@/components/ui-bits";
import { StatusPill } from "@/components/StatusPill";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My orders — OrderPulse" },
      { name: "description", content: "Track your OrderPulse orders and recovery status." },
      { property: "og:title", content: "My orders — OrderPulse" },
      { property: "og:description", content: "Track your orders and recovery status." },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const { ready, orders, resetDemo } = useStore();
  const now = useNow(2000);
  if (!ready) return <Loading />;
  if (!orders.length)
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <Receipt className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 font-display text-2xl font-bold">No orders yet</h1>
        <p className="mt-1 text-muted-foreground">Your demo orders will appear here.</p>
        <Link to="/" className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground">Start ordering</Link>
      </div>
    );
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">My orders</h1>
        <button onClick={() => window.confirm("Delete all demo orders and cart from this browser?") && resetDemo()} className="text-sm font-semibold text-muted-foreground hover:text-warning">Reset demo data</button>
      </div>
      <div className="mt-4 space-y-3">
        {orders.map((o) => (
          <Link key={o.id} to="/order/$id" params={{ id: o.id }} className="flex items-center gap-4 rounded-2xl border bg-card p-4 hover:border-primary/50">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2"><span className="font-display font-bold">{o.restaurantName}</span><StatusPill s={statusLabel(o, now)} /></div>
              <p className="text-sm text-muted-foreground">{o.id} · {new Date(o.placedAt).toLocaleString()} · {o.items.reduce((a, i) => a + i.qty, 0)} items · {rupee(o.total)}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
