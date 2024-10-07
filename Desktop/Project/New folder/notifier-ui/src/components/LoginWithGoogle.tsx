"use client";
import { MdArrowOutward } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { BASE_URL } from "@/constant/constant";
import { IconType } from "react-icons/lib";

function LoginWithGoogle({ icon, text, children }: { icon?: any; text?: string; children?: React.ReactNode }) {
  const [error, setError] = useState("");
  async function handleLogin() {
    setError("");
    try {
      const response = await fetch(
        `${BASE_URL}/api/auth/o/google?redirect_uri=${window.location.origin}/auth/google/callback`
      );

      if (!response.ok) {
        if (response.status === 401) {
          setError("Unauthorized");
          return;
        } else if (response.status === 403) {
          setError("Forbidden");
          return;
        } else if (response.status === 400) {
          setError("Bad Request");
          return;
        } else if (response.status === 500) {
          setError("Internal Server Error");
          return;
        }
      }

      const data = await response.json();
      window.location.href = data.authorization_url;
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <Dialog>
      {/* <DialogTrigger
        id="login"
        className={`flex justify-center items-center gap-[5px] ${
          icon || text ? "bg-transparent text-white" : "text-black bg-white"
        }  ${!text && "px-6 py-[6px]"} text-xl rounded-[5px]`}
      >
        {text ? (
          <span>{text}</span>
        ) : icon ? (
          icon
        ) : (
          <div className="flex items-center justify-center w-full">
            <span>Login</span>
            <MdArrowOutward />
          </div>
        )}
      </DialogTrigger> */}
      <DialogTrigger>
        {children}
      </DialogTrigger>
     
      <DialogContent>
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-3xl text-[#0E0E0E] text-center">
            Login
          </DialogTitle>
          <DialogDescription>
            <Button
              id="continue-with-google"
              className="w-full flex items-center gap-2"
              onClick={handleLogin}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="24px"
                height="24px"
              >
                <path
                  fill="#4285F4"
                  d="M24 9.5c3.15 0 5.9 1.2 8.04 3.17l6-6C34.6 3.32 29.6 1 24 1 14.8 1 7.1 6.4 3.67 14.1l6.96 5.4C12.85 13.23 17.95 9.5 24 9.5z"
                />
                <path
                  fill="#34A853"
                  d="M46.67 24.27c0-1.57-.14-3.1-.4-4.6H24v9.19h12.84c-.56 3-2.31 5.5-4.9 7.2l7.6 5.88C43.4 38.07 46.67 31.6 46.67 24.27z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.63 28.4c-1.07-3.18-1.07-6.64 0-9.82L3.67 14.1c-2.34 4.6-2.34 9.9 0 14.5l6.96-5.4z"
                />
                <path
                  fill="#EA4335"
                  d="M24 47c5.55 0 10.23-1.83 13.63-4.96l-7.6-5.88c-2.1 1.44-4.75 2.23-6.93 2.23-6.05 0-11.14-3.73-13.07-8.9l-6.96 5.4C7.1 41.6 14.8 47 24 47z"
                />
                <path fill="none" d="M1 1h46v46H1z" />
              </svg>
              Continue with Google
            </Button>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {error && <p className="text-red-500">{error}</p>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LoginWithGoogle;
