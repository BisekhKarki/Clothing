import ArrowButton from "@/components/ArrowButton";
import React from "react";
import HomeImage from "../../public/Home.png";
import ManageImage from "../../public/Manage.png";
import Image from "next/image";
import { LiaTelegram } from "react-icons/lia";
import { MdOutlineMail, MdArrowOutward } from "react-icons/md";
import { SlGraph } from "react-icons/sl";
import { FaRegBookmark } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa6";
import Link from "next/link";
import { Metadata } from "next";
import LoginWithGoogle from "@/components/LoginWithGoogle";

export const metadata: Metadata = {
  title: "Real-Time #NEPSE Stock Prices & Alerts",
};

const Page = () => {
  const manageItems = [
    {
      title: "Create Alerts",
      icon: <LiaTelegram className="text-[46px]" />,
    },
    {
      title: "Create Portfolio",
      icon: <SlGraph className="text-[46px]" />,
    },
    {
      title: "Watchlist Stocks",
      icon: <FaRegBookmark className="text-[46px]" />,
      link: "/live-market",
    },
  ];

  return (
    <>
      <section className="min-h-[86vh] md:px-[70px] bg-[#0e0e0ee1]  px-6 flex flex-col items-center justify-center gap-[50px] relative">
        <Image src={HomeImage} alt="Home" fill={true} className="-z-20" />
        <div className="flex flex-col gap-5 font-poppins">
          <h1 className=" font-black text-[50px] md:text-[80px] leading-[60px] md:leading-[100px] text-center mb-4">
            Manage #NEPSE portfolio <br /> and create alerts
          </h1>

          <p className="text-center text-[12px] md:text-[14px] ">
            use Dharke to manage #NEPSE portfolios, create alerts and integrate{" "}
            <br /> messaging platforms for notifications
          </p>
        </div>
        <LoginWithGoogle>
          <ArrowButton text="Get Started" />
        </LoginWithGoogle>
      </section>

      <section className="min-h-screen relative flex flex-col items-center">
        <div className="relative flex flex-col w-full">
          <Image src={ManageImage} alt="Manage" fill={true} className="-z-20" />
          <div className="flex flex-col gap-10 items-center">
            <h1 className="text-2xl md:text-[60px] font-semibold">
              Manage Alerts
            </h1>
            <p className="text-[14px]">
              track #NEPSE stock prices and get notified on your devices.
            </p>
          </div>
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-y-[50px] gap-x-[119px] px-6 md:px-[20%] py-6 md:py-[8%]">
            {manageItems.map((item, index) => (
              <LoginWithGoogle key={index}>
                <div className="flex gap-[15px] items-center border border-[#fff] rounded-[24px] px-4 md:px-[34px] py-[24px] min-w-[300px]">
                  <div>{item.icon}</div>
                  <h2 className="text-lg">{item.title}</h2>
                </div>
              </LoginWithGoogle>
            ))}
            <Link
              href="/live-market"
              className="bg-[#fff] text-black flex items-center justify-center gap-2 rounded-[24px] text-lg  px-4 md:px-[34px] py-[24px] min-w-[300px]"
            >
              <span>Watch #NEPSE price live</span>
              <FaChartLine />
            </Link>
          </div>
        </div>
        <LoginWithGoogle>
          <ArrowButton text="Integrate Now" />
        </LoginWithGoogle>
      </section>
    </>
  );
};

export default Page;
