import { createLazyFileRoute } from "@tanstack/react-router";
import { ExploreAllContainer } from "@/components/explore-all";
export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <ExploreAllContainer />
    </div>
  );
}
