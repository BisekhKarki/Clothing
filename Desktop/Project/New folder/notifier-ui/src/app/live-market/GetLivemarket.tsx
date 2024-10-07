"use client";

import * as React from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BASE_URL } from "@/constant/constant";
import useStore from "@/states/authStore";
import { LiveMarket, Watchlist } from "../../../global";
import { FaArrowDown, FaArrowUp, FaPlus, FaPlusCircle } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import { FaRegBookmark } from "react-icons/fa";
import LoginWithGoogle from "@/components/LoginWithGoogle";
import { FaBookmark } from "react-icons/fa6";
import { ZodString } from "zod";
import { useRouter } from "next/navigation";
import LivemarketStore from "@/states/livemarketSotre";

const columns: ColumnDef<LiveMarket>[] = [
  {
    accessorKey: "title",
    header: () => <div className="text-left md:block hidden">Title</div>,
    cell: ({ row }) => (
      <div className="capitalize md:block hidden">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "symbol",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Symbol
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="uppercase text-center">{row.getValue("symbol")}</div>
    ),
    filterFn: (row, id, filterValues) => {
      const searchInfo = [
        row.original.symbol.toLowerCase(),
        row.original.title.toLowerCase(),
      ]
        .filter(Boolean)
        .join(" ");
      // console.log(searchInfo);

      let searchTerms = Array.isArray(filterValues)
        ? filterValues
        : [filterValues];
      console.log(searchTerms);

      // Check if any of the search terms are included in the userInfoString
      return searchTerms.some((term) =>
        searchInfo.includes(term.toLowerCase())
      );
    },
    enableSorting: false,

    // filter by symbol and title as well
    // filterFn: (rows: any, filterValue: any) => {
    //   return rows.filter((row: any) => {
    //     const symbol = row.original.symbol;
    //     const title = row.original.title;
    //     return symbol.includes(filterValue) || title.includes(filterValue);
    //   });
    // },
  },
  {
    accessorKey: "last",
    header: () => <div className="text-right">LTP</div>,
    cell: ({ row }) => {
      const last = parseFloat(row.getValue("last"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US").format(last);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "price change",
    header: () => <div className="text-right">Change</div>,
    cell: ({ row }) => {
      const priceChange = row.original.last - row.original.prevClose;

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(priceChange);

      return (
        <div className="text-right font-medium whitespace-nowrap">
          {priceChange > 0 ? (
            <FaArrowUp style={{ display: "inline-block" }} color="green" />
          ) : (
            <FaArrowDown style={{ display: "inline-block" }} color="red" />
          )}
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "price change percentage",
    accessorFn: (row) => {
      const priceChange = ((row.last - row.prevClose) / row.prevClose) * 100;

      // Format the amount as a dollar amount
      return priceChange;
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          % Change
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      const priceChangePercentage =
        ((row.original.last - row.original.prevClose) /
          row.original.prevClose) *
        100;

      // Format the amount as a dollar amount

      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(priceChangePercentage);

      return (
        <div className="text-center font-medium whitespace-nowrap">
          {priceChangePercentage > 0 ? (
            <FaArrowUp style={{ display: "inline-block" }} color="green" />
          ) : (
            <FaArrowDown style={{ display: "inline-block" }} color="red" />
          )}
          {formatted} %
        </div>
      );
    },
  },
  {
    accessorKey: "open",
    header: () => <div className="text-right">Open</div>,
    cell: ({ row }) => {
      const open = parseFloat(row.getValue("open"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US").format(open);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "high",
    header: () => <div className="text-right">High</div>,
    cell: ({ row }) => {
      const high = parseFloat(row.getValue("high"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US").format(high);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "low",
    header: () => <div className="text-right">Low</div>,
    cell: ({ row }) => {
      const low = parseFloat(row.getValue("low"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US").format(low);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "close",
    header: () => <div className="text-right">Close</div>,
    cell: ({ row }) => {
      const close = parseFloat(row.getValue("close"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US").format(close);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "prevClose",
    header: () => <div className="text-right">prevClose</div>,
    cell: ({ row }) => {
      const prevClose = parseFloat(row.getValue("prevClose"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US").format(prevClose);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },

  {
    id: "actions",
    enableHiding: false,

    cell: ({ row, table }) => {
      const accessToken = (table.options.meta as any)?.accessToken;
      const isAuthenticated = !!accessToken;

      const { toast } = useToast();

      const addToWatchList = async (symbol: string) => {
        const response = await fetch(`${BASE_URL}/api/watchlists`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ symbol }),
        });
        if (!response.ok) {
          const data = await response.json();
          if (response.status === 401) {
            toast({
              title: "Unauthorized",
              description: data.message,
              variant: "destructive",
            });
          } else if (response.status === 403) {
            toast({
              title: "Forbidden",
              description: data.message,
              variant: "destructive",
            });
          } else if (response.status === 500) {
            toast({
              title: "Internal Server Error",
              description: data.message,
              variant: "destructive",
            });
          } else if (response.status === 400) {
            toast({
              title: "Bad Request",
              description: data.errors[0].msg,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error",
              description: data.message,
              variant: "destructive",
            });
          }
          return;
        }
        if (response.ok) {
          const data = await response.json();
          toast({
            title: "Success",
            description: "Added to watchlist",
          });
          (table.options.meta as any)?.setWatchlists((watchlists: any) => [
            ...watchlists,
            {
              _id: data._id,
              stockId: data.stock,
            },
          ]);
        }
      };

      async function removeFromWatchlist(id: string) {
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

        (table.options.meta as any)?.setWatchlists((watchlists: any) =>
          watchlists.filter((watchlist: any) => watchlist._id !== id)
        );
      }
      return (
        <>
          {isAuthenticated ? (
            !(table.options.meta as any)?.watchlists.some(
              (watchlist: any) => watchlist.stockId === row.original._id
            ) ? (
              <FaRegBookmark
                onClick={() => addToWatchList(row.getValue("symbol"))}
                className="cursor-pointer"
              />
            ) : (
              <FaBookmark
                onClick={() => {
                  const watchlistToRemove = (
                    table.options.meta as any
                  )?.watchlists.find(
                    (watchlist: any) => watchlist.stockId === row.original._id
                  );
                  if (watchlistToRemove) {
                    removeFromWatchlist(watchlistToRemove._id);
                  }
                }}
                className="cursor-pointer"
              />
            )
          ) : (
            <LoginWithGoogle>
              <FaRegBookmark className="cursor-pointer" />
            </LoginWithGoogle>
          )}
        </>
      );
    },
  },
];

export default function GetLivemarket({
  accessToken,
}: {
  accessToken: string;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  // const [data, setData] = React.useState<LiveMarket[]>([]);
  const { stockData, setStockData } = LivemarketStore((stockData) => stockData);
  const [watchlists, setWatchlists] = React.useState<
    { _id: string; stockId: string }[]
  >([]);
  const isAuthenticated = !!accessToken;
  const router = useRouter();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  React.useEffect(() => {
    async function getLiveMarket() {
      const response = await fetch(
        `${BASE_URL}/api/stocks/live-market?limit=1000`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) return;
      const liveData = await response.json();
      setStockData(liveData.data);
    }

    getLiveMarket();
  }, []);
  function extractStockIds(data: Watchlist[]) {
    return data.map((item) => {
      return { _id: item._id, stockId: item.stock._id };
    });
  }
  React.useEffect(() => {
    if (!isAuthenticated) return;
    async function getWatchlists() {
      if (!isAuthenticated) return;
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

        return;
      }

      const data = await response.json();
      const stockIds = extractStockIds(data.data);
      setWatchlists(stockIds);
    }
    getWatchlists();
  }, [isAuthenticated, accessToken]);

  const table = useReactTable({
    data: stockData,
    columns,
    meta: {
      watchlists: watchlists,
      setWatchlists,
      accessToken,
    },

    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,

    state: {
      sorting,
      columnVisibility,
    },
    initialState: {
      //This line
      pagination: {
        pageSize: 20,
      },
    },
  });

  return (
    <div className="w-full md:px-[100px] px-5 min-h-[90vh]">
      <div className="flex items-center py-4">
        <Input
          placeholder="search..."
          value={(table.getColumn("symbol")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("symbol")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-black"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="bg-black"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="bg-black"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
