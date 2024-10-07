import { getMe } from "@/services/api/users";
import { cookies } from "next/headers";
import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Pricing from "@/components/Pricing";

import ChangeUsername from "@/components/buttons/ChangeUsername";

async function page() {
  const cookie = cookies();
  const token = cookie.get("accessToken")?.value || "";
  const res = await getMe(token.toString());

  const user = await res.json();

  return (
    <div className="min-h-[86vh] md:px-[12%] sm:px-[10%] px-[8%]   py-5 ">
      <h1 className="text-[40px] font-semibold">Profile</h1>
      <div className="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900">
        <div className="rounded-t-lg h-32 bg-[#222] overflow-hidden"></div>
        <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
          <img
            className="object-cover object-center h-32"
            src={`https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=${user?.username}`}
            alt={`${user?.username} profile pic`}
          />
        </div>
        <div className="text-center mt-2 flex flex-col gap-3 items-center justify-center">
          <h2 className="font-semibold flex items-center gap-2">
            {user.username}
            <ChangeUsername initalName={user.username} token={token} />
          </h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
        <div className="space-y-1 text-center justify-center mt-2">
          <p>Current Plan: {user.subscription.title}</p>
          <p>Upto {user.subscription.permissions.maxPortfolios} Portfolio/s</p>
          <p>Upto {user.subscription.permissions.maxAlerts} Alerts</p>
          <p>Upto {user.subscription.permissions.maxWatchlists} Watchlists</p>
        </div>
        <div className="p-4 border-t flex items-center w-full justify-center mt-2">
          <Dialog>
            <DialogTrigger className="block mx-auto rounded-md border border-gray-900 hover:shadow-lg font-semibold text-[#222] px-6 py-2">
              View Plans
            </DialogTrigger>
            <DialogContent className="bg-black border border-[#807f7f] px-3 py-2 m-0 text-[#fff] max-w-[80vw] ">
              <Pricing />
            </DialogContent>
          </Dialog>
          <a
            href="https://forms.gle/A4K4Y93sv3uzvRzU8"
            target="_blank"
            className="block mx-auto rounded-md bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2"
          >
            Upgrade Plan
          </a>
        </div>
      </div>
    </div>
  );
}

export default page;
