import Image from "next/image";
import Logo from "../../public/Logo.png";
import Link from "next/link";
import LoginWithGoogle from "./LoginWithGoogle";
// import useStore from "@/states/authStore";
import Profile from "./Profile";
// import { useRouter } from "next/navigation";
// import { usePathname } from "next/navigation";
import { CgMenuRightAlt } from "react-icons/cg";
import { GiCancel } from "react-icons/gi";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { headers, cookies } from "next/headers";
import { MdArrowOutward } from "react-icons/md";
import { BASE_URL } from "@/constant/constant";
import { BiUpArrowAlt } from "react-icons/bi";

async function Navbar() {
  const isAuthenticated = !!cookies().get("accessToken");
  const accessToken = cookies().get("accessToken")?.value || "";
  const refreshToken = cookies().get("refreshToken")?.value || "";

  const res = await fetch(`${BASE_URL}/api/indices/NEPSE`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  let data = { last: 0, prevClose: 0 };

  if (res.ok) {
    data = await res.json();
  }
  const change = data.last - data.prevClose;
  const chagePercentage = (change / data.prevClose) * 100;

  return (
    <>
      {/* Navbar for desktop */}
      <header className="md:flex hidden justify-between items-center md:px-[70px] px-6 h-[15vh] bg-[#0e0e0ee1]">
        <Link href="/">
          <Image src={Logo} alt="Logo" width={200} height={60} />
        </Link>

        {data && (
          <div className="flex flex-col items-center">
            <span className="text-white">NEPSE</span>
            <span
              className={`${
                change > 0 ? "text-green-500" : "text-red-500"
              } flex items-center text-[12px]`}
            >
              {data.last.toFixed(2)} (
              <BiUpArrowAlt
                className={`${
                  change > 0 ? "text-green-500" : "text-red-500 rotate-180"
                }`}
              />
              {chagePercentage.toFixed(2)}%)
            </span>
          </div>
        )}
        <nav className="">
          <ul className="flex gap-6 text-lg">
            <li role="button">
              {isAuthenticated ? (
                <Link href="/portfolios">Portfolios</Link>
              ) : (
                <LoginWithGoogle>Portfolios</LoginWithGoogle>
              )}
            </li>
            <li role="button">
              {isAuthenticated ? (
                <Link href="/alerts">Alerts</Link>
              ) : (
                <LoginWithGoogle>Alerts</LoginWithGoogle>
              )}
            </li>
            <li role="button">
              <Link href="/live-market">Live Market</Link>
            </li>
            <li role="button">
              {isAuthenticated ? (
                <Link href="/watchlists">Watchlists</Link>
              ) : (
                <LoginWithGoogle>Watchlists</LoginWithGoogle>
              )}
            </li>
          </ul>
        </nav>

        {isAuthenticated && (
          <Profile accessToken={accessToken} refreshToken={refreshToken} />
        )}
        {!isAuthenticated && (
          <LoginWithGoogle>
            {" "}
            <div className="flex items-center justify-center w-full text-black bg-white px-6 py-[6px] text-xl rounded-[5px]">
              <span>Login</span>
              <MdArrowOutward />
            </div>{" "}
          </LoginWithGoogle>
        )}
      </header>

      {/* Navbar for mobile */}
      <header className="flex md:hidden justify-between items-center md:px-[70px] px-6 h-[15vh] bg-[#0e0e0ee1]">
        <Link href="/">
          <Image src={Logo} alt="Logo" width={132} height={150} />
        </Link>
        <Drawer direction="right">
          <DrawerTrigger className="">
            <CgMenuRightAlt size={48} />
          </DrawerTrigger>
          <DrawerContent className="z-[999999]">
            <DrawerTitle className="flex justify-between items-center px-4 py-2">
              {isAuthenticated && (
                <Profile
                  accessToken={accessToken}
                  refreshToken={refreshToken}
                />
              )}
              {!isAuthenticated && (
                <LoginWithGoogle>
                  {" "}
                  <div className="flex z-[999999] items-center justify-center w-full text-black bg-white px-6 py-[6px] text-xl rounded-[5px]">
                    <span>Login</span>
                    <MdArrowOutward />
                  </div>{" "}
                </LoginWithGoogle>
              )}
              <DrawerClose>
                <GiCancel className="text-black text-3xl" />
              </DrawerClose>
            </DrawerTitle>

            <nav className="flex flex-col gap-5 mt-10">
              <Link href="/portfolios" className="text-black font-bold text-xl">
                <DrawerClose className="text-left hover:bg-[#d5d5d5] w-full px-5 py-2">
                  Portfolios
                </DrawerClose>
              </Link>
              <Link href="/alerts" className="text-black font-bold text-xl">
                <DrawerClose className="text-left hover:bg-[#d5d5d5] w-full px-5 py-2">
                  Alerts
                </DrawerClose>
              </Link>
              <Link
                href="/live-market"
                className="text-black font-bold text-xl"
              >
                <DrawerClose className="text-left hover:bg-[#d5d5d5] w-full px-5 py-2">
                  Live Market
                </DrawerClose>
              </Link>
              <Link href="/watchlists" className="text-black font-bold text-xl">
                <DrawerClose className="text-left hover:bg-[#d5d5d5] w-full px-5 py-2">
                  Watchlists
                </DrawerClose>
              </Link>
              {data && (
                <div className="text-black font-bold text-xl">
                  <span className="text-left w-full px-5 py-2">NEPSE</span>
                  <span
                    className={`${
                      change > 0 ? "text-green-500" : "text-red-500"
                    } flex items-center text-[12px] px-5`}
                  >
                    {data.last.toFixed(2)} (
                    <BiUpArrowAlt
                      className={`${
                        change > 0
                          ? "text-green-500"
                          : "text-red-500 rotate-180"
                      }`}
                    />
                    {chagePercentage.toFixed(2)}%)
                  </span>
                </div>
              )}
            </nav>
          </DrawerContent>
        </Drawer>
      </header>
    </>
  );
}

export default Navbar;
