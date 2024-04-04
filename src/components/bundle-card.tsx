import { v4 as uuidv4 } from "uuid";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { supabase } from "../supabase";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Divide, PlusIcon } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";

interface SampleBundleProps {
  hoveredCardId: string;
  setHoveredCardId: React.Dispatch<React.SetStateAction<string>>;
  cardId: string;
}

export const SampleBundle: React.FC<SampleBundleProps> = ({
  hoveredCardId,
  setHoveredCardId,
  cardId,
}) => {
  // later this will all be rewritten so that i dont request the stored files in the bucket but the
  // objects stored in the db that hold the file urls or ill fetch the data one level above and
  // pass it as a prop

  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [audioPlayEnabled, setAudioPlayEnabled] = useState<boolean>(false);

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

  //@ts-ignore
  const playSample = ({ id, buttonId, iconId }) => {
    let button = document.getElementById(buttonId);
    const icon = document.getElementById(iconId);
    if (icon) icon.style.opacity = "1";
    if (button) button.style.borderColor = "grey";
    setTimeout(() => {
      if (button) {
        button.style.borderColor = "";
      }
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

  function getSampleName(url: string) {
    const regex = /(kick|snare|hihat|hat|hh|tom|perc|cymbal|crash|clap)/i;

    if (regex.test(url)) {
      const match = url.match(regex)[1].toLowerCase();
      switch (match) {
        case "kick":
          return "Kick";
        case "snare":
          return "Snare";
        case "hihat":
        case "hat":
        case "hh":
          return "HiHat";
        case "tom":
          return "Tom";
        case "clap":
          return "Clap";
        case "perc":
          return "Perc";
        case "cymbal":
        case "crash":
          return "Cymbal";
        default:
          return "";
      }
    } else {
      return "";
    }
  }

  useEffect(() => {
    getAudio();
  }, []);

  return (
    <div
      className="m-auto mt-4 "
      onMouseEnter={() => setHoveredCardId((prev) => cardId)}
      onMouseLeave={() => setHoveredCardId((prev) => "")}
    >
      <Card
        className="w-48 h-64 overflow-hidden flex flex-col bg-#1c1917 "
        id={cardId}
      >
        <CardHeader className="min-h-[64px] m-0 px-2 py-[2px] flex flex-row bg-#1c1917">
          <CardTitle className="text-base font-medium w-[124px] bg-#1c1917">
            Classic Drums
          </CardTitle>
          <div className="border-red-800 bg-#1c1917 ">Bild</div>
        </CardHeader>
        <Separator className="h-[0.5px] bg-zinc-200/20 bg-#1c1917" />
        <div
          className="w-full h-auto relative bg-#1c1917"
          style={{ backgroundColor: "#22c55e" }}
        ></div>
        <ScrollArea
          className="text-left
            mt-2
            mb-2
            overflow-hidden
            ml-[7px]
            bg-opacity-0
            "
        >
          {fileUrls.map((url, i) => {
            const audioId = uuidv4();
            const buttonId = `button-${audioId}`;
            const iconId = `icon-${audioId}`;
            const sampleCategory = getSampleName(url);
            return (
              <Button
                key={i}
                id={buttonId}
                variant="outline"
                size="icon"
                onClick={() =>
                  playSample({
                    id: audioId,
                    buttonId,
                    iconId: null,
                  })
                }
                className="m-0.5  relative bg-opacity-0 hover:!bg-primary hover:!text-black"
              >
                <span className="absolute bottom-0 left-0.5 text-xs text-[#797981]">
                  {sampleCategory}
                </span>
                <PlusIcon
                  className={`h-6
                  w-6
                  flex 
                  items-end 
                  text-[#37996b]
                  rounded-md 
                 opacity-0
                 hover:text-[#22c55e]
                 font-bold
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
