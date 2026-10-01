import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { bill, getRestaurant, locations, type MenuItem } from "./data";
import { handleDeliveryEvent, scenarioEvent, type DemoEvent } from "./events";
import { refundPolicy, canRecover, scenarioFor, getStage, scenarios, type Order, type RecoveryAction } from "./recovery";

type Cart = { restaurantId: string | null; items: Record<string, number> };
export type Notif = { id: string; orderId: string; key: string; at: number; title: string; body: string; read: boolean };
type State = { cart: Cart; orders: Order[]; location: string; notifications: Notif[] };

const KEY = "orderpulse-demo-v1";
const initial: State = { cart: { restaurantId: null, items: {} }, orders: [], location: "Indiranagar", notifications: [] };

type Ctx = State & {
  ready: boolean;
  setLocation: (l: string) => void;
  setQty: (restaurantId: string, item: MenuItem, qty: number) => boolean;
  clearCart: () => void;
  cartCount: number;
  placeOrder: (customer: Order["customer"]) => string;
  triggerDelay: (orderId: string, now: number) => void;
  ingestEvent: (orderId: string, ev: DemoEvent) => void;
  simulateEtaDelay: (orderId: string, minutes: number) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: number;
  chooseRecovery: (orderId: string, action: RecoveryAction) => void;
  resetDemo: () => void;
};

const StoreCtx = createContext<Ctx | null>(null);
const ref = (p: string) => `${p}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, ready]);

  const update = (fn: (s: State) => State) => setState(fn);
  const patchOrder = (id: string, fn: (o: Order) => Order) =>
    update((s) => ({ ...s, orders: s.orders.map((o) => (o.id === id ? fn(o) : o)) }));

  // Runs a simulated event through the central handler; creates at most one notification per alert key.
  const applyEvent = (orderId: string, ev: DemoEvent, now: number) =>
    update((s) => {
      const o = s.orders.find((x) => x.id === orderId);
      if (!o) return s;
      const r = handleDeliveryEvent(o, ev, now);
      const orders = s.orders.map((x) => (x.id === orderId ? r.order : x));
      const alert = r.alerted ? r.order.alerts?.[r.order.alerts.length - 1] : undefined;
      if (!alert || s.notifications.some((n) => n.orderId === orderId && n.key === alert.key)) return { ...s, orders };
      const isEta = ev.type === "eta_update";
      const notif: Notif = {
        id: ref("NTF"), orderId, key: alert.key, at: now, read: false,
        title: `Delivery at risk · ${o.restaurantName}`,
        body: "[Simulated demo event] " + (isEta ? `ETA moved to ${ev.newEtaMinutes} min (${r.reason}).` : ev.label),
      };
      return { ...s, orders, notifications: [notif, ...s.notifications] };
    });

  const value: Ctx = {
    ...state,
    ready,
    cartCount: Object.values(state.cart.items).reduce((a, b) => a + b, 0),
    setLocation: (location) => update((s) => ({ ...s, location })),
    setQty: (restaurantId, item, qty) => {
      const c = state.cart;
      if (c.restaurantId && c.restaurantId !== restaurantId && Object.keys(c.items).length && qty > 0) {
        const other = getRestaurant(c.restaurantId)?.name;
        if (!window.confirm(`Your cart has items from ${other}. Start a new cart with this restaurant?`)) return false;
        update((s) => ({ ...s, cart: { restaurantId, items: { [item.id]: qty } } }));
        return true;
      }
      update((s) => {
        const items = { ...s.cart.items };
        if (qty <= 0) delete items[item.id];
        else items[item.id] = qty;
        return { ...s, cart: { restaurantId: Object.keys(items).length ? restaurantId : null, items } };
      });
      return true;
    },
    clearCart: () => update((s) => ({ ...s, cart: { restaurantId: null, items: {} } })),
    placeOrder: (customer) => {
      const r = getRestaurant(state.cart.restaurantId!)!;
      const lines = r.menu
        .filter((m) => state.cart.items[m.id])
        .map((m) => ({ id: m.id, name: m.name, price: m.price, veg: m.veg, qty: state.cart.items[m.id] ?? 0 }));
      const b = bill(lines.reduce((a, l) => a + l.price * l.qty, 0));
      const now = Date.now();
      const id = `OP-${now.toString(36).toUpperCase().slice(-5)}${Math.floor(Math.random() * 90 + 10)}`;
      const order: Order = {
        id,
        restaurantId: r.id,
        restaurantName: r.name,
        items: lines,
        ...b,
        customer,
        placedAt: now,
        etaMinutes: r.etaMin,
        events: [{ at: now, label: "Order confirmed by " + r.name, kind: "success" }],
      };
      update((s) => ({ ...s, orders: [order, ...s.orders], cart: { restaurantId: null, items: {} } }));
      return id;
    },
    triggerDelay: (orderId, now) => {
      const o = state.orders.find((x) => x.id === orderId);
      const sc = o && scenarios.find((x) => x.appliesToStages.includes(getStage(o, now)));
      const ev = sc && scenarioEvent(sc.id, orderId);
      if (ev) applyEvent(orderId, ev, now);
    },
    ingestEvent: (orderId, ev) => applyEvent(orderId, ev, Date.now()),
    simulateEtaDelay: (orderId, minutes) => {
      const o = state.orders.find((x) => x.id === orderId);
      if (!o) return;
      const prev = o.verifiedEtaMinutes ?? o.etaMinutes;
      applyEvent(orderId, { id: `${orderId}:eta:${(o.seenEventIds ?? []).length}`, source: "demo-simulated", type: "eta_update", newEtaMinutes: prev + minutes, label: `Simulated ETA update: +${minutes} min` }, Date.now());
    },
    markRead: (id) => update((s) => ({ ...s, notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
    markAllRead: () => update((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
    unreadCount: state.notifications.filter((n) => !n.read).length,
    chooseRecovery: (orderId, action) =>
      update((s) => {
        const o = s.orders.find((x) => x.id === orderId);
        const now = Date.now();
        if (!o || !canRecover(o, now, action)) return s;
        const r = ref(action === "support" ? "SUP" : "REC");
        let next: Order;
        let note: string;
        if (action === "cancel" && !refundPolicy(o).eligible) {
          const reason = "Demo policy: cancellation is not available because the order has already been picked up by a rider. Your order stays active.";
          next = { ...o, cancelDenied: { at: now, reason }, events: [...o.events, { at: now, label: "Cancellation not eligible (demo policy) — order remains active.", kind: "risk" }] };
          note = "Cancellation not eligible under demo policy. Your order is still active.";
        } else if (action === "support") {
          const issue = scenarioFor(o)?.title ?? "Customer requested help";
          next = { ...o, supportRef: r, supportHandoff: { ref: r, orderId: o.id, issue, at: now }, events: [...o.events, { at: now, label: `Demo support handoff created (Ref ${r})`, kind: "success" }] };
          note = `Demo support handoff ${r} created for ${o.id}. No real agent is contacted.`;
        } else {
          const labels = {
            wait: "You chose to keep waiting. Monitoring resumed.",
            replace: "Replacement request submitted (demo) — awaiting simulated restaurant confirmation.",
            cancel: "Cancellation request submitted (demo) — no real cancellation or refund is processed.",
          } as const;
          const decision = { wait: "continue_waiting", replace: "replacement_requested", cancel: "cancellation_requested" }[action];
          next = { ...o, recovery: { action, at: now, ref: r, decision }, events: [...o.events, { at: now, label: labels[action] + ` (Ref ${r})`, kind: "success" }] };
          note = labels[action];
        }
        const key = `decision:${action}`;
        const dup = s.notifications.some((n) => n.orderId === orderId && n.key === key);
        const notifications = dup ? s.notifications : [{ id: ref("NTF"), orderId, key, at: now, read: false, title: `Your choice · ${o.restaurantName}`, body: "[Demo] " + note }, ...s.notifications];
        return { ...s, orders: s.orders.map((x) => (x.id === orderId ? next : x)), notifications };
      }),
    resetDemo: () => setState(initial),
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export const useStore = () => {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
};

export function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}
