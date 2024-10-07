import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getAccessToken, getMe } from "./services/api/users";
import { setCookie } from "./components/actions/setCookie";

export default async function middleware(req: NextRequest, resp: NextResponse) {
  const cookieStore = cookies();

  const nonProtectedRoute = ["/live-market"];

  const isAuthenticated = !!cookieStore.get("accessToken");
  let accessToken = cookieStore.get("accessToken")?.value || "";
  let refreshToken = cookieStore.get("refreshToken")?.value || "";

  const res = await getMe(accessToken);

  console.log("middle man", req.nextUrl.pathname);
  if (res.status === 401) {
    const newRes = await getAccessToken(refreshToken);
 const statusCode = 307;
    if (accessToken && refreshToken) {
      if (newRes.ok) {
        const newTokens = await newRes.json();
        // await setCookie({ name: "accessToken", value:newTokens.accessToken });

        const response = NextResponse.redirect(new URL(req.url, req.nextUrl), {
          //expire after 30 days
          status: 307,
          headers: [
            [
              "set-cookie",
              `accessToken=${
                newTokens.accessToken
              };  Secure; path=/; expires=${new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ).toUTCString()}`,
            ],
          ],
        });
        response.headers.set("x-middleware-cache", "no-cache");

        return response;
      } else {
        //delete cookies

        return NextResponse.redirect(new URL("/", req.nextUrl), {
          headers: [
            [
              "set-cookie",
              `accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`,
            ],
            [
              "set-cookie",
              `refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`,
            ],
          ],
        });
      }
    }
  }

  if (
    !isAuthenticated &&
    !nonProtectedRoute.includes(req.nextUrl.pathname) &&
    req.nextUrl.pathname !== "/"
  ) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (isAuthenticated && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/portfolios", req.nextUrl));
  }
}

export const config = {
  matcher: [
    "/",
    "/alerts",
    "/portfolios",
    "/portfolios/:path*",
    "/live-market",
    "/watchlists",
    "/profile",
  ],
};
