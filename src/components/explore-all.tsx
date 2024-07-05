import { supabase } from "@/supabase";
import { SampleBundle } from "./bundle-card";
import { useEffect, useState } from "react";

export const ExploreAllContainer = () => {
  const [hoveredCardId, setHoveredCardId] = useState<string>("");

  const getAudio = async () => {
    const { data, error } = await supabase.storage
      .from("test-mp3s")
      .list("public", {
        limit: 100,
        offset: 0,
        sortBy: {
          column: "name",
          order: "asc",
        },
      });
    if (error) console.log("error: ", error);
    console.log("data: ", data);
    const fileUrls: Array<string> = [];
    data?.forEach((fileData) => {
      const name = fileData.name;
      const { data } = supabase.storage
        .from("sounds-for-development")
        .getPublicUrl(`samples/${name}`);
      fileUrls.push(data.publicUrl);
    });
  };

  useEffect(() => {
    getAudio();
  }, []);

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
