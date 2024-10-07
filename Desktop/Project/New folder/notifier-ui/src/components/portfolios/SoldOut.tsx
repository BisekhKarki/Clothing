"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VscKebabVertical } from "react-icons/vsc";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dispatch, useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { RiExpandUpDownLine } from "react-icons/ri";
import { Position } from "../../../global";
import numberWithCommas from "@/lib/Comma";
import { useQuery } from "@tanstack/react-query";
import { getPosition } from "@/services/api/portfolios";
import { PaginationDemo } from "../Pagination";

function SoldOut({
  token,
  portfolioId,
  setSearch,
}: {
  token: string;
  portfolioId: string;
  setSearch: Dispatch<React.SetStateAction<string>>;
}) {
  const [showTransactions, setShowTransactions] = useState<boolean>(false);
  const [sort, setSort] = useState<boolean>(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isCompletlySold, setIsCompletlySold] = useState<
    "INACTIVE" | "PARTIAL"
  >("INACTIVE");
  const [urlData, setUrlData] = useState({ limit: 10, offset: 0 });
  const [dataList, setDataList] = useState<{
    limit: number;
    offset: number;
    total: number;
  }>({ limit: 10, offset: 0, total: 0 });

  const { data, refetch, isFetched } = useQuery({
    queryKey: ["positions", portfolioId, "sold"],
    queryFn: async () => {
      return getPosition(
        token,
        portfolioId,
        isCompletlySold,
        urlData.limit,
        urlData.offset
      );
    },
    refetchOnWindowFocus: false,
    enabled: showTransactions,
  });



  useEffect(() => {
    if (showTransactions) {
      refetch();
    }
  }, [isCompletlySold, urlData, refetch, showTransactions]);

  useEffect(() => {
    if (isFetched && data) {
      setDataList({
        limit: data.limit,
        offset: data.offset,
        total: data.total,
      });
      setPositions(data.data);
    }
  }, [data, isFetched]);

  function sortbyTotalPL() {
    if (sort) {
      const sorted = positions.sort(
        (a, b) =>
          (a.realizedGain / a.investedCapital) * 100 -
          (b.realizedGain / b.investedCapital) * 100
      );
      setPositions(sorted);
      setSort(false);
    } else {
      const sorted = positions.sort(
        (a, b) =>
          (b.realizedGain / b.investedCapital) * 100 -
          (a.realizedGain / a.investedCapital) * 100
      );
      setPositions(sorted);
      setSort(true);
    }
  }

  return (
    <div className="bg-[#9b9b9b1a] p-6 rounded-xl">
      <div className="flex justify-between h-[45px] items-start">
        <h1 className="text-[22px] font-semibold">Sold Stocks</h1>
        <div>
          <IoIosArrowDown
            onClick={() => setShowTransactions((prev) => !prev)}
            className={` text-[#888888] cursor-pointer transition-transform ${
              showTransactions && "transform rotate-180"
            }`}
            size={24}
          />
        </div>
      </div>
      {showTransactions && (
        <>
          <div className="flex items-center my-3 gap-2">
            <div
              className={`p-2 cursor-pointer ${
                isCompletlySold === "INACTIVE"
                  ? "text-[#fff] border-b border-[#fff]"
                  : "text-[#a5a5a5]"
              }`}
              onClick={() => setIsCompletlySold("INACTIVE")}
            >
              Total Sold
            </div>
            <div
              className={`p-2 cursor-pointer ${
                isCompletlySold === "PARTIAL"
                  ? "text-[#fff] border-b border-[#fff]"
                  : "text-[#a5a5a5]"
              }`}
              onClick={() => setIsCompletlySold("PARTIAL")}
            >
              Partially Sold
            </div>
          </div>
          <Table className="bg-transparent">
            <TableHeader className="border-0">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="w-[250px] text-[#888888] border-b-0">
                  Symbol
                </TableHead>
                <TableHead className="text-[#888888]">WACC</TableHead>
                <TableHead className="text-[#888888]">Sell Price</TableHead>
                <TableHead className="text-[#888888] whitespace-nowrap">
                  Total PL
                </TableHead>
                <TableHead
                  className="whitespace-nowrap text-[#888888] cursor-pointer overflow-auto hover:text-[#222] hover:bg-white"
                  onClick={sortbyTotalPL}
                >
                  % Total PL
                  <RiExpandUpDownLine className="inline" />
                </TableHead>
                <TableHead className="text-[#888888]">Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border-0">
              {isFetched && positions ? (
                positions.map((position) => {
                  const totalGain = numberWithCommas(
                    position.realizedGain.toFixed(2)
                  );
                  const totalGainPercentage = (
                    (position.realizedGain / position.investedCapital) *
                    100
                  ).toFixed(2);
                  const sellPrice = numberWithCommas(
                    (position.soldCapital / position.soldQuantity).toFixed(2)
                  );
                  return (
                    <TableRow
                      className=" border-b-0 border-t-0"
                      key={position._id}
                    >
                      <TableCell className="font-medium">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>{position.symbol}</TooltipTrigger>
                            <TooltipContent>
                              {position.stock.title}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>

                      <TableCell>
                        {numberWithCommas(position.wacc.toString())}
                      </TableCell>
                      <TableCell>{sellPrice}</TableCell>

                      <TableCell>{totalGain}</TableCell>
                      <TableCell
                        className={`${
                          parseFloat(totalGainPercentage) >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {parseFloat(totalGainPercentage) >= 0 ? (
                          <FaArrowUp
                            style={{ display: "inline-block" }}
                            color="green"
                          />
                        ) : (
                          <FaArrowDown
                            style={{ display: "inline-block" }}
                            color="red"
                          />
                        )}
                        {Math.abs(parseFloat(totalGainPercentage))}%
                      </TableCell>

                      <TableCell>
                        <Popover>
                          <PopoverTrigger>
                            {" "}
                            <VscKebabVertical />
                          </PopoverTrigger>
                          <PopoverContent className="bg-[#5b5b5b] w-[100px] m-0 p-0 overflow-hidden border-none">
                            <div
                              onClick={() => {
                                setSearch(position.symbol);
                                window.location.href = `#transactions`;
                              }}
                              className="text-[#fff] hover:bg-black cursor pointer h-10 px-2 w-full flex items-center justify-center cursor-pointer"
                            >
                              Edit
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className=" border-b-0 border-t-0">
                  <TableCell className="font-medium" colSpan={7}>
                    No Transactions
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <PaginationDemo
            // dataList={{ limit: 10, offset: 0, total: 20 }}
            portfolioId={portfolioId}
            dataList={dataList}
            urlData={urlData}
            setUrlData={setUrlData}
          />
        </>
      )}
    </div>
  );
}

export default SoldOut;
