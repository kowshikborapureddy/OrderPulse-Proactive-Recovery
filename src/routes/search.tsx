import { createFileRoute } from "@tanstack/react-router";
import { Discovery } from "@/components/Discovery";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search restaurants and dishes — OrderPulse" },
      { name: "description", content: "Search restaurants, dishes and cuisines near you on OrderPulse." },
      { property: "og:title", content: "Search — OrderPulse" },
      { property: "og:description", content: "Search restaurants, dishes and cuisines near you." },
    ],
  }),
  component: () => <Discovery autoFocus />,
});
