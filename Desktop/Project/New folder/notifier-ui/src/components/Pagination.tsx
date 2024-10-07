import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export function PaginationDemo({
  portfolioId,
  dataList,
  urlData,
  setUrlData,
}: {
  portfolioId: string;
  dataList: any;
  urlData: { limit: number, offset: number };
  setUrlData: Dispatch<
    SetStateAction<{
      limit: number;
      offset: number;
    }>
  >;
}) {

  const total = dataList.total;
  const limit = dataList.limit;
  const offset = dataList.offset;
  const [pages, setPages] = useState<number[]>([]);
  useEffect(() => {
    if (dataList.total === 0) return;
    setPages(Array(Math.ceil(total / limit)).fill(0));
  }, [dataList, limit, total]);

  function handlePagination(index: number) {
    setUrlData({ ...urlData, offset: index * limit });
  }

  return (
    <Pagination>
      <PaginationContent>
        {urlData.offset > 0 && (
          <PaginationItem
            className="cursor-pointer"
            onClick={() =>
              setUrlData((prev) => {
                return { ...prev, offset: prev.offset - limit };
              })
            }
          >
            <PaginationPrevious />
          </PaginationItem>
        )}

        {pages.map((data: any, index) => {
          return (
            <>
              {index >= offset / limit && index < offset / limit + 5 && (
                <PaginationItem
                  key={index}
                  onClick={() => handlePagination(index)}
                >
                  <PaginationLink
                    className={`${
                      index == offset / limit ? 'bg-black text-[#fff]' : ''
                    } cursor-pointer`}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              )}
            </>
          );
        })}

        {urlData.offset + limit < total && (
          <PaginationItem
            className="cursor-pointer"
            onClick={() =>
              setUrlData((prev) => {
                return { ...prev, offset: prev.offset + limit };
              })
            }
          >
            <PaginationNext />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
