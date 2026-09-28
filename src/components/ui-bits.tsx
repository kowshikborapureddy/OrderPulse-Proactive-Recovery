import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Img({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [err, setErr] = useState(false);
  if (err) return <div className={cn("bg-gradient-to-br from-accent to-muted", className)} aria-label={alt} />;
  return <img src={src} alt={alt} loading="lazy" onError={() => setErr(true)} className={cn("object-cover", className)} />;
}

export function VegMark({ veg }: { veg: boolean }) {
  return (
    <span
      title={veg ? "Vegetarian" : "Non-vegetarian"}
      className={cn("inline-flex h-4 w-4 items-center justify-center rounded-sm border-2", veg ? "border-success" : "border-warning")}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", veg ? "bg-success" : "bg-warning")} />
    </span>
  );
}

export function Stepper({ qty, onChange, disabled }: { qty: number; onChange: (n: number) => void; disabled?: boolean }) {
  if (qty === 0)
    return (
      <button
        disabled={disabled}
        onClick={() => onChange(1)}
        className="rounded-xl border border-primary/30 bg-card px-6 py-2 text-sm font-bold text-primary shadow-sm hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-card disabled:hover:text-primary"
      >
        {disabled ? "Sold out" : "ADD"}
      </button>
    );
  return (
    <div className="flex items-center gap-3 rounded-xl bg-primary px-2 py-1.5 text-primary-foreground shadow-sm">
      <button aria-label="Decrease" onClick={() => onChange(qty - 1)} className="rounded p-1 hover:bg-primary-foreground/15"><Minus className="h-4 w-4" /></button>
      <span className="min-w-4 text-center text-sm font-bold">{qty}</span>
      <button aria-label="Increase" onClick={() => onChange(qty + 1)} className="rounded p-1 hover:bg-primary-foreground/15"><Plus className="h-4 w-4" /></button>
    </div>
  );
}

export function Loading() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 p-6">
      {[0, 1, 2].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />)}
    </div>
  );
}

export const rupee = (n: number) => "₹" + n.toLocaleString("en-IN");
