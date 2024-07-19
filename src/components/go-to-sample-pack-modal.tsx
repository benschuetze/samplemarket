import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  goToSamplePack: Function;
};

export const GoToSamplePackModal = ({ open, goToSamplePack }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setModalOpen(true);
      }, 1000);
    }
  }, [open]);
  return (
    <AlertDialog open={modalOpen}>
      <AlertDialogContent className="max-w-sm rounde rounded-md">
        <AlertDialogHeader className="">
          <AlertDialogTitle>
            Do you want to go to your sample Pack?
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-row w-full !justify-end mt-6">
          <AlertDialogCancel
            className=" 
            !h-10 hover:!bg-[#cf3e67]/30 w-20
              hover:!border-[#cf3e67]/40 h-8 flex  justify-center items-center"
          >
            No
          </AlertDialogCancel>
          <AlertDialogCancel
            className=" !border-[#3ecf8e]/20 !h-10
            w-20 hover:!bg-[#3ecf8e]/30 hover:!border-[#3ecf8e]/50 h-8 flex
            items-center justify-center ml-2"
            onClick={() => {
              goToSamplePack();
              setModalOpen(false);
            }}
          >
            Yes
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
