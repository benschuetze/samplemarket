import { createFileRoute } from "@tanstack/react-router";
import { UploadPage } from "../components/upload-page";
export const Route = createFileRoute("/upload")({
  component: Upload,
});

function Upload() {
  return <UploadPage />;
}
