"use client";
import { createJWT } from "@/services/auth.service";
import useStore from "@/states/authStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import setCookies from "@/services/setCookies";

function GoogleLogin() {
  const route = useRouter();
  const toast = useToast();
  const setAuthDetail = useStore((state: any) => state.setAuthDetail);
  useEffect(() => {

    const getAccessTokenFromUrl = async () => {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const googleAccessToken = params.get("access_token");

      if (googleAccessToken) {
        const res = await createJWT({
          code: googleAccessToken,
        });
        if (res) {
          if (res.status === 403) {
            route.push("/forbidden");
            return;
          }

          if (res.ok) {
            const {
              accessToken,
              refreshToken,
            }: { accessToken: string; refreshToken: string } = await res.json();
            
            await setCookies({ name: "accessToken", value: accessToken });
            await setCookies({ name: "refreshToken", value: refreshToken });
            route.push("/portfolios");
            toast.toast({
              title: "Success!!",
              description: "Signed In Successfully!",
            });
            setAuthDetail(accessToken, refreshToken);
            return;
          } else {
            route.push("/");
            return;
          }
        }
      } else {
        console.error("Access Token not found in the URL");
      }
    };

    getAccessTokenFromUrl();
  }, []);

  return (
    <section className="w-full h-screen flex justify-center items-center">
      <h1>Logging in...</h1>
    </section>
  );
}

export default GoogleLogin;
