// Centralized handler for SIMULATED demo delivery events.
// No live restaurant/rider feed is connected — every event is demo-generated.
import { getStage, scenarios, type Order } from "./recovery";

export const ETA_ALERT_THRESHOLD_MIN = 15;

export type DemoEvent =
  | { id: string; source: "demo-simulated"; type: "eta_update"; newEtaMinutes: number; label: string }
  | { id: string; source: "demo-simulated"; type: "serious_problem"; problem: string; scenarioId: string; label: string };

export type HandleResult = { order: Order; alerted: boolean; reason: string };

const DEMO = "[Simulated demo event] ";

export function handleDeliveryEvent(o: Order, ev: DemoEvent, now: number): HandleResult {
  const seen = o.seenEventIds ?? [];
  if (seen.includes(ev.id)) return { order: o, alerted: false, reason: "duplicate event ignored" };
  if (o.recovery?.action === "cancel" || getStage(o, now) === 4)
    return { order: o, alerted: false, reason: "order not active" };

  const base: Order = { ...o, seenEventIds: [...seen, ev.id] };

  if (ev.type === "eta_update") {
    const prev = o.verifiedEtaMinutes ?? o.etaMinutes;
    const delta = ev.newEtaMinutes - prev;
    const next: Order = {
      ...base,
      verifiedEtaMinutes: ev.newEtaMinutes,
      events: [...o.events, { at: now, label: `${DEMO}${ev.label} (ETA ${prev}→${ev.newEtaMinutes} min)`, kind: "info" }],
    };
    if (delta < ETA_ALERT_THRESHOLD_MIN) return { order: next, alerted: false, reason: `minor ETA change (${delta} min), no alert` };
    next.events = [...next.events, { at: now, label: `Delivery risk detected: ETA +${delta} min`, kind: "risk" }];
    next.alerts = [...(o.alerts ?? []), { key: `eta:${ev.id}`, at: now }];
    if (!o.risk) next.risk = { scenarioId: "kitchen-backlog", detectedAt: now, frozenStage: getStage(o, now) };
    return { order: next, alerted: true, reason: `ETA delay ${delta} min ≥ ${ETA_ALERT_THRESHOLD_MIN}` };
  }

  // Serious problem: alert regardless of ETA, once per problem type.
  const key = `problem:${ev.problem}`;
  const withEvent: Order = { ...base, events: [...o.events, { at: now, label: DEMO + ev.label, kind: "info" }] };
  if ((o.alerts ?? []).some((a) => a.key === key))
    return { order: withEvent, alerted: false, reason: "problem already alerted" };
  const sc = scenarios.find((s) => s.id === ev.scenarioId);
  return {
    order: {
      ...withEvent,
      alerts: [...(o.alerts ?? []), { key, at: now }],
      risk: o.risk ?? { scenarioId: ev.scenarioId, detectedAt: now, frozenStage: getStage(o, now) },
      events: [...withEvent.events, { at: now, label: "Delivery risk detected: " + (sc?.title ?? ev.problem), kind: "risk" }],
    },
    alerted: true,
    reason: "new serious problem",
  };
}

// Demo scenario → one simulated serious-problem event (used by the demo delay button).
export function scenarioEvent(scenarioId: string, orderId: string): DemoEvent | null {
  const sc = scenarios.find((s) => s.id === scenarioId);
  if (!sc) return null;
  return { id: `${orderId}:${sc.id}`, source: "demo-simulated", type: "serious_problem", problem: sc.id, scenarioId: sc.id, label: sc.events.join(" · ") };
}
