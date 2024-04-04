import Wavesurfer from "wavesurfer.js";
import { v4 as uuidv4 } from "uuid";
import { Button } from "./ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { supabase } from "../supabase";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { PlusIcon } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface SampleBundleProps {
  hoveredCardId: string;
  setHoveredCardId: React.Dispatch<React.SetStateAction<string>>;
  cardId: string;
}

export const SampleBundle: React.FC<SampleBundleProps> = ({
  setHoveredCardId,
  cardId,
}) => {
  const [fileUrls, setFileUrls] = useState<string[]>([]);

  const [loopUrls, setLoopUrls] = useState<string[]>([]);
  const [currentlyPlayingSample, setCurrentlyPlayingSample] = useState({
    id: "",
    iconId: "",
  });

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
    setFileUrls(() => fileUrls);

    // this section is completely redundant and only used for ui development of
    // the loop display section. dont think about it
    const { data: data2, error: error2 } = await supabase.storage
      .from("sounds-for-development")
      .list("loops", {
        limit: 100,
        offset: 0,
        sortBy: {
          column: "name",
          order: "asc",
        },
      });
    if (error2) console.log("error2: ", error2);
    const loopUrls: Array<string> = [];
    data2?.forEach((filedata2) => {
      const name = filedata2.name;
      const { data } = supabase.storage
        .from("sounds-for-development")
        .getPublicUrl(`loops/${name}`);
      loopUrls.push(data.publicUrl);
    });
    setLoopUrls(() => loopUrls);
  };

  //@ts-ignore
  const playSample = ({ id, buttonId, iconId }) => {
    pauseSample(currentlyPlayingSample.id, currentlyPlayingSample.iconId);
    setCurrentlyPlayingSample(() => ({ id, iconId }));

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

  useEffect(() => {
    loopUrls.forEach((url) => {
      const wavesurfer = Wavesurfer.create({
        container: document.getElementById(`loop-container-${cardId}`),
        waveColor: "grey",
        progressColor: "white",
        url: url,
        barWidth: 5,
        barGap: 3,
        barRadius: 4,
        height: 40,
        cursorWidth: 0,
        dragToSeek: true,
      });

      wavesurfer.on("click", () => {
        wavesurfer.playPause();
      });
    });
  }, [loopUrls]);

  return (
    <div
      className="mt-4 mx-4"
      onMouseEnter={() => setHoveredCardId(() => cardId)}
      onMouseLeave={() => setHoveredCardId(() => "")}
    >
      <Card
        className="w-[236px] h-[400px] overflow-hidden flex flex-col bg-#1c1917 "
        id={cardId}
      >
        <CardHeader className="-0 px-2 py-[2px] flex flex-row bg-#1c1917">
          <CardTitle className="text-base font-medium w-[180px] bg-#1c1917 flex flex-col relative">
            <span>Classic Drums</span>
            <span className="text-xs text-zinc-600">
              #Techno #oldSchool #melodic #drums #oneShots{" "}
            </span>
          </CardTitle>
          <div className="border-red-800 text-sm items-end flex flex-col justify-between bg-#1c1917 ">
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <img
                    className="h-[40px] w-[40px] contain cursor-pointer"
                    src="https://i1.sndcdn.com/avatars-TD1oEKpD7hhrlbN7-r6cNKQ-t500x500.jpg"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>The Sixth Sense</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <Separator className="h-[0.5px] bg-zinc-200/20 bg-#1c1917" />
        <div
          className="w-full h-auto relative bg-#1c1917"
          style={{ backgroundColor: "#22c55e" }}
        ></div>
        <ScrollArea
          className="text-left
            mt-2
            mb-8
            overflow-hidden
            ml-[7px]
            bg-opacity-0
            "
        >
          <h2>One Shots</h2>
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
                <span className="absolute bottom-0.5 left-1 text-xs text-[#797981]">
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

          <Separator className="h-[0.5px] bg-zinc-200/20 bg-#1c1917 w-[220px] mt-2 mb-1 " />
          <h2>Loops</h2>
          <div id={`loop-container-${cardId}`} className="mx-1"></div>
        </ScrollArea>

        <Separator className="h-[0.5px] bg-zinc-200/20 bg-#1c1917 -translate-y-[32px]" />
        <CardFooter className="flex relative ">
          <span className="absolute bottom-3 left-4 text-2xl text-zinc-200">
            25€
          </span>
          <Button
            variant="outline"
            className="absolute right-2 !border-[#3ecf8e]/20 bottom-3 hover:!bg-[#3ecf8e]/30
              hover:!border-[#3ecf8e]/50 h-8 flex items-center"
          >
            Buy
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
