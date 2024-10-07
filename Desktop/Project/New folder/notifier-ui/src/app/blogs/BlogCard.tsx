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
  customClassName: string;
  slug: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  id,
  imageSrc,
  title,
  authorName,

  date,

  readTime,
  summary,
  customClassName,
  slug,
}) => {
  return (
    <>
      <Link href={`/blogs/${slug}`}>
        <div
          className={`card flex flex-col gap-6 px-4 cursor-pointer transition-transform md:hover:scale-105 duration-300 ease-in-out transform-gpu ${customClassName}`}
          style={{ maxWidth: "501px" }}
        >
          <div className="image">
            <Image
              src={imageSrc}
              alt="blog image"
              loading="lazy"
              width={450}
              height={200}
            />
          </div>
          <div className="content flex flex-col gap-4">
            <div
              className={`title font-semibold text-2xl leading-8 tracking-wide text-[#ffffffce] `}
            >
              {title}
            </div>
            <div className="flex justify-between">
              <div className="time font-normal text-[#dbdbdb] text-sm flex items-center gap-2 ">
                <div className="icon">
                 <MdDateRange size={12} />
                </div>
                <div className="name">
                  {format(parseISO(date), "dd MMM yyyy  ")}
                </div>
              </div>
              <div className="min font-normal text-[#dbdbdb] text-sm flex items-center gap-2">
                <div className="icon">
                  <MdMoreTime size={12} />
                </div>
                <div className="name">{readTime}</div>
              </div>
            </div>

            <div className="summary font-normal text-base text-[#bebebe]">
              {summary.length > 150 ? `${summary.slice(0, 150)}...` : summary}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};
