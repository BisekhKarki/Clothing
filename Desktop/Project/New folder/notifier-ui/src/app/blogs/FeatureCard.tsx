"use client";

import Image from "next/image";
import React from "react";
import { parseISO, format } from "date-fns";
import Link from "next/link";
import { MdDateRange } from "react-icons/md";
import { MdMoreTime } from "react-icons/md";

interface BlogCardProps {
  imageSrc: string;
  title: string;
  authorName: string;
  date: string;
  readTime: string;
  summary: string;
  id: string;
  slug: string;
}

export const FeatureCard: React.FC<BlogCardProps> = ({
  id,
  imageSrc,
  title,
  authorName,
  date,
  readTime,
  summary,

  slug,
}) => {
  return (
    <>
      <Link href={`/blogs/${slug}`}>
        <div
          className={`card flex flex-col gap-6 lg:items-center max-w-3xl lg:max-w-none px-4 cursor-pointer transition-transform lg:hover:scale-105 duration-300 ease-in-out transform-gpu lg:flex lg:flex-row`}
        >
          <div className="image min-w-[118px] lg:max-w-[234px]">
            <Image
              src={imageSrc}
              alt="blog image"
              loading="lazy"
              layout="responsive"
              width={380}
              height={200}
            />
          </div>
          <div className="content flex flex-col gap-4 lg:gap-1 xl:gap-2">
            <div
              className={`title font-semibold text-2xl leading-8 lg:leading-5 md:text-base text-[#ffffffce] lg:w-full`}
            >
              {title}
            </div>
            <div className="flex gap-4">
              <div className="time font-normal text-[#dbdbdb] text-sm lg:text-xs flex items-center gap-2 ">
                <div className="icon">
                  <MdDateRange size={12} />
                </div>
                <div className="name">
                  {format(parseISO(date), "dd MMM yyyy  ")}
                </div>
              </div>
              <div className="min font-normal text-[#dbdbdb] text-sm lg:text-xs flex items-center gap-2">
                <div className="icon">
                  <MdMoreTime size={12} />
                </div>
                <div className="name">{readTime}</div>
              </div>
            </div>

            <div className="summary font-normal text-base lg:text-sm text-[#bebebe]">
              {summary.length > 80 ? `${summary.slice(0, 80)}...` : summary}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};
