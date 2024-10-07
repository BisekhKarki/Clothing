"use client";

import { BASE_URL } from "@/constant/constant";
import useStore from "@/states/authStore";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Watchlist, WatchlistResponse } from "../../../global";
import { FaArrowDown, FaArrowUp, FaBookmark } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaSort } from "react-icons/fa";

import { useToast } from "@/components/ui/use-toast";
import AddWatchlists from "@/components/AddWatchList";
import numberWithCommas from "@/lib/Comma";
import { useRouter } from "next/navigation";

function GetWatchlists({ accessToken }: { accessToken: string }) {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [sorted, setSorted] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const { toast } = useToast();
  const router = useRouter();
  function handleSort() {
    if (sorted) {
      const sorted = watchlists.sort(
        (a, b) =>
          ((a.stock.last - a.stock.prevClose) / a.stock.prevClose) * 100 -
          ((b.stock.last - b.stock.prevClose) / b.stock.prevClose) * 100
      );
      setWatchlists(sorted);
      setSorted(false);
    } else {
      const sorted = watchlists.sort(
        (a, b) =>
          ((b.stock.last - b.stock.prevClose) / b.stock.prevClose) * 100 -
          ((a.stock.last - a.stock.prevClose) / a.stock.prevClose) * 100
      );
      setWatchlists(sorted);
      setSorted(true);
    }
  }
  async function deleteFromWatchlist(id: string) {
    const response = await fetch(`${BASE_URL}/api/watchlists/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const data = await response.json();
      if (response.status === 400) {
        toast({
          title: "Error",
          description: data.errors[0].msg,
        });
        return;
      } else {
        toast({
          title: "Error",
          description: data.message,
        });
        return;
      }
    }
    toast({
      title: "Watchlist deleted",
      description: "Watchlist has been deleted successfully",
    });
    setWatchlistCount((count) => count - 1);
    setWatchlists((watchlists) => {
      return watchlists.filter((watchlist) => {
        return watchlist._id !== id;
      });
    });
  }

  useEffect(() => {
    async function getWatchlists() {
      if (!accessToken) return;
      const response = await fetch(
        `${BASE_URL}/api/watchlists?limit=50&offset=0`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          router.refresh();
        }
        if (response.status === 403) {
          return;
        }
        return;
      }
      const data = await response.json();
      setWatchlists(data.data);
    }
    getWatchlists();
  }, [accessToken]);

  return (
    <div className="md:py-[45px] md:px-[100px] py-5 px-5 min-h-[90vh]">
      <h1 className="text-[40px] font-semibold">Watchlists</h1>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="hidden md:flex items-center">Title</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Change</TableHead>
            <TableHead
              className="whitespace-nowrap cursor-pointer overflow-auto hover:text-[#222] hover:bg-white"
              onClick={handleSort}
            >
              Change % <FaSort className="inline" />
            </TableHead>
            <TableHead className="whitespace-nowrap">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>Chg % (WL)</TooltipTrigger>
                  <TooltipContent>
                    <p>Change % since watchlisted</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {watchlists.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center">
                No watchlists found
              </TableCell>
            </TableRow>
          ) : (
            watchlists.map((watchlists, index) => {
              const priceDifference =
                watchlists.stock.last - watchlists.stock.prevClose;
              let icon = null;

              const pricePercentage =
                (priceDifference / watchlists.stock.prevClose) * 100;

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

              const percentChangeSinceBookmarked =
                ((watchlists.stock.last - watchlists.watchlistedPrice) /
                  watchlists.watchlistedPrice) *
                100;
              return (
                <TableRow key={index} className="hover:bg-black text-[#fff]">
                  <TableCell className="font-medium md:block hidden">
                    {watchlists.stock.title}
                  </TableCell>
                  <TableCell>{watchlists.stock.symbol}</TableCell>
                  <TableCell>
                    {numberWithCommas(watchlists.stock.last.toString())}
                  </TableCell>
                  <TableCell className=" whitespace-nowrap">
                    {icon} {priceDifference.toFixed(2)}
                  </TableCell>
                  <TableCell className=" whitespace-nowrap">
                    {icon} {pricePercentage.toFixed(2)} %
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-center">
                    {percentChangeSinceBookmarked < 0 ? (
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
                    {percentChangeSinceBookmarked.toFixed(2)} %
                  </TableCell>

                  <TableCell className="text-center">
                    <FaBookmark
                      className="cursor-pointer"
                      onClick={() => deleteFromWatchlist(watchlists._id)}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      {/* <AddWatchlists
        watchlistCount={watchlistCount}
        setWatchlists={setWatchlists}
      /> */}
    </div>
  );
}

export default GetWatchlists;
