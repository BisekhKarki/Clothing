"use client";
import { useQuery } from "@tanstack/react-query";

import React, { useEffect, useRef, useState } from "react";

import { Position, StockDataResponse, Transaction } from "../../../global";
import Transcations from "../Transcations";

import Positions from "./Positions";
import Performance from "./Performance";
import SoldOut from "./SoldOut";
import PieCharts from "../PieCharts";
import { PortfolioLineChart } from "../PortfolioLineChart";
import { useRouter } from "next/navigation";
import {
  getPosition,
  getTransactionsBySymbol,
} from "@/services/api/portfolios";
import UploadMeroShare from "../transactions/UploadMeroShare";
import AddTransactions from "../AddTransactions";
import { error } from "console";
import useStore from "@/states/authStore";

function Dashboards({
  portfolio,
  token,
  portfolioId,
  symbols,
}: {
portfolio:any
  token: string;
  portfolioId: string;
  symbols: StockDataResponse;
}) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [urlData, setUrlData] = useState({ limit: 50, offset: 0 });
  const [tranUrlData, setTranUrlData] = useState({ limit: 10, offset: 0 });
  const [search, setSearch] = useState<string>("");
  const [dataList, setDataList] = useState<{
    limit: number;
    offset: number;
    total: number;
  }>({ limit: 50, offset: 0, total: 0 });

  const { user } = useStore((state)=>state)
  
  const role = portfolio?.members?.find(
    (member: any) => member.user === user._id
  )?.role;

  console.log(portfolio)


  const [tranDataList, setTranDataList] = useState<{
    limit: number;
    offset: number;
    total: number;
  }>({
    limit: 40,
    offset: 0,
    total: 0,
  });

  const {
    data,
    isLoading,
    error: FetchError,
    isError,
  } = useQuery<any, any, any>({
    queryKey: ["positions", portfolioId, "active", urlData],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await getPosition(
        token,
        portfolioId,
        "",
        urlData.limit,
        urlData.offset
      );
      setPositions(res.data);
      setDataList({
        total: res.total,
        limit: res.limit,
        offset: res.offset,
      });
      return res;
    },
  });

  const { data: tran, isFetching: tranLoading } = useQuery<any, any, any>({
    queryKey: ["transactions", portfolioId, tranUrlData, search],
    queryFn: async () => {
      const res = await getTransactionsBySymbol(
        token,
        portfolioId,
        search,
        tranUrlData.limit,
        tranUrlData.offset
      );
      setTransactions(res.data);
      setTranDataList({
        total: res.total,
        limit: res.limit,
        offset: res.offset,
      });
      return res;
    },
    refetchOnWindowFocus: false,
  });

  // console.log(data.data)

  const stickyRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const [stickValue, setStickValue] = useState(0);
  const route = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const stickyElement = stickyRef.current;
      const topElement = topRef.current;

      if (!stickyElement || !topElement) return;

      const rect = stickyElement.getBoundingClientRect();
      const topRect = topElement.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;

      if (rect.bottom <= windowHeight - 20) {
        setIsSticky(true);
        setStickValue(topRect.top);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  

  if (isError) {
    if (FetchError.res.status === 403) {
      route.push("/forbidden");
      return;
    }
    if (FetchError.res.status === 401) {
      route.refresh();
      return;
    }
    if (FetchError.res.status === 404) {
      return (
        <div className="text-xl min-h-[80vh] flex items-center justify-center flex-col gap-4">
          <span>404</span>Portfolio Not Found
        </div>
      );
    }

    return (
      <div className="text-xl min-h-[80vh] flex items-center justify-center">
        Error: {FetchError.message}
      </div>
    );
  }

  if(!data || data.length === 0){
    return (
      <div className="text-xl min-h-[80vh] flex items-center justify-center flex-col gap-4">
        <span>Portfolio Not Found</span>
      </div>
    );
  }


  return (
    <>
      {
        !tranLoading &&
      tran &&
      transactions.length === 0 &&
      search.length === 0 ? (
        <div className="flex w-full flex-col gap-[67px]">
          <p className="h-[100px] flex items-center justify-center text-[#7f7f7f]">
            No data, please import portfolio or add transactions manually..
          </p>
          <div className="flex flex-col gap-[17px] items-center">
            {/* <UploadMeroShare /> */}
            {/* <span>or</span> */}
            <AddTransactions
              portfolioId={portfolioId}
              setTransactions={setTransactions}
              symbols={symbols}
              accessToken={token}
            />
          </div>
        </div>
      ) : (
        <div className="flex md:flex-row flex-col lmd:gap-[1.5%] w-full">
          <div className="lmd:w-[68%] w-full flex flex-col lmd:gap-[25px] gap-[12px]">
            <PortfolioLineChart portfolioId={portfolioId} token={token} />

            <div className="lmd:hidden w-full flex flex-col lmd:gap-[25px] gap-3">
              <Performance token={token} portfolioId={portfolioId} />
            </div>

            <Positions
            role={role}
              positions={positions}
              setPositions={setPositions}
              setSearch={setSearch}
              portfolioId={portfolioId}
              token={token}
              dataList={dataList}
              setUrlData={setUrlData}
              urlData={urlData}
            />

            <div className="lmd:hidden w-full flex flex-col lmd:gap-[25px] gap-3">
              <PieCharts
                portfolioId={portfolioId}
                token={token}
                positions={positions}
              />
            </div>

            <SoldOut
              // positions={data.positions}
              setSearch={setSearch}
              // setPositions={setPositions}
              portfolioId={portfolioId}
              token={token}
            />

            <Transcations
            role={role}
              accessToken={token}
              portfolioId={portfolioId}
              symbols={symbols}
              search={search}
              transactions={transactions}
              setTransactions={setTransactions}
              setSearch={setSearch}
              urlData={tranUrlData}
              setUrlData={setTranUrlData}
              dataList={tranDataList}
              isLoading={tranLoading}
            />
          </div>
          <div
            className={`lmd:w-[30.5%] w-full lmd:flex hidden flex-col gap-[25px] self-start`}
            style={
              isSticky ? { position: "sticky", top: stickValue + "px" } : {}
            }
          >
            <div ref={topRef}>
              <PieCharts
                portfolioId={portfolioId}
                token={token}
                positions={positions}
              />
            </div>

            <div ref={stickyRef}>
              <Performance token={token} portfolioId={portfolioId} />
            </div>
          </div>
        </div>
      )

      }
    </>
  );
}

export default Dashboards;
