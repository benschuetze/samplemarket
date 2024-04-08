import { UploadedSample } from "./uploaded-sample";
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
import { useDebugValue, useEffect, useRef, useState } from "react";

type RejectedSample = {
  file: File;
  rejectionCause: string;
  type: string;
};

export const UploadPage = () => {
  //
  const [loops, setLoops] = useState<Array<File>>([]);
  const [oneShots, setOneShots] = useState<Array<File>>([]);
  const [rejectedSamples, setRejectedSamples] = useState<Array<RejectedSample>>(
    [],
  );

  const loopsRef = useRef<HTMLDivElement>(null);
  const oneShotsRef = useRef<HTMLDivElement>(null);

  const onUpload = (files: Array<File>, container: string) => {
    console.log("files to uload: ", files);
    if (container === "loops") setLoops((prev) => [...prev, ...files]);
    //@ts-ignore
    if (container === "oneShots") setOneShots((prev) => [...prev, ...files]);
  };

  const handleDrop = (e: DragEvent, container: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    let audioFiles: File[] = [];
    if (e.dataTransfer) {
      const { files } = e.dataTransfer || { files: [] };
      // check the duration of the sample and prevent it from being uploaded if it's too long
      audioFiles = [...files];
      audioFiles.forEach((file) => {
        // reject all files that are mp3 format
        if (file.type.includes("mp3") || file.type.includes("mpeg")) {
          audioFiles.splice(audioFiles.indexOf(file), 1);
          setRejectedSamples((prev) => [
            ...prev,
            { file, rejectionCause: "mp3", type: container },
          ]);
          return;
        }

        // check duration, remove too long samples and save removed sample
        const fileReader = new FileReader();
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        fileReader.onload = () => {
          const arrayBuffer = fileReader.result as ArrayBuffer;
          audioContext.decodeAudioData(
            arrayBuffer,
            (buffer) => {
              const duration = buffer.duration;
              if (duration > 5) {
                audioFiles.splice(audioFiles.indexOf(file), 1);
                setRejectedSamples((prev) => [
                  ...prev,
                  { file, rejectionCause: "length", type: container },
                ]);
              }
            },
            (error) => {
              console.log("ERROR ERROR ERROR", error);
            },
          );
        };
        fileReader.readAsArrayBuffer(file);
      });
    }

    if (audioFiles && audioFiles.length) {
      onUpload(audioFiles, container);
    }
  };

  const handleDragover = (e: DragEvent, container: string) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    //useEffect kept verose and not functionalized for readability
    if (loopsRef.current && oneShotsRef.current) {
      loopsRef.current.addEventListener("dragover", (e: DragEvent) =>
        handleDragover(e, "loops"),
      );
      loopsRef.current.addEventListener("drop", (e: DragEvent) =>
        handleDrop(e, "loops"),
      );
      oneShotsRef.current.addEventListener("dragover", (e: DragEvent) =>
        handleDragover(e, "oneShots"),
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
    console.log("rejected samples now: ", rejectedSamples);
  }, [rejectedSamples]);

  useEffect(() => {
    console.log("one shots now: ", oneShots);
  }, [oneShots]);

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
                <Card ref={oneShotsRef} className="min-h-32  px-3  py-2">
                  {oneShots.length <= 0 ? (
                    <span className="text-sm text-zinc-400">
                      Drag and drop your one shot samples here...
                    </span>
                  ) : (
                    oneShots.map((item, i) => {
                      return <UploadedSample key={i} />;
                    })
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
                    <h1>Jetzt gehts aber los hier!</h1>
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
    </div>
  );
};
