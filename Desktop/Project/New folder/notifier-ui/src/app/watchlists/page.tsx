export const fetchCache = 'force-no-store';
import { cookies } from "next/headers";
import { Metadata } from "next";
import GetWatchlists from "./GetWatchlists";


export const metadata: Metadata = {
  title: "Watchlists",
}
async function Page() {
  const cookie = cookies();
  const accessToken = cookie.get("accessToken")?.value || "";

  return (
    <>
      <GetWatchlists accessToken={accessToken} />
    </>
  );
}

export default Page;
