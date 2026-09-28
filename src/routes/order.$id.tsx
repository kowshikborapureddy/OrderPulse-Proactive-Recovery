import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, ShieldCheck, Check } from "lucide-react";
import { useNow, useStore } from "@/lib/store";
import { getStage, scenarioFor, STAGES, statusLabel } from "@/lib/recovery";
import { Loading, VegMark, rupee } from "@/components/ui-bits";
import { StatusPill } from "@/components/StatusPill";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/order/$id")({
  validateSearch: (s: Record<string, unknown>): { placed?: boolean } => (s['placed'] === true || s['placed'] === "true" ? { placed: true } : {}),
  head: ({ params }) => ({
    meta: [
      { title: `Order ${params.id} — OrderPulse` },
      { name: "description", content: "Track your OrderPulse delivery in real time (demo)." },
      { property: "og:title", content: "Track your order — OrderPulse" },
      { property: "og:description", content: "Track delivery stages and recovery options." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

const fmt = (t: number) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function OrderPage() {
  const { id } = Route.useParams();
  const { placed } = Route.useSearch();
  const { ready, orders } = useStore();
  const now = useNow();
  if (!ready) return <Loading />;
  const o = orders.find((x) => x.id === id);
  if (!o)
    return <div className="p-10 text-center"><p className="font-semibold">We couldn't find order {id} in this browser.</p><Link to="/orders" className="mt-3 inline-block text-primary">View my orders</Link></div>;

  const stage = getStage(o, now);
  const sc = scenarioFor(o);
  const status = statusLabel(o, now);
  const atRisk = !!o.risk && !o.recovery && stage < 4;
  const revised = sc?.revisedEtaMinutes && o.risk ? o.risk.detectedAt + sc.revisedEtaMinutes * 60000 : null;

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      {placed && (
        <div className="flex items-center gap-3 rounded-2xl bg-success/15 p-4 text-success-strong">
          <CheckCircle2 className="h-6 w-6" />
          <div><p className="font-bold">Demo order placed!</p><p className="text-sm">Order ID {o.id}. No payment was taken.</p></div>
        </div>
      )}

      {atRisk && (
        <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 shrink-0 text-warning" />
            <div className="flex-1">
              <p className="font-bold text-warning">Early warning: your delivery may be delayed</p>
              <p className="text-sm">{sc?.title}. See what happened and choose what you'd like to do.</p>
            </div>
          </div>
          <Link to="/recovery/$id" params={{ id: o.id }} className="mt-3 block rounded-xl bg-warning py-2.5 text-center font-bold text-warning-foreground">Review recovery options</Link>
        </div>
      )}

      <div className="rounded-2xl border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Order {o.id}</p>
            <h1 className="font-display text-2xl font-bold">{o.restaurantName}</h1>
          </div>
          <StatusPill s={status} />
        </div>
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <p><span className="text-muted-foreground">Placed:</span> {fmt(o.placedAt)}</p>
          <p>
            <span className="text-muted-foreground">Estimated delivery:</span>{" "}
            {o.risk && !revised ? <span className="font-semibold text-warning">Awaiting update from restaurant</span> : <b>{fmt(revised ?? o.placedAt + o.etaMinutes * 60000)}</b>}
            {revised && <span className="ml-1 text-xs text-muted-foreground">(revised by dispatch)</span>}
          </p>
        </div>

        <ol className="mt-6 space-y-0">
          {STAGES.map((s, i) => {
            const done = i < stage || stage === 4;
            const current = i === stage && stage < 4;
            const frozen = current && atRisk;
            return (
              <li key={s} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className={cn("flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold", done && "border-success bg-success text-success-foreground", current && !frozen && "border-primary bg-primary text-primary-foreground animate-pulse", frozen && "border-warning bg-warning text-warning-foreground", !done && !current && "border-border text-muted-foreground")}>
                    {done ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  {i < 4 && <span className={cn("h-8 w-0.5", done ? "bg-success" : "bg-border")} />}
                </div>
                <p className={cn("pt-1 font-medium", !done && !current && "text-muted-foreground", frozen && "text-warning")}>{s}{frozen && " — delay detected"}</p>
              </li>
            );
          })}
        </ol>
        <p className="text-xs text-muted-foreground">Demo tracking: stages advance automatically every 25 seconds.</p>

        <Link to="/recovery/$id" params={{ id: o.id }} className="mt-5 flex items-center justify-center gap-2 rounded-xl border-2 border-primary py-3 font-bold text-primary hover:bg-primary hover:text-primary-foreground">
          <ShieldCheck className="h-5 w-5" /> Open OrderPulse Recovery
        </Link>
      </div>

      <div className="rounded-2xl border bg-card p-5">
        <h2 className="font-display font-bold">Items</h2>
        <div className="mt-3 space-y-2">
          {o.items.map((i) => (
            <div key={i.id} className="flex items-center gap-2 text-sm"><VegMark veg={i.veg} /><span className="flex-1">{i.qty} × {i.name}</span><span>{rupee(i.qty * i.price)}</span></div>
          ))}
        </div>
        <div className="mt-3 space-y-1 border-t pt-3 text-sm text-muted-foreground">
          <p className="flex justify-between"><span>Delivery fee</span><span>{rupee(o.deliveryFee)}</span></p>
          <p className="flex justify-between"><span>Platform fee + GST</span><span>{rupee(o.platformFee + o.taxes)}</span></p>
          <p className="flex justify-between text-base font-bold text-foreground"><span>Total</span><span>{rupee(o.total)}</span></p>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">Delivering to {o.customer.name}, {o.customer.address} · {o.customer.phone}</p>
      </div>
    </div>
  );
}
