"use client";
import AddPortfolios from "@/components/AddPortfolios";
import { BASE_URL } from "@/constant/constant";
import useStore from "@/states/authStore";
import { useEffect, useState } from "react";
import { Portfolio } from "../../../global";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdArrowOutward } from "react-icons/md";
import HoverButton from "@/components/buttons/HoverButton";
import ManagePortfolio from "@/components/ManagePortfolio";
import numberWithCommas from "@/lib/Comma";
import { useRouter } from "next/navigation";
import { getAllPortfolios } from "@/services/api/portfolios";

function GetPortfolios({accessToken}: {accessToken: string}) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);


  const [portfolioCount, setPortfolioCount] = useState(0);
  const route = useRouter();

  const { user } = useStore((state)=>state)

  useEffect(() => {
    async function getPortfolios() {
      const response = await getAllPortfolios(accessToken);
     
      if (!response.ok) {
        if (response.status === 401) {
          route.refresh();
        }
        if(response.status === 403) {
          route.push("/forbidden");
        }
        return;
      };

      const data = await response.json();
      setPortfolios(data.data);
      setPortfolioCount(data.data.length);
    }
    getPortfolios();
  }, [ accessToken]);

 

  return (
    <div className="min-h-[86vh] md:px-[12%] sm:px-[10%] px-[8%]   py-5 ">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-[40px] font-semibold">Portfolios</h1>
        <div className="w-[150px] rounded-[5px] overflow-hidden">
          <AddPortfolios
            setPortfolios={setPortfolios}
            portfolioCount={portfolios.length}
            setPortfolioCount={setPortfolioCount}
            color="white"
            accessToken={accessToken}
          />
        </div>
      </div>

      {
      portfolios.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-[#7e7e7e]">
          <p>You have not created any portfolio yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2  gap-[38px] relative mb-[38px]">
          {portfolios.map((portfolio:any) => {
              const currentUserRole = portfolio.members.find(
                  (member: any) => member.user === user._id
                )?.role;
            return (
              <div
                key={portfolio._id}
                className="p-6  bg-[#9b9b9b1a] border border-[#9b9b9b4d] backdrop-blur-[30px] rounded-xl"
              >
                <div className="flex flex-col gap-[10px]">
                  <div className="flex justify-between items-center font-medium">
                    <h1>{portfolio.title}</h1>
                    <ManagePortfolio
                      role={currentUserRole}
                      portfolioId={portfolio._id}
                      portfolioDetail={portfolio}
                      updatePortfolio={setPortfolios}
                      setPortfolioCount={setPortfolioCount}
                      accessToken={accessToken}
                    />
                  </div>
                  <p className="text-[#cecece] text-xs truncate">
                    {portfolio.description}
                  </p>
                </div>
                <div className="h-[1px] mt-2 mb-3 bg-[#ffffff33]"></div>

                <div className="flex flex-col gap-2">
                  <p className="text-xl">
                    NPR{" "}
                    {portfolio.value
                      .toFixed(2)
                      .split(".")
                      .map((txt: string, ind:any) =>
                        ind == 0 ? (
                          <span key={ind} className="text-[36px]">
                            {numberWithCommas(txt)}
                          </span>
                        ) : (
                          <span key={ind}>.{txt}</span>
                        )
                      )}{" "}
                    <br />
                    <span
                      className={`text-lg ${
                        portfolio.dailyGain >= 0
                          ? "text-[#53FF8E]"
                          : "text-[#c62d2d]"
                      }  flex items-center gap-[5px]`}
                    >
                      {portfolio.dailyGain >= 0 ? (
                        <MdArrowOutward />
                      ) : (
                        <MdArrowOutward
                          style={{ transform: "rotate(90deg)" }}
                        />
                      )}
                      {portfolio.dailyGainPercentage.toFixed(2)}% (
                      {portfolio.dailyGain >= 0 ? "+" : "-"} NPR{" "}
                      {numberWithCommas(
                        Math.abs(portfolio.dailyGain).toFixed(2)
                      )}
                      )
                    </span>
                  </p>
                  <div className="self-end">
                    <HoverButton
                      buttonLink={"/portfolios/" + portfolio._id}
                      buttonText="See More"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
        <AddPortfolios
        setPortfolios={setPortfolios}
        portfolioCount={portfolios.length}
        setPortfolioCount={setPortfolioCount}
        color="black"
        accessToken={accessToken}
      />
      
    </div>
  );
}

export default GetPortfolios;
