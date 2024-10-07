import React from "react";
import UpdateAuth from "./UpdateAuth";
import { cookies } from "next/headers";
function page() {
  const accessToken = cookies().get("accessToken")?.value || "";
  const refreshToken = cookies().get("refreshToken")?.value || "";
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <UpdateAuth accessToken={accessToken} refreshToken={refreshToken} />
    </div>
  );
}

export default page;
