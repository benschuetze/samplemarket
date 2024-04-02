import { v4 as uuidv4 } from "uuid";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { supabase } from "../supabase";
import { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { DockIcon, PlusIcon } from "lucide-react";

export const SampleBundle = () => {
  // later this will all be rewritten so that i dont request the stored files in the bucket but the
  // objects stored in the db that hold the file urls or ill fetch the data one level above and
  // pass it as a prop

  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [idOfCurrentlyHoveredSample, setIdOfCurrentlyHoveredSample] =
    useState<string>("");
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
    const fileUrls: Array<string> = [];
    data?.forEach((fileData) => {
      const name = fileData.name;
      const { data } = supabase.storage
        .from("sounds-for-development")
        .getPublicUrl(`samples/${name}`);
      fileUrls.push(data.publicUrl);
    });
    setFileUrls((prev) => fileUrls);
  };

  const playSample = (id: string, buttonId: string, iconId: string) => {
    let button = document.getElementById(buttonId);
    const icon = document.getElementById(iconId);
    if (icon) icon.style.opacity = "1";
    if (button) button.style.borderColor = "grey";
    setTimeout(() => {
      if (button) button.style.borderColor = "";
    }, 100);

    const audioElem = document.getElementById(
      id.toString(),
    ) as HTMLAudioElement | null;
    if (audioElem) {
      audioElem.currentTime = 0;
      audioElem.play();
    }
  };

  const pauseSample = (id: string, iconId: string) => {
    const icon = document.getElementById(iconId);
    if (icon) icon.style.opacity = "0";
    const audioElem = document.getElementById(
      id.toString(),
    ) as HTMLAudioElement | null;
    if (audioElem) {
      audioElem.currentTime = 0;
      audioElem.pause();
    }
  };

  useEffect(() => {
    getAudio();
  }, []);

  return (
    <div className="m-auto mt-4">
      <Card className="w-48 h-48 overflow-hidden flex ">
        <ScrollArea className="h-full text-left mt-2 overflow-hidden ml-[7px]">
          {fileUrls.map((url, i) => {
            const audioId = uuidv4();
            const buttonId = `button-${audioId}`;
            const iconId = `icon-${audioId}`;
            return (
              <Button
                key={i}
                id={buttonId}
                variant="outline"
                size="icon"
                onMouseEnter={() => playSample(audioId, buttonId, iconId)}
                onClick={() => playSample(audioId, buttonId)}
                onMouseLeave={() => pauseSample(audioId, iconId)}
                className="m-0.5"
              >
                <PlusIcon
                  className={`h-6
                  w-6
                  flex 
                  items-end 
                  text-zinc-100/30  
                  rounded-md 
                  hover:text-zinc-100 
                 opacity-0
                 `}
                  id={iconId}
                />
                <audio id={audioId} src={url}></audio>
              </Button>
            );
          })}
        </ScrollArea>
      </Card>
    </div>
  );
};
