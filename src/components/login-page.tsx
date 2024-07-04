import { Link, redirect } from "@tanstack/react-router";
import { supabase } from "@/supabase";
import { router } from "@/main";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Input } from "./ui/input";
import { useRef } from "react";
export const Login = () => {
  const passWordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleLogin = async () => {
    if (emailRef.current?.value && passWordRef.current?.value) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailRef.current.value,
        password: passWordRef.current.value,
      });
      console.log("besc data: ", { data, error });
      if (data.session) {
        router.history.push("/upload");
      }
    }
  };

  return (
    <div className="mt-24">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Don`t have an account? Sign up{" "}
            <Link to="/signup" className="text-[#3ecf8e]/90">
              here!
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="email"
            style={{ outline: "none !important" }}
            placeholder="Email"
            className="mb-4 border-transparent focus:border-transparent focus:!ring-0"
            ref={emailRef}
          />
          <Input
            type="password"
            className="border-transparent focus:border-transparent focus:!ring-0"
            placeholder="Password"
            ref={passWordRef}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" className="hover:!border-[#cf3e67]/40">
            Cancel
          </Button>
          <Button
            variant="outline"
            className=" !border-[#3ecf8e]/20 !h-10
            w-20 hover:!bg-[#3ecf8e]/30 hover:!border-[#3ecf8e]/50 h-8 flex
            items-center justify-center ml-2"
            onClick={handleLogin}
          >
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
