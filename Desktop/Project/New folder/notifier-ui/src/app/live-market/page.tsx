export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { Metadata } from "next";
import GetLivemarket from "./GetLivemarket";


export const metadata: Metadata = {
  title: "Live Market",
};
async function Page() {
  const cookie = cookies();
  const accessToken = cookie.get("accessToken")?.value || "";


  return (
    <>
      <GetLivemarket accessToken={accessToken} />
    </>
  );
}

export default Page;
