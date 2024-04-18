import JSZip from "jszip";
import lamejs from "lamejs";
import { supabase } from "@/supabase";
import { UploadedSample } from "./uploaded-sample";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
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
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "./ui/textarea";

type AudioBufferObject = {
  name: string;
  audioBuffer: AudioBuffer;
  arrayBuffer: ArrayBuffer;
};

export const UploadPage = () => {
  const [loops, setLoops] = useState<Array<File>>([]);
  const [oneShots, setOneShots] = useState<Array<File>>([]);
  const [audioBuffers, setAudioBuffers] = useState<Array<AudioBufferObject>>(
    [],
  );

  const loopsRef = useRef<HTMLDivElement>(null);
  const oneShotsRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLTextAreaElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const setFilesToUpload = (files: Array<File>, container: string) => {
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

  const zipFilesToUpload = async () => {
    const zip = new JSZip();
    const loopsFolder = zip.folder("Loops");
    const oneShotsFolder = zip.folder("one-Shots");
    for (let i = 0; i < loops.length; i++) {
      const file: File = loops[i];
      if (loopsFolder) loopsFolder.file(`${file.name}`, file);
    }

    for (let i = 0; i < oneShots.length; i++) {
      const file = oneShots[i];
      if (oneShotsFolder) oneShotsFolder.file(`${file.name}`, file);
    }

    const zipAsUinst8Array = await zip.generateAsync({ type: "uint8array" });
    const blob = new Blob([zipAsUinst8Array], {
      type: "application/octet-stream",
    });

    return blob;
  };

  const readFileAsync = async (
    file: File,
    filesToProcess: File[],
    container: string,
  ) => {
    // check the duration of the sample and prevent it from being uploaded if it's too long
    if (file.type.includes("mp3") || file.type.includes("mpeg")) {
      toast(`${file.name} rejected. Mp3 files are not accepted.`);
      filesToProcess.splice(filesToProcess.indexOf(file), 1);
      return;
    }
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      fileReader.onload = async () => {
        const arrayBuffer = fileReader.result as ArrayBuffer;

        // check the duration and
        // encode file in mp3 for client playback.
        // this encoded file is being served to the client for sample playback in the browser
        await audioContext.decodeAudioData(
          arrayBuffer,
          (audioBuffer) => {
            const duration = audioBuffer.duration;
            setAudioBuffers((prev) => [
              ...prev,
              {
                name: file.name.split(".")[0],
                arrayBuffer: arrayBuffer,
                audioBuffer: audioBuffer,
              },
            ]);
            if (duration > 5 && container === "oneShots") {
              toast(
                `${file.name} rejected. One Shot samples have a maximal length of 5 seconds.`,
              );
              filesToProcess.splice(filesToProcess.indexOf(file), 1);
            }
            if (
              (duration > 20 && container === "loops") ||
              (duration < 1 && container === "loops")
            ) {
              toast(
                `${file.name} rejected. Loops should be between 1 and 20 seconds long.`,
              );
              filesToProcess.splice(filesToProcess.indexOf(file), 1);
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

  //this can be refactored hardcore and i will but only when it all works
  const handleDrop = async (e: DragEvent, container: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    let filesToProcess: File[] = [];
    if (e.dataTransfer) {
      const { files } = e.dataTransfer || { files: [] };
      filesToProcess = [...files];
      const processAudioFiles = async () => {
        for (const file of files) {
          try {
            await readFileAsync(file, filesToProcess, container);
          } catch (e) {
            console.error("error reading file: ", e);
          }
        }
      };
      await processAudioFiles();
    }

    if (filesToProcess && filesToProcess.length) {
      setFilesToUpload(filesToProcess, container);
    }
  };

  const handleDragover = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const buildTagsFromString = () => {
    const tagsAsString = tagsRef.current?.value;

    return tagsAsString?.split(" ").filter((tag) => tag !== "") || [];
  };

  const encodeFilesAsMp3 = async () => {
    for (let i = 0; i < audioBuffers.length; i++) {
      const currentBuffer = audioBuffers[i];
      const channelsOfFile = currentBuffer.audioBuffer.numberOfChannels;
      const wav = lamejs.WavHeader.readHeader(
        new DataView(currentBuffer.arrayBuffer),
      );
      console.log("wav:", wav);
      const samples = new Int16Array(
        currentBuffer.arrayBuffer,
        wav.dataOffset,
        wav.dataLen,
      );
    }
  };

  const handleBundleUpload = async () => {
    const blobOfZippedfilesToProcess = await zipFilesToUpload();
    const filesEncodedAsMp3 = encodeFilesAsMp3();
    const bundleName = nameInputRef.current?.value;
    const tags = buildTagsFromString();
    console.log("builded tags: ", tags);
    //  const { data, error } = await supabase.storage
    //   .from("zip-compressed-sample-packs")
    //  .upload(`public/${Math.random()}.zip`, blobOfZippedAudioFiles, {
    //   cacheControl: "3600",
    //  upsert: false,
    //});
    //if (data) console.log("data by supabase upload: ", data);
    //if (error) console.log("error supabase upload: ", error);
    //console.log("samples to upload", { loops, oneShots });
  };

  useEffect(() => {
    console.log("audio Buffers: ", audioBuffers);
  }, [audioBuffers]);

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

    if (tagsRef.current) {
      tagsRef.current.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault(); // Prevent default behavior of the Enter key
        }
        if (!e.key.match(/[a-zA-Z0-9\s]/)) {
          e.preventDefault(); // Prevent default behavior for non-alphanumeric characters
        }
      });
    }
    return () => {
      if (loopsRef.current && oneShotsRef.current) {
        loopsRef.current.removeEventListener("dragover", (e: DragEvent) =>
          handleDragover(e),
        );
        loopsRef.current.removeEventListener("drop", (e: DragEvent) =>
          handleDrop(e, "loops"),
        );
        oneShotsRef.current.removeEventListener("dragover", (e: DragEvent) =>
          handleDragover(e),
        );
        oneShotsRef.current.removeEventListener("drop", (e: DragEvent) =>
          handleDrop(e, "oneShots"),
        );
      }
      if (tagsRef.current) {
        tagsRef.current.removeEventListener("keydown", (e: KeyboardEvent) => {
          if (e.key === "Enter") {
            e.preventDefault(); // Prevent default behavior of the Enter key
          }
          if (!e.key.match(/[a-zA-Z0-9\s]/)) {
            e.preventDefault(); // Prevent default behavior for non-alphanumeric characters
          }
        });
      }
    };
  }, []);

  return (
    <div className="mt-16 mx-auto" style={{ maxWidth: "1340px" }}>
      <Card className="max-w-5xl mt-24">
        <CardHeader>
          <CardTitle>Upload Bundle</CardTitle>
          <CardDescription>
            Deploy your new project in one-click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="name" className="-mb-2 !w-1/2">
                Name
              </Label>
              <div className="flex">
                <Input
                  className="border-transparent focus:border-transparent focus:!ring-0"
                  style={{ outline: "none !important" }}
                  ref={nameInputRef}
                />
                <Input className="opacity-0 cursor-default pointer-events-none" />
              </div>
              <Label htmlFor="name" className="-mb-2 !w-1/2">
                Tags
              </Label>
              <Textarea
                className="border-transparent focus:border-transparent focus:!ring-0 resize-none"
                style={{ outline: "none !important" }}
                placeholder="Add Tags that describe the sound of your bundle..."
                ref={tagsRef}
              />

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">One Shots</Label>
                <Card
                  ref={oneShotsRef}
                  className={`min-h-32 px-3 py-2 transition-height duration-500 relative ${!(oneShots.length > 0) && "hover:!bg-zinc-900 "}`}
                >
                  {oneShots.length <= 0 ? (
                    <span className="text-sm text-zinc-400 absolute cursor-default w-full text-center -ml-3 mt-11">
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
                <Card
                  ref={loopsRef}
                  className={`min-h-32 px-3 py-2 relative ${!(loops.length > 0) && "hover:!bg-zinc-900 "}`}
                >
                  {loops.length <= 0 ? (
                    <span className=" text-sm text-zinc-400 w-full absolute text-center -ml-3 mt-11 cursor-default ">
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
          <Button
            variant="outline"
            className=" 
            !h-10 hover:!bg-[#cf3e67]/30
              hover:!border-[#cf3e67]/50 h-8 flex items-center"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className=" !border-[#3ecf8e]/20 
            !h-10 hover:!bg-[#3ecf8e]/30
              hover:!border-[#3ecf8e]/50 h-8 flex items-center"
            onClick={() => handleBundleUpload()}
          >
            Upload
          </Button>
        </CardFooter>
      </Card>
      <Toaster theme="dark" style={{ borderColor: "#cf3e67 !important" }} />
    </div>
  );
};
