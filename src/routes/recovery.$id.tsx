import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Bot, CheckCircle2, ChevronDown, Clock, Headphones, Radar, RefreshCw, XCircle, ArrowLeft } from "lucide-react";
import { useNow, useStore } from "@/lib/store";
import { canRecover, availableOptions, getStage, refundPolicy, scenarioFor, scenarios, STAGES, type RecoveryAction } from "@/lib/recovery";
import { Loading } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
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
  wait: "Decision saved: continue_waiting. Your order stays active and we keep monitoring simulated events.",
  replace: "Your replacement request was saved in this demo (decision: replacement_requested). No real restaurant is connected.",
  cancel: "Your cancellation request was saved in this demo. The order is not actually cancelled — no restaurant is connected.",
  support: "A demo support handoff was created with your order ID and issue. You can still choose another option below.",
};

function RecoveryPage() {
  const { id } = Route.useParams();
  const { ready, orders, triggerDelay, chooseRecovery, simulateEtaDelay } = useStore();
  const now = useNow();
  const [pending, setPending] = useState<RecoveryAction | null>(null);

  if (!ready) return <Loading />;
  const o = orders.find((x) => x.id === id);
  if (!o) return <div className="p-10 text-center">Order not found. <Link to="/orders" className="text-primary">My orders</Link></div>;

  const stage = getStage(o, now);
  const sc = scenarioFor(o);
  const applicable = scenarios.find((s) => s.appliesToStages.includes(stage));
  const opts = o.risk ? availableOptions(o) : [];
  const recommended = sc?.recommendedAction ?? "wait";

  const confirm = () => {
    if (!pending || !canRecover(o, Date.now(), pending)) return setPending(null);
    chooseRecovery(o.id, pending);
    setPending(null);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      <Link to="/order/$id" params={{ id: o.id }} className="inline-flex items-center gap-1 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4" />Back to tracking</Link>
      <div className="rounded-3xl bg-hero p-6 text-brand-foreground">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-foreground/60">OrderPulse Recovery · {o.id}</p>
        <h1 className="mt-1 font-display text-2xl font-bold">{o.restaurantName}</h1>
        <p className="mt-1 text-sm text-brand-foreground/75">AI recommends. Policy controls. Customer decides.</p>
      </div>

      {!o.risk && (
        <div className="space-y-4 rounded-2xl border bg-card p-5">
          <div className="flex items-center gap-3"><Radar className="h-6 w-6 text-success" /><div><p className="font-bold">We’re monitoring your order</p><p className="text-sm text-muted-foreground">Current stage: {STAGES[stage]}. We’ll alert you automatically if a meaningful delivery risk appears.</p></div></div>
          <p className="text-xs text-muted-foreground">Demo monitoring uses simulated events. No live restaurant or courier connection is active.</p>
        </div>
      )}

      {o.risk && sc && (
        <>
          <div className="rounded-2xl border border-warning/40 bg-warning/10 p-5">
            <div className="flex items-center gap-2 font-bold text-warning"><AlertTriangle className="h-5 w-5" />Your order may be delayed</div>
            <p className="mt-2 text-sm">{sc.customerSummary}</p>
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
          </div>

          {!o.recovery && stage < 4 && (
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-violet">OrderPulse recommendation</p>
              <h2 className="mt-1 font-display text-lg font-bold">{opts.find((option) => option.action === recommended)?.title ?? "Keep waiting"}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{sc.recommendationReason}</p>
              <p className="mt-3 text-xs text-muted-foreground">Demo recommendation only — no live AI is connected. The choice remains yours.</p>
            </div>
          )}

          {o.recovery && (
            <div data-testid="recovery-result" className="rounded-2xl bg-success/15 p-5 text-success-strong">
              <div className="flex items-center gap-2 font-bold"><CheckCircle2 className="h-5 w-5" />{o.recovery.action === "cancel" ? "Cancellation request submitted (demo)" : "Choice recorded"} · Ref {o.recovery.ref}</div>
              <p className="mt-1 text-sm">{CONFIRM[o.recovery.action]}</p>
              {o.recovery.action === "replace" && <p className="mt-2 text-sm">Requested: {sc.replacement} — pending simulated restaurant confirmation. Nothing is final yet.</p>}
              {o.recovery.action === "cancel" && <p className="mt-2 text-sm">{refundPolicy(o).text} No real refund or payment is processed in this demo.</p>}
              {o.recovery.action === "wait" && <p className="mt-2 text-sm">Order still active · monitoring simulated events · current stage: <b>{STAGES[stage]}</b></p>}
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

          {o.cancelDenied && (
            <div data-testid="cancel-denied" className="rounded-2xl border border-warning/40 bg-warning/10 p-5 text-sm">
              <p className="font-bold text-warning">Cancellation not eligible (demo policy)</p>
              <p className="mt-1">{o.cancelDenied.reason}</p>
            </div>
          )}

          {stage === 4 && !o.recovery && <p className="rounded-2xl border p-4 text-sm text-muted-foreground">This order has been delivered — recovery actions are no longer available.</p>}

          {!o.recovery && stage < 4 && (
            <div className="space-y-3">
              <h2 className="font-display text-lg font-bold">Your available choices</h2>
              <p className="text-sm text-muted-foreground">Demo policy has already checked which choices apply. Nothing happens until you confirm.</p>
              {opts.map((op) => {
                const Icon = ICONS[op.action];
                return (
                  <Button key={op.action} variant="outline" onClick={() => setPending(op.action)} className={cn("h-auto w-full items-start justify-start whitespace-normal rounded-2xl bg-card p-4 text-left", pending === op.action && "border-primary ring-2 ring-primary/30")}>
                    <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", op.action === "cancel" ? "text-warning" : "text-primary")} />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold">{op.title}</span>
                        {op.action === recommended && <span className="rounded-full bg-violet/15 px-2 py-0.5 text-[10px] font-bold uppercase text-violet">Suggested</span>}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{op.detail}</p>
                    </div>
                  </Button>
                );
              })}
              {pending && (
                <div className="sticky bottom-20 flex flex-col gap-2 rounded-2xl border-2 border-primary bg-card p-4 shadow-card sm:flex-row sm:items-center md:bottom-4">
                  <div className="flex-1 text-sm"><p className="font-semibold">Confirm: {opts.find((x) => x.action === pending)?.title}?</p>{pending === "cancel" && <p data-testid="cancel-eligibility" className="mt-1 text-muted-foreground">Demo policy check: eligible for a full refund once confirmed (simulated).</p>}</div>
                  <Button variant="outline" onClick={() => setPending(null)}>Go back</Button>
                  <Button onClick={confirm}>Confirm choice</Button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <details className="group rounded-2xl border bg-card p-5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-display font-bold">
          <span>How OrderPulse handled this</span>
          <ChevronDown className="h-5 w-5 text-muted-foreground transition group-open:rotate-180" />
        </summary>
        <div className="mt-4 space-y-4 border-t pt-4">
          <div className="no-scrollbar flex gap-1 overflow-x-auto">
            {FLOW.map((item, index) => (
              <span key={item} className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-semibold", !o.risk && index === 0 ? "bg-primary text-primary-foreground" : o.risk ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{index + 1}. {item}</span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Monitoring, risk detection, policy checks, option evaluation, and continued tracking run automatically in this browser-based demo.</p>
          {o.risk && (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Simulated delivery events</p>
              <ul className="space-y-1.5">
                {o.events.map((event, index) => (
                  <li key={`${event.at}-${index}`} className="flex gap-2 text-sm">
                    <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", event.kind === "risk" ? "bg-warning" : event.kind === "success" ? "bg-success" : "bg-primary")} />
                    <span className="text-muted-foreground">{new Date(event.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    <span>{event.label}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {stage < 4 && (
            <div className="rounded-xl border border-dashed p-4">
              <p className="text-sm font-semibold">Demo simulator</p>
              <p className="mt-1 text-xs text-muted-foreground">Optional case-study controls only. Customer monitoring does not require these buttons.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {!o.risk && applicable && <Button variant="secondary" onClick={() => triggerDelay(o.id, now)}>Simulate {applicable.title.toLowerCase()}</Button>}
                {!o.risk && <Button variant="outline" onClick={() => simulateEtaDelay(o.id, 20)}>Simulate +20 min ETA</Button>}
                {!o.risk && <Button variant="outline" onClick={() => simulateEtaDelay(o.id, 5)}>Simulate minor +5 min</Button>}
                {o.recovery?.action === "wait" && <Button variant="outline" onClick={() => simulateEtaDelay(o.id, 20)}>Simulate another +20 min ETA</Button>}
              </div>
            </div>
          )}
          <p className="text-xs text-muted-foreground">Demo only: no live AI, restaurant inventory, courier feed, payment or refund processing, or support integration.</p>
        </div>
      </details>
    </div>
  );
}
