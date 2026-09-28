import { Link } from "@tanstack/react-router";
import { Home, Search, Receipt, ShoppingBag, Activity } from "lucide-react";
import { useStore } from "@/lib/store";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/orders", label: "My Orders", short: "Orders", icon: Receipt },
  { to: "/cart", label: "Cart", icon: ShoppingBag },
] as const;

export function Header() {
  const { cartCount } = useStore();
  return (
    <header className="sticky top-0 z-40 border-b border-brand-foreground/10 bg-brand text-brand-foreground">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary"><Activity className="h-5 w-5" /></span>
          OrderPulse
        </Link>
        <span className="rounded-full border border-brand-foreground/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-foreground/80 md:hidden">Demo mode</span>
        <nav className="hidden items-center gap-1 md:flex">
          <span className="mr-3 rounded-full border border-brand-foreground/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-foreground/80" title="Data is stored in this browser only">Demo mode</span>
          {links.map((l) => (
            <Link key={l.to} to={l.to} activeOptions={{ exact: true }} activeProps={{ className: "bg-primary" }} className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-brand-foreground/10">
              <l.icon className="h-4 w-4" />{l.label}
              {l.to === "/cart" && cartCount > 0 && <span className="rounded-full bg-violet px-1.5 text-xs font-bold">{cartCount}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function MobileNav() {
  const { cartCount } = useStore();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t bg-card md:hidden">
      {links.map((l) => (
        <Link key={l.to} to={l.to} activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }} inactiveProps={{ className: "text-muted-foreground" }} className="relative flex flex-col items-center gap-0.5 py-2 text-xs font-medium">
          <l.icon className="h-5 w-5" />
          {"short" in l ? l.short : l.label}
          {l.to === "/cart" && cartCount > 0 && <span className="absolute right-1/4 top-1 rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">{cartCount}</span>}
        </Link>
      ))}
    </nav>
  );
}
