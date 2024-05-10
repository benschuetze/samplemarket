import { createFileRoute, redirect } from "@tanstack/react-router";
import { UploadPage } from "../components/upload-page";
import { Login } from "@/components/login-page";
import { supabase } from "@/supabase";
import { useEffect, useState } from "react";
export const Route = createFileRoute("/upload")({
  component: Upload,
  beforeLoad: async ({ location }) => {
    const authResult = await supabase.auth.getSession();
    if (!authResult.data.session) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function Upload() {
  return <UploadPage />;
}
