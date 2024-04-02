import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { supabase } from "../supabase";
import { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";

export const SampleBundle = () => {
  // later this will all be rewritten so that i dont request the stored files in the bucket but the
  // objects stored in the db that hold the file urls or ill fetch the data one level above and
  // pass it as a prop

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
    <div className="m-auto mt-4">
      <Card className="w-48 h-48 overflow-hidden">
        <ScrollArea className="h-full text-center mt-2 oveflow-hidden">
          {fileUrls.map((url, i) => {
            return (
              <Button
                key={i}
                variant="outline"
                size="icon"
                onMouseEnter={() => playSample(i)}
                onClick={() => playSample(i)}
                onMouseLeave={() => pauseSample(i)}
                className="mx-0.5"
              >
                <audio id={i.toString()} src={url}></audio>
              </Button>
            );
          })}
        </ScrollArea>
      </Card>
    </div>
  );
};
