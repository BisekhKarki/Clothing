"use client";

import { use, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Alert, AlertResponse, StockDataResponse } from "../../../global";
import AddAlerts from "./AddAlerts";
import EditAlerts from "./EditAlerts";
import HandleArchive from "../HandleArchive";
import DeleteAlert from "./DeleteAlert";
import { FaEnvelopeOpenText } from "react-icons/fa6";
import { FaArrowUp, FaArrowDown, FaSort } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { getAlerts } from "../../services/api/alerts";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ALertSkeleton } from "./AlertSkeleton";
import useStore from "@/states/authStore";
import numberWithCommas from "@/lib/Comma";
import { useRouter } from "next/navigation";

function GetAlerts({
  accessToken,
  symbols,
}: {
  accessToken: string;
  symbols: StockDataResponse;
}) {
  const [alertStatus, setAlertStatus] = useState<
    "OPEN" | "TRIGGERED" | "ARCHIVED"
  >("OPEN");

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [sorted, setSorted] = useState(false);
  const router = useRouter();
  const [alertCountOpen, setAlertCountOpen] = useState(0);

  const {
    isLoading,
    isError,
    data,
    error: FetchError,
    refetch,
  } = useQuery<any, any, any>({
    queryKey: ["alerts", alertStatus],
    queryFn: () => getAlerts(accessToken, alertStatus),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setAlerts(data.data);
      setAlertCountOpen(data.data.length);
    }
  }, [data, alertStatus]);

  function handleSort() {
    console.log("sorting");
    if (sorted) {
      const sorted = alerts.sort(
        (a, b) =>
          ((a.stock.last - a.stock.prevClose) / a.stock.prevClose) * 100 -
          ((b.stock.last - b.stock.prevClose) / b.stock.prevClose) * 100
      );
      setAlerts(sorted);
      setSorted(false);
    } else {
      const sorted = alerts.sort(
        (a, b) =>
          ((b.stock.last - b.stock.prevClose) / b.stock.prevClose) * 100 -
          ((a.stock.last - a.stock.prevClose) / a.stock.prevClose) * 100
      );
      setAlerts(sorted);
      setSorted(true);
    }
  }

  if (isLoading)
    return (
      <div className="min-h-[86vh] w-full flex items-center justify-center">
        <ALertSkeleton />
      </div>
    );
  if (isError) {
    if (FetchError.res.status === 403) {
      router.push("/forbidden");
      return;
    }
    if (FetchError.res.status === 401) {
      router.refresh();
      return;
    }
    return (
      <div className="min-h-[86vh] w-full flex items-center justify-center">
        Error: {FetchError.message}
      </div>
    );
  }
  return (
    <>
      <div className="min-h-[86vh] md:py-[45px] md:px-[110px] py-5 px-5">
        <h1 className="text-[40px] font-semibold">Alerts</h1>
        <div className="flex border-b border-[#303030] border-collapse">
          <button
            className={`${
              alertStatus === "OPEN" ? "border-b border-[#fff]" : ""
            } px-5 py-2 `}
            onClick={() => setAlertStatus("OPEN")}
          >
            Open
          </button>
          <button
            className={`${
              alertStatus === "TRIGGERED" ? "border-b border-[#fff]" : ""
            } px-5 py-2`}
            onClick={() => setAlertStatus("TRIGGERED")}
          >
            Triggered
          </button>
          <button
            className={`${
              alertStatus === "ARCHIVED" ? "border-b border-[#fff]" : ""
            } px-5 py-2`}
            onClick={() => setAlertStatus("ARCHIVED")}
          >
            Archived
          </button>
        </div>
        <Table>
          <TableHeader className="border-0">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="w-[170px] text-[#888888] border-b-0 sticky bg-[#212121] left-0">
                Symbol
              </TableHead>
              <TableHead
                className="whitespace-nowrap cursor-pointer overflow-auto hover:text-[#222] hover:bg-white"
                onClick={handleSort}
              >
                LTP <FaSort className="inline" />
              </TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Trigger Conditon</TableHead>

              <TableHead className="whitespace-nowrap">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>Trigger At</TooltipTrigger>
                    <TooltipContent>
                      <p>% the price should change for alert to trigger</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead>Notes</TableHead>
              {alertStatus == "OPEN" && (
                <>
                  <TableHead className="text-center">Archive</TableHead>
                  <TableHead className="text-center">Edit</TableHead>
                </>
              )}
              {alertStatus === "ARCHIVED" && (
                <>
                  <TableHead className="text-center">Unarchive</TableHead>
                  <TableHead className="text-center">Delete</TableHead>
                </>
              )}
              {alertStatus === "TRIGGERED" && (
                <TableHead className="text-center">Archive</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center w-full">
                  Create stock price alerts and get notified on email when your
                  target reaches.
                </TableCell>
              </TableRow>
            ) : (
              alerts.map((alert: any, index: number) => {
                const priceDifference =
                  alert.stock.last - alert.stock.prevClose;
                let icon: any = null;

                const pricePercentage =
                  (priceDifference / alert.stock.prevClose) * 100;

                const pricePercentageTrigger =
                  ((alert.target - alert.stock.last) / alert.stock.last) * 100;

                if (priceDifference > 0) {
                  icon = (
                    <FaArrowUp
                      style={{ display: "inline-block" }}
                      color="green"
                    />
                  );
                } else {
                  icon = (
                    <FaArrowDown
                      style={{ display: "inline-block" }}
                      color="red"
                    />
                  );
                }

                return (
                  <TableRow key={index} className="border-b-0 border-t-0 group">
                    <TableCell className="font-medium sticky left-0 bg-[#212121] group-hover:bg-gray-500">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>{alert.stock.symbol}</TooltipTrigger>
                          <TooltipContent>{alert.stock.title}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {numberWithCommas(alert.stock.last.toString())} ( {icon}
                      {pricePercentage.toFixed(2)}%)
                    </TableCell>
                    <TableCell>
                      {numberWithCommas(alert.target.toString())}
                    </TableCell>

                    <TableCell>{alert.type}</TableCell>

                    <TableCell className="whitespace-nowrap">
                      {alert.type === "LESS_THAN" ? (
                        <FaArrowDown
                          color="red"
                          style={{ display: "inline-block" }}
                        />
                      ) : (
                        <FaArrowUp
                          color="green"
                          style={{ display: "inline-block" }}
                        />
                      )}
                      {Math.abs(pricePercentageTrigger).toFixed(2)} %
                    </TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger>
                          <FaEnvelopeOpenText />
                        </PopoverTrigger>
                        <PopoverContent>
                          <p>{alert.notes}</p>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell className="text-center">
                      <HandleArchive
                        status={alert.status}
                        alertId={alert._id}
                        setAlerts={setAlerts}
                        setAlertCount={setAlertCountOpen}
                        accessToken={accessToken}
                      />
                    </TableCell>
                    {alertStatus === "OPEN" && (
                      <TableCell className="text-center">
                        <EditAlerts
                          alert={alert}
                          setAlerts={setAlerts}
                          symbols={symbols}
                          accessToken={accessToken}
                        />
                      </TableCell>
                    )}
                    {alertStatus === "ARCHIVED" && (
                      <TableCell className="text-center">
                        <DeleteAlert
                          alertId={alert._id}
                          setAlerts={setAlerts}
                          accessToken={accessToken}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <AddAlerts
          setAlerts={setAlerts}
          alertCount={alertCountOpen}
          setAlertCount={setAlertCountOpen}
          symbols={symbols}
          accessToken={accessToken}
        />
      </div>
    </>
  );
}

export default GetAlerts;
