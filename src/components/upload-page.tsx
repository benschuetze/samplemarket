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
import { UploadConfirmationModal } from "./upload-confirmation-modal";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "./ui/textarea";
import { UploadProgressModal } from "./upload-progress-modal";

type encodeMp3Response = {
  success: string;
  mp3: Blob;
};

//for upload progress bar
let completedTasks = 0;

export const UploadPage = () => {
  const [loops, setLoops] = useState<Array<File>>([]);
  const [oneShots, setOneShots] = useState<Array<File>>([]);
  const [modalUploadProgressOpen, setModalUploadProgressOpen] =
    useState<boolean>(false);
  const [progressValue, setProgressValue] = useState<number>(0);

  const loopsRef = useRef<HTMLDivElement>(null);
  const oneShotsRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLTextAreaElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const progressModalRef = useRef<typeof UploadProgressModal>(null);

  const updateProgress = (totalTasks: number, isFinished = false) => {
    completedTasks++;
    const progress = Math.floor((completedTasks / totalTasks) * 100); // Calculate progress percentage
    setProgressValue(progress); // Update progress bar
    if (isFinished) setProgressValue(100);
  };

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

  const zipFilesToUpload = async (progressIncrementValue: number) => {
    const zip = new JSZip();
    const loopsFolder = zip.folder("Loops");
    const oneShotsFolder = zip.folder("one-Shots");
    for (let i = 0; i < loops.length; i++) {
      const file: File = loops[i];
      if (loopsFolder) loopsFolder.file(`${file.name}`, file);

      setProgressValue((prev) => prev + progressIncrementValue);
    }

    for (let i = 0; i < oneShots.length; i++) {
      const file = oneShots[i];
      if (oneShotsFolder) oneShotsFolder.file(`${file.name}`, file);
      setProgressValue((prev) => prev + progressIncrementValue);
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
          (decodedBuffer) => {
            const duration = decodedBuffer.duration;
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

  const encodeFile = async (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      const audioContext = new AudioContext();
      fileReader.onload = async () => {
        const arrayBuffer = fileReader.result as ArrayBuffer;

        const wav = lamejs.WavHeader.readHeader(new DataView(arrayBuffer));
        const wavData = new Int16Array(
          arrayBuffer,
          wav.dataOffset,
          wav.dataLen / 2,
        );

        const channels = wav.channels;
        const sampleRate = wav.sampleRate;
        const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128);
        var mp3Data = [];
        const audioBuffer = await audioContext.decodeAudioData(
          arrayBuffer.slice(0),
        );
        const left = audioBuffer.getChannelData(0);
        const right = channels === 2 ? audioBuffer.getChannelData(1) : null;

        for (let i = 0; i < left.length; i++) {
          const sample = Math.max(-1, Math.min(1, left[i])) * 0x7fff;

          left[i] = sample;
        }
        if (right) {
          for (let i = 0; i < right.length; i++) {
            const sample = Math.max(-1, Math.min(1, right[i])) * 0x7fff;

            right[i] = sample;
          }
        }

        const sampleBlockSize = 1152; //can be anything but make it a multiple of 576 to make encoders life easier
        let remaining = wavData.length;
        for (let i = 0; remaining >= sampleBlockSize; i += sampleBlockSize) {
          if (right) {
            const leftChunk = left.subarray(i, i + sampleBlockSize);
            const rightChunk = right.subarray(i, i + sampleBlockSize);
            const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
            if (mp3buf.length > 0) {
              mp3Data.push(mp3buf);
            }
          } else {
            const sampleChunk = left.subarray(i, i + sampleBlockSize);
            const mp3buf = mp3encoder.encodeBuffer(sampleChunk);
            if (mp3buf.length > 0) {
              mp3Data.push(mp3buf);
            }
          }
          remaining -= sampleBlockSize;
        }
        const mp3buf = mp3encoder.flush();

        if (mp3buf.length > 0) {
          mp3Data.push(mp3buf);
        }

        const blob: Blob = new Blob(mp3Data, { type: "audio/mp3" });
        resolve({ succes: true, mp3: blob });
      };
      fileReader.readAsArrayBuffer(file);
    });
  };

  const encodeFilesAsMp3 = async (totalTasks: number) => {
    const encodedLoops = [];
    const encodedOneAhots = [];
    //encode Loops
    for (let i = 0; i < loops.length; i++) {
      const { mp3 }: encodeMp3Response = await encodeFile(oneShots[i]);
      encodedLoops.push({ mp3, name: loops[i].name });
      updateProgress(totalTasks);
    }
    for (let i = 0; i < oneShots.length; i++) {
      const { mp3 }: encodeMp3Response = await encodeFile(oneShots[i]);
      console.log("current file: ", oneShots[i]);
      encodedOneAhots.push({ mp3, name: oneShots[i].name });
      updateProgress(totalTasks);
    }
    return { encodedOneAhots, encodedLoops };
  };

  const handleBundleUpload = async () => {
    const totalTasks = (loops.length + oneShots.length + 1) * 2;
    setModalUploadProgressOpen(() => true);
    const blobOfZippedAudioFiles = await zipFilesToUpload(totalTasks);
    const filesEncodedAsMp3 = await encodeFilesAsMp3(totalTasks);
    const bundleName = nameInputRef.current?.value;
    const tags = buildTagsFromString();
    for (let i = 0; i < filesEncodedAsMp3.encodedOneAhots.length; i++) {
      const currentBlob = filesEncodedAsMp3.encodedOneAhots[i];
      const { data, error } = await supabase.storage
        .from("test-mp3s")
        .upload(`public/${Math.random()}.mp3`, currentBlob.mp3, {
          cacheControl: "3600",
          upsert: false,
        });
      if (data) {
        console.log("data by supabase upload: ", data);
        updateProgress(totalTasks);
      }

      if (error) console.log("error supabase upload: ", error);
    }
    const { data, error } = await supabase.storage
      .from("zip-compressed-sample-packs")
      .upload(`public/${bundleName}.zip`, blobOfZippedAudioFiles, {
        cacheControl: "3600",
        upsert: false,
      });
    if (data) {
      console.log("data by supabase upload: ", data);
      updateProgress(totalTasks);
    }
    if (error) console.log("error supabase upload: ", error);
    updateProgress(totalTasks, true);
    console.log("samples to upload", { loops, oneShots });
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

  useEffect(() => {
    console.log("progress value set: ", progressValue);
  }, [progressValue]);

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
          <UploadConfirmationModal handleBundleUpload={handleBundleUpload} />
        </CardFooter>
      </Card>
      <UploadProgressModal
        open={modalUploadProgressOpen}
        value={progressValue}
      />
      <Toaster theme="dark" style={{ borderColor: "#cf3e67 !important" }} />
    </div>
  );
};
