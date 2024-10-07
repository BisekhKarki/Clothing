export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import GetALerts from "@/components/alerts/GetAlerts";
import { getStocks } from "@/services/api/stocks";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Alerts",
}
async function Page() {
  const cookie = cookies();
  const accessToken = cookie.get("accessToken")?.value || "";

  const symbols = await getStocks(accessToken);

  return (
    <>
      <GetALerts accessToken={accessToken} symbols={symbols} />
    </>
  );
}

export default Page;
