import React from "react";
import Share from "../buttons/Share";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import numberWithCommas from "@/lib/Comma";
import { PerformanceType } from "../../../global";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { getPerformance } from "@/services/api/portfolios";
import { BASE_URL } from "@/constant/constant";

function Performance({
  token,
  portfolioId,
}: {
  token: string;
  portfolioId: string;
}) {
  const {
    data: performance,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["performance", portfolioId],
    queryFn: async () => await getPerformance(token, portfolioId),
    refetchOnWindowFocus: false,
  });

  const { data: nepse } = useQuery({
    queryKey: ["nepse"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/indices/NEPSE`);
      const data = await res.json();
      return data;
    },
    refetchOnWindowFocus: false,
  });

  if (isError) {
    return <div>error</div>;
  }

  if (isFetching) {
    return <div>..fetching perfromance</div>;
  }

  const twitterContent = `Portfolio Performance Today \nMy Portfolio: ${
    performance.dailyGainPercentage > 0 ? "📈" : "📉"
  }${performance.dailyGainPercentage.toFixed(2)}%\n#NEPSE: ${
    ((nepse?.last - nepse.prevClose) / nepse.prevClose) * 100 > 0 ? "📈" : "📉"
  }${(((nepse.last - nepse.prevClose) / nepse.prevClose) * 100).toFixed(
    2
  )}%\nShare Yours via`;

  return (
    <div className="min-w-[300px] w-full relative ">
      <Share portfolioContent={twitterContent} />
      <div className="flex flex-col gap-[15px] w-full p-6 h-auto bg-[#9b9b9b1a] border border-[#9b9b9b4d] backdrop-blur-[30px] rounded-xl">
        <h1 className="text-[24px] font-semibold">Performance</h1>
        <ul className="flex flex-col gap-[12px]">
          <li className="font-semibold text-[18px]">Capital</li>

          <li className="flex justify-between items-center">
            <span className="flex items-center gap-1">
              Investment
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HiOutlineExclamationCircle />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>the total amount of money invested.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <span className="font-semibold">
              {numberWithCommas(performance.investedCapital.toString())}
            </span>
          </li>
          <li className="flex justify-between items-center">
            <span className="flex items-center gap-1">
              Current Value
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HiOutlineExclamationCircle />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>the total value of all assets held.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <span className="font-semibold">
              {numberWithCommas(performance.value.toString())}
            </span>
          </li>

          <li className="font-semibold text-[18px]">Performance Breakdown</li>

          <li className="flex justify-between items-center">
            <span className="flex items-center gap-1">
              Daily Gain
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HiOutlineExclamationCircle />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>the change in value from the previous day.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <span className="font-semibold flex items-center gap-1">
              {performance.dailyGainPercentage >= 0 ? (
                <span className="text-green-500 flex items-center">
                  <FaArrowUp />
                  {Math.abs(performance.dailyGainPercentage).toFixed(2)}%
                </span>
              ) : (
                <span className="text-red-500 flex items-center">
                  <FaArrowDown />
                  {Math.abs(performance.dailyGainPercentage).toFixed(2)}%
                </span>
              )}
              {numberWithCommas(performance.dailyGain.toFixed(2))}
            </span>
          </li>
          <li className="flex justify-between items-center">
            <span className="flex items-center gap-1">
              Unrealized Gain
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HiOutlineExclamationCircle />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>the potential profit if assets were sold now.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <span className="font-semibold flex items-center gap-1">
              {performance.unrealizedGainPercentage >= 0 ? (
                <span className="text-green-500 flex items-center">
                  <FaArrowUp />
                  {Math.abs(performance.unrealizedGainPercentage).toFixed(2)}%
                </span>
              ) : (
                <span className="text-red-500 flex items-center">
                  <FaArrowDown />
                  {Math.abs(performance.unrealizedGainPercentage).toFixed(2)}%
                </span>
              )}
              {numberWithCommas(performance.unrealizedGain.toFixed(2))}
            </span>
          </li>
          <li className="flex justify-between items-center">
            <span className="flex items-center gap-1">
              Realized Gain
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HiOutlineExclamationCircle />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>the profit from sold assets.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <span
              className={`font-semibold flex items-center gap-1 ${
                performance.realizedGain >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {numberWithCommas(performance.realizedGain.toFixed(2))}
            </span>
          </li>

          <li className="font-semibold text-[18px]">Transaction costs</li>

          <li className="flex justify-between items-center">
            <span className="flex items-center gap-1">
              Transaction Costs
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HiOutlineExclamationCircle />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Total amount paid as transaction costs, includes broker
                      fees, etc.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <span className="font-semibold">
              {numberWithCommas(performance.costs.toString())}
            </span>
          </li>
          <li className="flex justify-between items-center">
            <span className="flex items-center gap-1">
              Taxes
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HiOutlineExclamationCircle />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total taxes paid after selling stocks in profit.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <span className="font-semibold">
              {numberWithCommas(performance.taxes.toString())}
            </span>
          </li>
        </ul>

        <hr />

        <div>
          <h1 className="text-[20px] font-semibold flex justify-between items-center">
            <span className="flex items-center">
              Overall Gain{" "}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HiOutlineExclamationCircle />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>combines both realized and unrealized gains.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>{" "}
            <span>
              <span
                className={`${
                  performance.realizedGain + performance.unrealizedGain >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                NPR{" "}
                {numberWithCommas(
                  (
                    performance.realizedGain + performance.unrealizedGain
                  ).toFixed(2)
                )}
              </span>
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Performance;
