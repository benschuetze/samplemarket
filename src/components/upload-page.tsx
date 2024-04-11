import { UploadedSample } from "./uploaded-sample";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "sonner";

type RejectedSample = {
  file: File;
  rejectionCause: string;
  type: string;
};

export const UploadPage = () => {
  //
  const [loops, setLoops] = useState<Array<File>>([]);
  const [oneShots, setOneShots] = useState<Array<File>>([]);

  const loopsRef = useRef<HTMLDivElement>(null);
  const oneShotsRef = useRef<HTMLDivElement>(null);

  const onUpload = (files: Array<File>, container: string) => {
    console.log("files to upload: ", files);

    if (container === "loops") {
      setLoops((prev) => {
        const uniqueFiles = files.filter(
          (file) => !prev.some((prevFile) => prevFile.name === file.name),
        );
        return [...prev, ...uniqueFiles];
      });
    }

    //@ts-ignore
    if (container === "oneShots") {
      setOneShots((prev) => {
        const uniqueFiles = files.filter(
          (file) => !prev.some((prevFile) => prevFile.name === file.name),
        );
        const newState = [...prev, ...uniqueFiles];
        return newState;
      });
    }
  };

  const readFileAsync = async (
    file: File,
    audioFiles: File[],
    container: string,
  ) => {
    // check the duration of the sample and prevent it from being uploaded if it's too long
    if (file.type.includes("mp3") || file.type.includes("mpeg")) {
      toast(`${file.name} rejected. Mp3 files are not accepted.`);
      audioFiles.splice(audioFiles.indexOf(file), 1);
      return;
    }
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      fileReader.onload = async () => {
        const arrayBuffer = fileReader.result as ArrayBuffer;
        await audioContext.decodeAudioData(
          arrayBuffer,
          (buffer) => {
            const duration = buffer.duration;
            if (duration > 5 && container === "oneShots") {
              toast(
                `${file.name} rejected. One Shot samples have a maximal lenght of 5 seconds.`,
              );
              audioFiles.splice(audioFiles.indexOf(file), 1);
            }
            if (
              (duration > 20 && container === "loops") ||
              (duration < 1 && container === "loops")
            ) {
              toast(
                `${file.name} rejected. Loops should be between 1 and 20 seconds long.`,
              );
              audioFiles.splice(audioFiles.indexOf(file), 1);
            }
          },
          (error) => {
            console.error("ERROR ERROR ERROR", error);
          },
        );
        resolve({ succes: true });
      };

      fileReader.onerror = () => {
        reject({ error: fileReader.error, success: false });
      };

      fileReader.readAsArrayBuffer(file);
    });
  };

  //

  //this can be refactored hardcore and i will but only when it all works
  const handleDrop = async (e: DragEvent, container: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    let audioFiles: File[] = [];
    if (e.dataTransfer) {
      const { files } = e.dataTransfer || { files: [] };
      audioFiles = [...files];
      const processAudioFiles = async () => {
        for (const file of files) {
          try {
            await readFileAsync(file, audioFiles, container);
          } catch (e) {
            console.error("error reading file: ", e);
          }
        }
      };
      await processAudioFiles();
    }

    if (audioFiles && audioFiles.length) {
      onUpload(audioFiles, container);
    }
  };

  const handleDragover = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    //useEffect kept verose and not functionalized for readability
    if (loopsRef.current && oneShotsRef.current) {
      loopsRef.current.addEventListener("dragover", (e: DragEvent) =>
        handleDragover(e),
      );
      loopsRef.current.addEventListener("drop", (e: DragEvent) =>
        handleDrop(e, "loops"),
      );
      oneShotsRef.current.addEventListener("dragover", (e: DragEvent) =>
        handleDragover(e),
      );
      oneShotsRef.current.addEventListener("drop", (e: DragEvent) =>
        handleDrop(e, "oneShots"),
      );
    }
    return () => {
      if (loopsRef.current && oneShotsRef.current) {
        loopsRef.current.removeEventListener("dragover", (e: DragEvent) =>
          handleDragover(e, "loops"),
        );
        loopsRef.current.removeEventListener("drop", (e: DragEvent) =>
          handleDrop(e, "loops"),
        );
        oneShotsRef.current.removeEventListener("dragover", (e: DragEvent) =>
          handleDragover(e, "oneShots"),
        );
        oneShotsRef.current.removeEventListener("drop", (e: DragEvent) =>
          handleDrop(e, "oneShots"),
        );
      }
    };
  }, []);

  useEffect(() => {
    console.log("one shots now: ", oneShots);
  }, [oneShots]);
  useEffect(() => {
    console.log("loops now: ", loops);
  }, [loops]);

  return (
    <div className="mt-16 mx-auto" style={{ maxWidth: "1340px" }}>
      <Card className="w-full mt-24">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>
            Deploy your new project in one-click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">One Shots</Label>
                <Card
                  ref={oneShotsRef}
                  className={`min-h-32 px-3 py-2 transition-height duration-500 `}
                >
                  {oneShots.length <= 0 ? (
                    <span className="text-sm text-zinc-400">
                      Drag and drop your one shot samples here...
                    </span>
                  ) : (
                    <div className="flex flex-wrap mx-auto ">
                      {oneShots.map((file, i) => {
                        return (
                          <UploadedSample
                            key={i}
                            name={file.name}
                            type="oneShot"
                          />
                        );
                      })}
                    </div>
                  )}
                </Card>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Loops</Label>
                <Card ref={loopsRef} className="min-h-32 px-3 py-2">
                  {loops.length <= 0 ? (
                    <span className=" text-sm text-zinc-400">
                      Drag and drop your loops here...
                    </span>
                  ) : (
                    <div className="flex flex-wrap mx-auto ">
                      {loops.map((file, i) => {
                        return (
                          <UploadedSample
                            key={i}
                            name={file.name}
                            type="loop"
                          />
                        );
                      })}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  );
};
