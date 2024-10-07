import React from "react";
// import { Header } from "../../components/Header";
// import { Navbar } from "../../components/NavBar";
// import { Footer } from "../../components/Footer";
import Blogs from "./Blogs";
import Featured from "./Featured";
import Popular from "./Popular";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Read the latest blogs reagarind the stock market and finance. Stay updated with the latest NEPSE news and updates.",
  keywords: [
    "NEPSE",
    "Nepal Stock Exchange",
    "Stock Prices",
    "Stock Alerts",
    "Stock Market",
    "Dharke",
  ],
};
export default function page() {
  return (
    <>
      <div className="md:pb-[120px] pb-6">
        <div className="md:flex md:justify-center md:items-center">
          <div className="md:max-w-screen-4xl md:w-full">
            {/* <Header />
            <Navbar /> */}
            <div className="text-center text-[#ffffffce] font-semibold text-3xl md:text-[44px] my-10 leading-8 tracking-wide mb-4">
              Blogs
            </div>

            <div className=" lg:flex lg:justify-between lg:gap-10 lg:px-16 2xl:px-56 3xl:px-64 4xl:px-96">
              <Featured />

              <Popular />
            </div>
            <Blogs />
          </div>
        </div>
      </div>
    </>
  );
}
