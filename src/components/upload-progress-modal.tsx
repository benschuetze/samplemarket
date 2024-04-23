import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "./ui/progress";
import { useEffect } from "react";

export const UploadProgressModal = ({ open, value }) => {
  useEffect(() => {
    console.log("progress value changed: ", value);
  }, [value]);
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Uploading...</DialogTitle>
        </DialogHeader>
        <Progress value={value} />
      </DialogContent>
    </Dialog>
  );
};
