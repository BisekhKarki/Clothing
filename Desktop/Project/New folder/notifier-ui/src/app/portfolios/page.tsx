export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { getStocks } from "@/services/api/stocks";
import { Metadata } from "next";
import GetPortfolios from "./GetPortfolios";

export const metadata: Metadata = {
  title: "Portfolios",
};
async function Page() {
  const cookie = cookies();
  const accessToken = cookie.get("accessToken")?.value || "";
  console.log("yo");

  return (
    <>
      <GetPortfolios accessToken={accessToken} />
    </>
  );
}

export default Page;
