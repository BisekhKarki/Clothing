"use client";

import Image from "next/image";
import React from "react";
import { parseISO, format } from "date-fns";
import Link from "next/link";
import { MdMoreTime } from "react-icons/md";

interface PopularCardProps {
  imageSrc: string;
  title: string;
  authorName: string;
  dateIconSrc: string;
  date: string;
  readTime: string;
  summary: string;
  id: string;
  slug: string;
}

export const PopularCard: React.FC<PopularCardProps> = ({
  id,
  imageSrc,
  title,
  authorName,
  dateIconSrc,
  date,
  readTime,
  summary,
  slug,
}) => {
  return (
    <>
      <Link href={`/blogs/${slug}`}>
        <div
          className={`card flex gap-4 px-4 py-2 items-center lg:px-0 cursor-pointer transition-transform lg:hover:scale-105 duration-300 ease-in-out transform-gpu`}
        >
          <div className="image min-w-[118px] max-w-[118px]">
            <Image
              src={imageSrc}
              alt="blog image"
              layout="responsive"
              loading="lazy"
              width={118}
              height={80}
            />
          </div>
          <div className="content flex flex-col gap-1 lg:gap-2">
            <div
              className={`title font-semibold text-base lg:text-sm text-[#ffffffce] lg:w-full`}
            >
              {title}
            </div>
            <div className="flex gap-2">
              <div className="min font-normal text-[#dbdbdb] text-sm flex items-center gap-2">
                <div className="icon">
                  <MdMoreTime size={12} />
                </div>
                <div className="name text-xs">{readTime}</div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};
