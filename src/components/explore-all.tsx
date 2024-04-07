import { SampleBundle } from "./bundle-card";
import { useState } from "react";

export const ExploreAllContainer = () => {
  //here i will request all the latest uplóaded sample bundles and render
  //each one as a SampleBundle component
  const [hoveredCardId, setHoveredCardId] = useState<string>("");

  return (
    <div
      className="flex flex-wrap  mx-auto mt-16"
      style={{ maxWidth: "1400px" }}
    >
      <SampleBundle
        hoveredCardId={hoveredCardId}
        setHoveredCardId={setHoveredCardId}
        cardId={"1"}
      />
      <SampleBundle
        hoveredCardId={hoveredCardId}
        setHoveredCardId={setHoveredCardId}
        cardId={"2"}
      />
      <SampleBundle
        hoveredCardId={hoveredCardId}
        setHoveredCardId={setHoveredCardId}
        cardId={"3"}
      />
      <SampleBundle
        hoveredCardId={hoveredCardId}
        setHoveredCardId={setHoveredCardId}
        cardId={"4"}
      />
      <SampleBundle
        hoveredCardId={hoveredCardId}
        setHoveredCardId={setHoveredCardId}
        cardId={"5"}
      />
      <SampleBundle
        hoveredCardId={hoveredCardId}
        setHoveredCardId={setHoveredCardId}
        cardId={"6"}
      />
      <SampleBundle
        hoveredCardId={hoveredCardId}
        setHoveredCardId={setHoveredCardId}
        cardId={"7"}
      />
    </div>
  );
};
