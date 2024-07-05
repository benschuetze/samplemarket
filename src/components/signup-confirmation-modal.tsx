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
import { router } from "@/main";

export const SignupRedirectModal = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="hidden" id="sign-up-redirect-modal-trigger"></Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm rounde rounded-md">
        <AlertDialogHeader className="">
          <AlertDialogTitle>Almost done!</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Please confirm your email address to log in.
        </AlertDialogDescription>

        <AlertDialogFooter className="flex flex-row w-full !justify-end mt-6">
          <AlertDialogCancel
            className=" !border-[#3ecf8e]/20 !h-10
            w-20 hover:!bg-[#3ecf8e]/30 hover:!border-[#3ecf8e]/50 h-8 flex
            items-center justify-center ml-2"
            onClick={() => router.history.push("/login")}
          >
            Go To Login
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
