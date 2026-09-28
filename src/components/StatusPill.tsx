import { cn } from "@/lib/utils";

export function StatusPill({ s }: { s: { text: string; tone: "risk" | "info" | "success" } }) {
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", s.tone === "risk" && "bg-warning/15 text-warning", s.tone === "info" && "bg-primary/10 text-primary", s.tone === "success" && "bg-success/15 text-success-strong")}>
      {s.text}
    </span>
  );
}
