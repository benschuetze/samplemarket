import { createFileRoute, redirect } from "@tanstack/react-router";
import { BundlePage } from "@/components/bundle-page";
import { supabase } from "@/supabase";

let loops: any;
let oneShots: any;

export const Route = createFileRoute("/bundles/$bundleName/$bundleId")({
  component: Bundle,
  beforeLoad: async ({ params }) => {
    oneShots = await supabase.storage
      .from("test-mp3s")
      .list(`public/${params.bundleName}/oneShots`);
    console.log("One shots retrieved!", oneShots);
    loops = await supabase.storage
      .from("test-mp3s")
      .list(`public/${params.bundleName}/loops`);
    console.log("Loops retrieved: ", loops);
    return { oneShots, loops };
  },
});

function Bundle() {
  return <BundlePage loops={loops} oneShots={oneShots} />;
}
