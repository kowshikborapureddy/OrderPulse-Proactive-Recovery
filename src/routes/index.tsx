import { createFileRoute } from "@tanstack/react-router";
import { Discovery } from "@/components/Discovery";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OrderPulse — Food delivery that warns you before it's late" },
      { name: "description", content: "Discover restaurants, order food and get proactive recovery options when a delivery may be delayed." },
      { property: "og:title", content: "OrderPulse — Food delivery with proactive recovery" },
      { property: "og:description", content: "Discover restaurants, order food and get proactive recovery options when a delivery may be delayed." },
    ],
  }),
  component: () => <Discovery />,
});
