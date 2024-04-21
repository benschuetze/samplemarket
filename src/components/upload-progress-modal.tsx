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

export const UploadProgressModal = ({ open, value }) => {
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
