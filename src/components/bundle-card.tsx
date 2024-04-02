import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { supabase } from "../supabase";
import { useEffect, useState } from "react";

export const SampleBundle = () => {
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const getAudio = async () => {
    const { data, error } = await supabase.storage
      .from("sounds-for-development")
      .list("samples", {
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
      console.log("file url: ", data);
      fileUrls.push(data.publicUrl);
    });
    setFileUrls((prev) => fileUrls);
  };

  const playSample = (id: number) => {
    const audioElem = document.getElementById(
      id.toString(),
    ) as HTMLAudioElement | null;
    audioElem?.play();
  };

  const pauseSample = (id: number) => {
    const audioElem = document.getElementById(
      id.toString(),
    ) as HTMLAudioElement | null;
    if (audioElem) {
      audioElem.currentTime = 0;
      audioElem.pause();
    }
  };

  //only for development setting fileUrls like this because supabase is currently down

  useEffect(() => {
    //  getAudio();
    setFileUrls((prev) => {
      return [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ];
    });
  }, []);
  return (
    <div>
      <Card>
        {fileUrls.map((url, i) => {
          return (
            <Button
              key={i}
              variant="outline"
              size="icon"
              onMouseEnter={() => playSample(i)}
              onClick={() => playSample(i)}
              onMouseLeave={() => pauseSample(i)}
            >
              <audio id={i.toString()} src={url}></audio>
            </Button>
          );
        })}
      </Card>
    </div>
  );
};
