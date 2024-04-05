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
export const UploadPage = () => {
  //
  const [loops, setLoops] = useState<Array<File>>([]);
  const [oneShots, setOneShots] = useState<Array<File>>([]);

  const loopsRef = useRef(null);
  const oneShotsRef = useRef(null);

  const handleDrop = (e: Event, container: string) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragover = (e: Event, container: string) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    loopsRef.current.addEventListener("dragover", (e: Event) =>
      handleDragover(e, "loops"),
    );
    loopsRef.current.addEventListener("drop", (e: Event) =>
      handleDrop(e, "loops"),
    );
    oneShotsRef.current.addEventListener("dragover", (e: Event) =>
      handleDragover(e, "oneShots"),
    );
    oneShotsRef.current.addEventListener("drop", (e: Event) =>
      handleDrop(e, "oneShots"),
    );

    return () => {
      loopsRef.current.removeEventListener("dragover", (e: Event) =>
        handleDragover(e, "loops"),
      );
      loopsRef.current.removeEventListener("drop", (e: Event) =>
        handleDrop(e, "loops"),
      );
      oneShotsRef.current.removeEventListener("dragover", (e: Event) =>
        handleDragover(e, "oneShots"),
      );
      oneShotsRef.current.removeEventListener("drop", (e: Event) =>
        handleDrop(e, "oneShots"),
      );
    };
  }, []);

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
                    <h1>Jetzt gehts aber los hier!</h1>
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
