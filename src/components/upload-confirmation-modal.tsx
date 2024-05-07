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
  loops: Array<File>;
  oneShots: Array<File>;
  bundleName: string | undefined;
};

export const UploadConfirmationModal = ({
  oneShots,
  loops,
  handleBundleUpload,
  bundleName,
}: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className=" !border-[#3ecf8e]/20 
            !h-10 hover:!bg-[#3ecf8e]/30
              hover:!border-[#3ecf8e]/50 h-8 flex items-center"
          disabled={(!oneShots.length && !loops.length) || !bundleName}
        >
          Upload
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm rounde rounded-md">
        <AlertDialogHeader className="!flex-left">
          <AlertDialogTitle>Upload this bundle?</AlertDialogTitle>
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
            onClick={() => handleBundleUpload()}
          >
            Yes
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
