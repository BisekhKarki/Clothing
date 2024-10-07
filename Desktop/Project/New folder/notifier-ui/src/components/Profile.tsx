"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getMe } from "@/services/api/users";
import Logout from "./buttons/Logout";
import setCookies from "@/services/setCookies";
import { useEffect } from "react";
import useStore from "@/states/authStore";
import Link from "next/link";
function Profile({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  const { user, setUser } = useStore((state) => state);
  console.log("user1");

  useEffect(() => {
    if (!accessToken || user) {
      return;
    }
    const getUser = async () => {
      const res = await getMe(accessToken);
      if (!res.ok) {
        return;
      }

      const use = await res.json();
      setUser(use);
      setCookies({ name: "user", value: JSON.stringify(use) });
      // setAuthDetail(accessToken, refreshToken, user);
      return;
    };
    getUser();
  }, [accessToken, user]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="relative h-8 w-8 rounded-full text-black"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=${user?.username}`}
              alt={user?.username}
            />
            <AvatarFallback>
              {/* {user?.email.split("")[0].toUpperCase()} */}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex flex-col space-y-1">
            View Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="flex flex-col space-y-1">
          <Logout />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Profile;
