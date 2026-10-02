// Delivery stages, demo delay scenarios and recovery policies.
// All eligibility and state rules live here — never in the explanation text.

export const STAGES = ["Order Confirmed", "Preparing", "Picked Up", "On the Way", "Delivered"] as const;
export const STAGE_MS = 25_000; // demo: each stage advances every 25s

export type RecoveryAction = "wait" | "replace" | "cancel" | "support";

export type Scenario = {
  id: string;
  title: string;
  customerSummary: string;
  recommendedAction: Extract<RecoveryAction, "wait" | "replace">;
  recommendationReason: string;
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
    customerSummary: "The restaurant is experiencing a preparation delay. Your order has not been picked up yet.",
    recommendedAction: "replace",
    recommendationReason: "A same-price ready-now alternative is available in this demo, which may avoid more preparation time.",
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
    customerSummary: "Your rider reported a vehicle issue after pickup. The demo dispatch system has reassigned the order.",
    recommendedAction: "wait",
    recommendationReason: "A replacement rider and a simulated revised ETA are already available, so waiting is the least disruptive option.",
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
  {
    id: "eta-delay",
    title: "Simulated ETA delay",
    customerSummary: "The simulated delivery estimate moved at least 15 minutes later than the previous verified estimate.",
    recommendedAction: "wait",
    recommendationReason: "The order is still active and the demo can continue monitoring for another update.",
    appliesToStages: [],
    events: ["Simulated ETA update moved delivery 15+ min later"],
    explanation:
      "[Simulated demo event] The estimated arrival time moved at least 15 minutes later than the previous estimate. No live restaurant or rider feed is connected; this ETA comes from the demo simulator.",
    revisedEtaMinutes: null,
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
  recovery?: { action: RecoveryAction; at: number; ref: string; decision?: string };
  cancelDenied?: { at: number; reason: string };
  supportRef?: string;
  supportHandoff?: { ref: string; orderId: string; issue: string; at: number };
  events: { at: number; label: string; kind: "info" | "risk" | "success" }[];
  verifiedEtaMinutes?: number;
  seenEventIds?: string[];
  alerts?: { key: string; at: number }[];
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
  if (r === "cancel") return { text: "Cancellation request submitted (demo)", tone: "risk" as const };
  if (r === "replace") return { text: "Replacement request submitted (demo)", tone: "info" as const };
  const stage = getStage(o, now);
  if (stage === 4) return { text: "Delivered", tone: "success" as const };
  if (o.risk && r !== "wait") return { text: "Delivery at risk", tone: "risk" as const };
  return { text: STAGES[stage] ?? "", tone: "info" as const };
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
  if (refundPolicy(o).eligible && !o.cancelDenied)
    opts.push({ action: "cancel", title: "Request cancellation", detail: refundPolicy(o).text });
  if (!o.supportRef)
    opts.push({ action: "support", title: "Contact support", detail: "Create a demo support handoff. No real agent will be contacted." });
  return opts;
}

// Recovery actions are only allowed on active, not-yet-resolved orders.
export function canRecover(o: Order, now: number, action: RecoveryAction): boolean {
  if (getStage(o, now) === 4 || o.recovery?.action === "cancel") return false;
  if (action === "support") return !o.supportRef;
  if (action === "replace" && !scenarioFor(o)?.replacement) return false; // demo data must confirm availability
  if (action === "cancel" && o.cancelDenied) return false;
  return !!o.risk && !o.recovery;
}
