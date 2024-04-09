import { useEffect, useState } from "react";
import { Activity, AudioLines } from "lucide-react";
import { Card } from "./ui/card";

export const UploadedSample = ({ name, type }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 150);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Card
      className={`
      w-16
      m-1
      p-1
      h-16
      text-xs
      overflow-hidden
      text-center
      ${isVisible ? "opacity-100 transition-opacity duration-150" : "opacity-0"}
    `}
    >
      {type === "loop" ? (
        <AudioLines className="mx-auto" />
      ) : (
        <Activity className="mx-auto" />
      )}
      <span className="mx-auto text-zinc-500 overflow-wrap break-word text-center">
        {name}
      </span>
    </Card>
  );
};
