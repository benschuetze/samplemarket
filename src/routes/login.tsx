import { createFileRoute } from "@tanstack/react-router";
import { Login } from "@/components/login-page";

export const Route = createFileRoute("/login")({
  component: () => <Login />,
});
<Login />;

