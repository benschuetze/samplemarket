import { ChangeEvent, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Input } from "./ui/input";
import { useRef } from "react";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { supabase } from "@/supabase";

export const SignUp = () => {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const userNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const tagsRef = useRef<HTMLTextAreaElement>(null);

  const [createDisabled, setCreateDisabled] = useState(true);

  const handleImageSelected = (e: ChangeEvent) => {
    const url = URL.createObjectURL(e.target.files[0]);
    setProfileImageUrl(url);
  };

  const handleSignUp = async () => {
    if (emailRef.current?.value && passwordRef.current?.value) {
      const { data, error } = await supabase.auth.signUp({
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
        options: {
          emailRedirectTo: "http://localhost:5173/upload"
        }
      });

      console.log("Data and error: ", { data, error });
      if(error) {
        console.error("Error while creating account: ", error)
        return
      }
      
    }
  };

  const checkCreationPossible = () => {
    if (
      userNameRef.current?.value &&
      passwordRef.current?.value &&
      emailRef.current?.value
    ) {
      setCreateDisabled(false);
    }
  };

  return (
    <div className="mt-24">
      <Card className="w-[600px] mx-auto !relative">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex justify-center">
            <Avatar className="h-40 w-40 !relative border-gray-600 border">
              <AvatarImage
                src={profileImageUrl || undefined}
                className="object-cover object-center w-full h-full border"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Input
              onChange={(e) => handleImageSelected(e)}
              type="file"
              className="hidden"
              id="profile-image-input"
            />
            <svg
              width="40"
              height="40"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-[210px] top-[195px] cursor-pointer text-gray-500 hover:text-white"
              onClick={() =>
                document.getElementById("profile-image-input")?.click()
              }
            >
              <path
                d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM7.50003 4C7.77617 4 8.00003 4.22386 8.00003 4.5V7H10.5C10.7762 7 11 7.22386 11 7.5C11 7.77614 10.7762 8 10.5 8H8.00003V10.5C8.00003 10.7761 7.77617 11 7.50003 11C7.22389 11 7.00003 10.7761 7.00003 10.5V8H4.50003C4.22389 8 4.00003 7.77614 4.00003 7.5C4.00003 7.22386 4.22389 7 4.50003 7H7.00003V4.5C7.00003 4.22386 7.22389 4 7.50003 4Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <div className="flex justify-between">
            <div>
              <Input
                type="string"
                style={{ outline: "none !important" }}
                placeholder="Username"
                className="mb-4 border-transparent w-60  focus:border-transparent focus:!ring-0"
                ref={userNameRef}
                onBlur={checkCreationPossible}
              />
            </div>
            <div className="ml-8 mb-8">
              <Input
                type="email"
                style={{ outline: "none !important" }}
                placeholder="Email"
                className="mb-4 w-60 border-transparent focus:border-transparent focus:!ring-0"
                ref={emailRef}
                onBlur={checkCreationPossible}
              />
              <Input
                type="password"
                className="border-transparent w-60 focus:border-transparent focus:!ring-0"
                placeholder="Password"
                ref={passwordRef}
                onBlur={checkCreationPossible}
              />
            </div>
          </div>
          <Label htmlFor="name" className="-mb-2 !w-1/2 text-gray-200">
            What Genres do you produce?
          </Label>
          <Textarea
            className="border-transparent focus:border-transparent focus:!ring-0 resize-none"
            style={{ outline: "none !important" }}
            placeholder="Techno House Jazz DeathMetal WitchHouse HyperPop ..."
            ref={tagsRef}
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
            disabled={createDisabled}
            onClick={() => handleSignUp()}
          >
            Create
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
