"use client";

import useStore from "@/states/authStore";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

function UpdateAuth({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  const { setAuthDetail } = useStore((state) => state);
  const searchParam = useSearchParams();
  const router = useRouter();


  const next = decodeURIComponent(searchParam.get("redirectUri") || "");
  console.log(next);


  useEffect(() => {
    setAuthDetail(accessToken, refreshToken);
    if (next) {
      window.location.href = next;
    } else {
      window.location.href = "/";
    }
    
  }, []);

  return (
    <div className="flex flex-col gap-10 items-center">
      <h1 className=" font-semibold text-2xl">Your Session Expired..</h1>
      <p>Refresing Auth Details.....</p>
    </div>
  );
}

export default UpdateAuth;
