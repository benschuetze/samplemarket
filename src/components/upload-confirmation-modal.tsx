import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type Props = {
  handleBundleUpload: Function;
};

export const UploadConfirmationModal = ({ handleBundleUpload }: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className=" !border-[#3ecf8e]/20 
            !h-10 hover:!bg-[#3ecf8e]/30
              hover:!border-[#3ecf8e]/50 h-8 flex items-center"
        >
          Upload
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm rounde rounded-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Upload this bundle?</AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-row w-full !justify-between mt-6">
          <AlertDialogCancel
            className=" 
            !h-10 hover:!bg-[#cf3e67]/30 w-20
              !border-[#cf3e67]/50 h-8 flex  justify-center items-center"
          >
            No
          </AlertDialogCancel>
          <AlertDialogCancel
            className=" !border-[#3ecf8e]/20 !h-10
            w-20 hover:!bg-[#3ecf8e]/30 hover:!border-[#3ecf8e]/50 h-8 flex
            items-center justify-center"
            onClick={() => handleBundleUpload()}
          >
            Yes
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
