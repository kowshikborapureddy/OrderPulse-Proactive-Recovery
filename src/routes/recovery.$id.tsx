import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Bot, CheckCircle2, Clock, Headphones, Radar, RefreshCw, XCircle, ArrowLeft } from "lucide-react";
import { useNow, useStore } from "@/lib/store";
import { availableOptions, getStage, refundPolicy, scenarioFor, scenarios, STAGES, type RecoveryAction } from "@/lib/recovery";
import { Loading } from "@/components/ui-bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recovery/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Recovery for ${params.id} — OrderPulse` },
      { name: "description", content: "Proactive delivery recovery: see risks early and choose what happens next." },
      { property: "og:title", content: "OrderPulse Recovery" },
      { property: "og:description", content: "AI recommends. Policy controls. Customer decides." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RecoveryPage,
});

const FLOW = ["Monitor", "Detect", "Warn", "Explain", "Options", "Choose", "Track"];
const ICONS: Record<RecoveryAction, typeof Clock> = { wait: Clock, replace: RefreshCw, cancel: XCircle, support: Headphones };
const CONFIRM: Record<RecoveryAction, string> = {
  wait: "We're monitoring your order and tracking has resumed.",
  replace: "Your replacement request has been sent to the restaurant. It isn't final until they confirm.",
  cancel: "Your cancellation request has been sent. The order is not cancelled until the restaurant confirms.",
  support: "A support agent will contact you on your phone number. You can still choose another option below.",
};

function RecoveryPage() {
  const { id } = Route.useParams();
  const { ready, orders, triggerDelay, chooseRecovery, simulateEtaDelay } = useStore();
  const now = useNow();
  const [pending, setPending] = useState<RecoveryAction | null>(null);
  const [justChose, setJustChose] = useState<RecoveryAction | null>(null);

  if (!ready) return <Loading />;
  const o = orders.find((x) => x.id === id);
  if (!o) return <div className="p-10 text-center">Order not found. <Link to="/orders" className="text-primary">My orders</Link></div>;

  const stage = getStage(o, now);
  const sc = scenarioFor(o);
  const applicable = scenarios.find((s) => s.appliesToStages.includes(stage));
  const step = !o.risk ? 0 : o.recovery ? 6 : 4;
  const opts = o.risk ? availableOptions(o) : [];
  const recommended: RecoveryAction = sc?.revisedEtaMinutes ? "wait" : sc?.replacement ? "replace" : "wait";

  const confirm = () => {
    if (!pending) return;
    chooseRecovery(o.id, pending);
    setJustChose(pending);
    setPending(null);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      <Link to="/order/$id" params={{ id: o.id }} className="inline-flex items-center gap-1 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4" />Back to tracking</Link>
      <div className="rounded-3xl bg-hero p-6 text-brand-foreground">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-foreground/60">OrderPulse Recovery · {o.id}</p>
        <h1 className="mt-1 font-display text-2xl font-bold">{o.restaurantName}</h1>
        <p className="mt-1 text-sm text-brand-foreground/75">AI recommends. Policy controls. You decide.</p>
        <div className="no-scrollbar mt-5 flex gap-1 overflow-x-auto">
          {FLOW.map((f, i) => (
            <span key={f} className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-semibold", i <= step ? (o.risk && !o.recovery && i >= 1 ? "bg-warning text-warning-foreground" : "bg-primary") : "bg-brand-foreground/10 text-brand-foreground/60")}>{i + 1}. {f}</span>
          ))}
        </div>
      </div>

      {!o.risk && (
        <div className="space-y-4 rounded-2xl border bg-card p-5">
          <div className="flex items-center gap-3"><Radar className="h-6 w-6 text-success" /><div><p className="font-bold">Monitoring your order</p><p className="text-sm text-muted-foreground">Current stage: {STAGES[stage]}. No delivery risk detected.</p></div></div>
          <div className="rounded-xl border border-dashed p-4">
            <p className="text-sm font-semibold">Demo controls</p>
            {applicable ? (
              <>
                <p className="mt-1 text-sm text-muted-foreground">Simulate a delay scenario for the current stage: <b>{applicable.title}</b>.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => triggerDelay(o.id, now)} className="rounded-xl bg-warning px-4 py-2.5 text-sm font-bold text-warning-foreground">Trigger demo delivery delay</button>
                  <button onClick={() => simulateEtaDelay(o.id, 20)} className="rounded-xl border border-warning px-4 py-2.5 text-sm font-bold text-warning">Simulate +20 min ETA delay</button>
                  <button onClick={() => simulateEtaDelay(o.id, 5)} className="rounded-xl border px-4 py-2.5 text-sm font-semibold">Simulate +5 min (minor, no alert)</button>
                </div>
              </>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">This order has been delivered — no delay can be simulated. Place a new order to try it.</p>
            )}
          </div>
        </div>
      )}

      {o.risk && sc && (
        <>
          <div className="rounded-2xl border border-warning/40 bg-warning/10 p-5">
            <div className="flex items-center gap-2 font-bold text-warning"><AlertTriangle className="h-5 w-5" />Delivery risk detected at "{STAGES[o.risk.frozenStage]}"</div>
            <p className="mt-1 text-sm">Detected {new Date(o.risk.detectedAt).toLocaleTimeString()} · {sc.title}</p>
            <p className="mt-2 text-sm">
              Revised ETA: {sc.revisedEtaMinutes ? <b>about {sc.revisedEtaMinutes} min (simulated dispatch estimate)</b> : o.verifiedEtaMinutes ? <b>about {o.verifiedEtaMinutes} min (simulated demo ETA update)</b> : <b>not yet available — we won't guess.</b>}
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 font-display font-bold"><Bot className="h-5 w-5 text-violet" />What happened</h2>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Demo explanation · no live AI</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed">{sc.explanation}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Delivery events</p>
            <ul className="mt-2 space-y-1.5">
              {o.events.map((e, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", e.kind === "risk" ? "bg-warning" : e.kind === "success" ? "bg-success" : "bg-primary")} />
                  <span className="text-muted-foreground">{new Date(e.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  <span>{e.label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">This explanation is a predefined demo scenario. No real AI model or live courier feed is connected.</p>
          </div>

          {o.recovery && (
            <div data-testid="recovery-result" className="rounded-2xl bg-success/15 p-5 text-success-strong">
              <div className="flex items-center gap-2 font-bold"><CheckCircle2 className="h-5 w-5" />{o.recovery.action === "cancel" ? "Cancellation request submitted (demo)" : "Choice recorded"} · Ref {o.recovery.ref}</div>
              <p className="mt-1 text-sm">{CONFIRM[o.recovery.action]}</p>
              {o.recovery.action === "cancel" && <p className="mt-2 text-sm">{refundPolicy(o).text} No real refund or payment is processed in this demo.</p>}
              {o.recovery.action === "wait" && <p className="mt-2 text-sm">Order still active · monitoring simulated events · current stage: <b>{STAGES[stage]}</b></p>}
              {o.recovery.action === "wait" && stage < 4 && (
                <button onClick={() => simulateEtaDelay(o.id, 20)} className="mt-3 mr-2 rounded-xl border border-warning px-4 py-2 text-sm font-bold text-warning">Simulate another +20 min ETA delay</button>
              )}
              <Link to="/order/$id" params={{ id: o.id }} className="mt-3 inline-block rounded-xl bg-success px-4 py-2 text-sm font-bold text-success-foreground">Track order</Link>
            </div>
          )}

          {o.supportHandoff && (
            <div data-testid="support-handoff" className="rounded-2xl border bg-card p-5">
              <div className="flex items-center gap-2 font-bold"><Headphones className="h-5 w-5 text-primary" />Demo support handoff · Ref {o.supportHandoff.ref}</div>
              <dl className="mt-2 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-sm">
                <dt className="text-muted-foreground">Order ID</dt><dd className="font-semibold">{o.supportHandoff.orderId}</dd>
                <dt className="text-muted-foreground">Delivery issue</dt><dd>{o.supportHandoff.issue}</dd>
                <dt className="text-muted-foreground">Created</dt><dd>{new Date(o.supportHandoff.at).toLocaleString()}</dd>
              </dl>
              <p className="mt-2 text-xs text-muted-foreground">Demo only — no real support agent is notified.</p>
            </div>
          )}

          {stage === 4 && !o.recovery && <p className="rounded-2xl border p-4 text-sm text-muted-foreground">This order has been delivered — recovery actions are no longer available.</p>}

          {!o.recovery && stage < 4 && (
            <div className="space-y-3">
              <h2 className="font-display text-lg font-bold">Your options</h2>
              <p className="text-sm text-muted-foreground">Only options allowed by the demo policy for this situation are shown. Nothing happens until you confirm.</p>
              {opts.map((op) => {
                const Icon = ICONS[op.action];
                const done = op.action === "support" && o.supportRef;
                return (
                  <button key={op.action} disabled={!!done} onClick={() => setPending(op.action)} className={cn("flex w-full items-start gap-3 rounded-2xl border bg-card p-4 text-left transition hover:border-primary disabled:opacity-60", pending === op.action && "border-primary ring-2 ring-primary/30")}>
                    <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", op.action === "cancel" ? "text-warning" : "text-primary")} />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold">{op.title}</span>
                        {op.action === recommended && <span className="rounded-full bg-violet/15 px-2 py-0.5 text-[10px] font-bold uppercase text-violet">Suggested</span>}
                        {done && <span className="text-xs text-success-strong">Ticket {o.supportRef}</span>}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{op.detail}</p>
                    </div>
                  </button>
                );
              })}
              {pending && (
                <div className="sticky bottom-20 flex flex-col gap-2 rounded-2xl border-2 border-primary bg-card p-4 shadow-card sm:flex-row sm:items-center md:bottom-4">
                  <p className="flex-1 text-sm font-semibold">Confirm: {opts.find((x) => x.action === pending)?.title}?</p>
                  <button onClick={() => setPending(null)} className="rounded-xl border px-4 py-2 text-sm font-semibold">Go back</button>
                  <button onClick={confirm} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Confirm choice</button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
