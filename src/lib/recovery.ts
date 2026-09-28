// Delivery stages, demo delay scenarios and recovery policies.
// All eligibility and state rules live here — never in the explanation text.

export const STAGES = ["Order Confirmed", "Preparing", "Picked Up", "On the Way", "Delivered"] as const;
export const STAGE_MS = 25_000; // demo: each stage advances every 25s

export type RecoveryAction = "wait" | "replace" | "cancel" | "support";

export type Scenario = {
  id: string;
  title: string;
  appliesToStages: number[];
  events: string[]; // delivery events provided by the demo system
  explanation: string; // predefined demo explanation
  revisedEtaMinutes: number | null; // null = system has not supplied a revised ETA
  replacement: string | null;
};

export const scenarios: Scenario[] = [
  {
    id: "kitchen-backlog",
    title: "Kitchen backlog",
    appliesToStages: [0, 1],
    events: [
      "Restaurant reported a high order volume",
      "Preparation time exceeded the expected window by 12 min",
    ],
    explanation:
      "The restaurant is handling more orders than usual, so your food is taking longer to prepare. It has not been handed to a rider yet. The restaurant has not supplied a new ready time, so we can't give a reliable revised ETA right now.",
    revisedEtaMinutes: null,
    replacement: "Swap to a same-price item from the restaurant's ready-now shelf",
  },
  {
    id: "rider-breakdown",
    title: "Rider vehicle issue",
    appliesToStages: [2, 3],
    events: [
      "Rider reported a vehicle breakdown",
      "Nearest available rider reassigned to your order",
      "Dispatch system supplied a revised ETA",
    ],
    explanation:
      "Your rider's vehicle broke down after picking up your order. Dispatch has assigned a nearby rider to collect it, and the dispatch system estimates about 20 more minutes.",
    revisedEtaMinutes: 20,
    replacement: null,
  },
];

export type Order = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: { id: string; name: string; price: number; qty: number; veg: boolean }[];
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  platformFee: number;
  total: number;
  customer: { name: string; phone: string; address: string };
  placedAt: number;
  etaMinutes: number;
  risk?: { scenarioId: string; detectedAt: number; frozenStage: number };
  recovery?: { action: RecoveryAction; at: number; ref: string };
  supportRef?: string;
  events: { at: number; label: string; kind: "info" | "risk" | "success" }[];
};

export function getStage(o: Order, now: number): number {
  if (o.risk) {
    if (o.recovery?.action === "wait") {
      return Math.min(4, o.risk.frozenStage + Math.floor((now - o.recovery.at) / STAGE_MS));
    }
    return o.risk.frozenStage;
  }
  return Math.min(4, Math.floor((now - o.placedAt) / STAGE_MS));
}

export const scenarioFor = (o: Order) => scenarios.find((s) => s.id === o.risk?.scenarioId);

export function statusLabel(o: Order, now: number) {
  const r = o.recovery?.action;
  if (r === "cancel") return { text: "Cancellation requested", tone: "risk" as const };
  if (r === "replace") return { text: "Replacement requested", tone: "info" as const };
  const stage = getStage(o, now);
  if (stage === 4) return { text: "Delivered", tone: "success" as const };
  if (o.risk && r !== "wait") return { text: "Delivery at risk", tone: "risk" as const };
  return { text: STAGES[stage], tone: "info" as const };
}

export function refundPolicy(o: Order) {
  const stage = o.risk?.frozenStage ?? 0;
  if (stage < 2)
    return {
      eligible: true,
      text: "Demo policy: orders not yet picked up by a rider are eligible for a full refund of ₹" + o.total + " to the original payment method once the restaurant confirms the cancellation.",
    };
  return {
    eligible: false,
    text: "Demo policy: this order has already been picked up, so a refund is not automatic. Support will review the request and may offer up to 50% as credit. No refund is guaranteed.",
  };
}

export function availableOptions(o: Order) {
  const s = scenarioFor(o);
  const opts: { action: RecoveryAction; title: string; detail: string }[] = [
    {
      action: "wait",
      title: "Keep waiting",
      detail: s?.revisedEtaMinutes
        ? `We'll keep monitoring. Revised ETA from dispatch: about ${s.revisedEtaMinutes} min.`
        : "We'll keep monitoring and update you when the restaurant shares a new time.",
    },
  ];
  if (s?.replacement) opts.push({ action: "replace", title: "Choose a replacement", detail: s.replacement });
  opts.push({ action: "cancel", title: "Request cancellation", detail: refundPolicy(o).text });
  opts.push({ action: "support", title: "Contact support", detail: "Open a support ticket. You can still choose another option afterwards." });
  return opts;
}
