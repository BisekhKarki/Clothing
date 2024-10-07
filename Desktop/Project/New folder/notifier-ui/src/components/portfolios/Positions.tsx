"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VscKebabVertical } from "react-icons/vsc";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Position } from "../../../global";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { RiExpandUpDownLine } from "react-icons/ri";
import numberWithCommas from "@/lib/Comma";
import { useQuery } from "@tanstack/react-query";
import { getPosition } from "@/services/api/portfolios";
import { PaginationDemo } from "../Pagination";

function Positions({
  role,
  setSearch,
  portfolioId,
  token,
  positions,
  setPositions,
  urlData,
  setUrlData,
  dataList,
}: {
  role:string
  setSearch: Dispatch<React.SetStateAction<string>>;
  portfolioId: string;
  token: string;
  positions: Position[];
  setPositions: Dispatch<React.SetStateAction<Position[]>>;
  dataList: any;
  urlData: { limit: number; offset: number };
  setUrlData: Dispatch<
    SetStateAction<{
      limit: number;
      offset: number;
    }>
  >;
}) {
  // const [positions, setPositions] = useState<Position[]>([]);
  const [sortCombo, setSortCombo] = useState({
    dailyPL: false,
    totalPL: false,
  });
  function sortbyDialyPL() {
    if (sortCombo.dailyPL) {
      const sorted = positions.sort(
        (a, b) =>
          (a.stock.last - a.stock.prevClose) * a.quantity -
          (b.stock.last - b.stock.prevClose) * b.quantity
      );
      setPositions(sorted);
      setSortCombo({ dailyPL: false, totalPL: false });
    } else {
      const sorted = positions.sort(
        (a, b) =>
          (b.stock.last - b.stock.prevClose) * b.quantity -
          (a.stock.last - a.stock.prevClose) * a.quantity
      );
      setPositions(sorted);
      setSortCombo({ dailyPL: true, totalPL: false });
    }
  }

  function sortbyTotalPL() {
    if (sortCombo.totalPL) {
      const sorted = positions.sort(
        (a, b) =>
          (a.stock.last - a.wacc) * a.quantity -
          (b.stock.last - b.wacc) * b.quantity
      );
      setPositions(sorted);
      setSortCombo({ dailyPL: false, totalPL: false });
    } else {
      const sorted = positions.sort(
        (a, b) =>
          (b.stock.last - b.wacc) * b.quantity -
          (a.stock.last - a.wacc) * a.quantity
      );
      setPositions(sorted);
      setSortCombo({ dailyPL: false, totalPL: true });
    }
  }

  return (
    <div className="bg-[#9b9b9b1a] p-6 rounded-xl w-full">
      <div className="flex justify-between h-[45px] items-start">
        <h1 className="text-[22px] font-semibold">Positions</h1>
      </div>

      <Table>
        <TableHeader className="border-0">
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="w-[170px] text-[#888888] border-b-0 sticky bg-[#212121] left-0">
              Symbol
            </TableHead>
            <TableHead className="text-[#888888] whitespace-nowrap">
              Units
            </TableHead>
            <TableHead className="text-[#888888] text-right whitespace-nowrap">
              LTP/ WACC
            </TableHead>

            <TableHead
              className="whitespace-nowrap text-[#888888] text-right cursor-pointer overflow-auto hover:text-[#222] hover:bg-white"
              onClick={sortbyDialyPL}
            >
              Daily PL
              <RiExpandUpDownLine className="inline" />
            </TableHead>

            <TableHead
              className="whitespace-nowrap text-[#888888] text-right cursor-pointer overflow-auto hover:text-[#222] hover:bg-white"
              onClick={sortbyTotalPL}
            >
              Total PL
              <RiExpandUpDownLine className="inline" />
            </TableHead>

            <TableHead className="text-[#888888] text-right whitespace-nowrap">
              Value/ Inv.
            </TableHead>

            {role !== "READ" && <TableHead className="text-[#888888]">Edit</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions ? (
            positions.map((position: any) => {
              const dailyPl = numberWithCommas(
                (
                  (position.stock.last - position.stock.prevClose) *
                  position.quantity
                ).toFixed(2)
              );
              const value = numberWithCommas(
                (position.stock.last * position.quantity).toFixed(2)
              );

              const dailyGainPercentage = (
                ((position.stock.last - position.stock.prevClose) /
                  position.stock.prevClose) *
                100
              ).toFixed(2);
              const totalGain = numberWithCommas(
                (
                  (position.stock.last - position.wacc) *
                  position.quantity
                ).toFixed(2)
              );
              const totalGainPercentage = (
                ((position.stock.last - position.wacc) / position.wacc) *
                100
              ).toFixed(2);

              return (
                <TableRow
                  className="border-b-0 border-t-0 group"
                  key={position._id}
                >
                  <TableCell className="font-medium sticky left-0 bg-[#212121] group-hover:bg-gray-500">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>{position.symbol}</TooltipTrigger>
                        <TooltipContent>{position.stock.title}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    {numberWithCommas(position.quantity.toString())}
                  </TableCell>
                  <TableCell className="text-right">
                    {numberWithCommas(position.stock.last.toString())}
                    <br />
                    <span className="text-[12px]">
                      {" "}
                      {numberWithCommas(position.wacc.toString())}
                    </span>
                  </TableCell>

                  <TableCell
                    className={`text-right ${
                      parseFloat(dailyGainPercentage) >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {dailyPl}
                    <br />
                    <span className="text-[12px]">
                      {parseFloat(dailyGainPercentage) >= 0 ? (
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
                      {dailyGainPercentage}%
                    </span>
                  </TableCell>

                  <TableCell
                    className={`text-right ${
                      parseFloat(totalGainPercentage) >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {totalGain}
                    <br />
                    <span className="text-[12px]">
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
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    {value}
                    <br />
                    <span className="text-[12px]">
                      {" "}
                      {numberWithCommas(position.costOfCapital.toString())}{" "}
                    </span>
                  </TableCell>
                    <TableCell>
                    <Popover>
                      <PopoverTrigger>
                        {" "}
                        {role !== "READ" && <VscKebabVertical /> }
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
    </div>
  );
}

export default Positions;
