import { AudioLines } from "lucide-react";
import { Card } from "./ui/card";
export const UploadedSample = ({ name }) => {
  return (
    <Card className="w-16 m-1 p-1 h-16 text-xs overflow-hidden text-center">
      <AudioLines className="mx-auto" />
      <span className="mx-auto text-zinc-500 overflow-wrap break-word text-center">
        {name}
      </span>
    </Card>
  );
};
