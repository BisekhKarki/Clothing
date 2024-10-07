"use client";

import useStore from "@/states/authStore";
import React from "react";
import { toast } from "../ui/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

function Logout() {
  const { deleteAuthDetail, setAuthDetail } = useStore((state) => state);

  const handleLogout = () => {
    deleteAuthDetail();
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    toast({
      title: "Success!!",
      description: "Logged out successfully! ",
    });
    window.location.reload();
  };

  return (
    <Dialog>
      <DialogTrigger>Logout</DialogTrigger>
      <DialogContent className="bg-[#1c1c1c]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure to log out?</DialogTitle>
          
        </DialogHeader>
        <div className="flex gap-2">
          <DialogClose className="w-1/2 border rounded">Cancel</DialogClose>
          <Button variant="destructive" type="submit" className="w-1/2" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Logout;
