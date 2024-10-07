import Image from "next/image";
import React from "react";
import Link from "next/link";
import { parseISO, format } from "date-fns";

import { BLOG_API_URL } from "@/constant/constant";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import  "./blogs.css"

async function fetchBlog(id: string) {
  const res = await fetch(
    `${BLOG_API_URL}/api/projects/main-notifier-api-tf-api-66169414256c645f151e22dd/posts/public/${id}`,
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function BlogSingleHero({ id }: { id: string }) {
  const blog = await fetchBlog(id);

  const { content } = blog;

  return (
    <>
      <div className="blogHero mx-4 flex flex-col items-center gap-8 md:gap-12 my-6 lg:px-16 2xl:px-56 3xl:px-64 4xl:px-96">
        <div className="head-date flex flex-col gap-10 md:gap-4">
          <div className="text-[#ffffffce] font-semibold text-4xl md:text-[64px] text-center tracking-wide leading-10 md:leading-[78px] px-2 md:px-0 ">
            {blog.title}
          </div>

          <div className="date text-center text-[#ffffffce] text-sm font-medium leading-6">
            {`Last updated: ${format(parseISO(blog.updatedAt), "dd MMM yyyy")}`}
          </div>
        </div>

        <div className="content relative transition-transform md:hover:scale-105 duration-300 ease-in-out transform-gpu">
          <Image
            src={blog.imageUri}
            alt="blog image"
            loading="lazy"
            width={1040}
            height={580}
            // fill={true}
            // objectFit="cover"
            // layout="fill"
            className="z-50"
          />
        </div>
        <div className="prose max-w-full text-start  space-y-8 break-words">
          <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        </div>

        {/* <div className="links font-medium text-base flex flex-col border-t md:w-full border-[#F5F6F8] md:flex md:flex-row-reverse md:justify-between gap-6 py-6">
          <div className="flex items-center justify-center gap-1">
            <div>
              <Link href="#" className="text-[#5A5A5A]">
                <span className="text-[#2499A6]">Next: </span>Things to consider
                for IVF Treatment
              </Link>
            </div>
            <div>
              <Image
                src="/images/icons/arrow_forward_blog.svg"
                alt="female doctor"
                width={7}
                height={12}
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-1">
            <div>
              <Image
                src="/images/icons/arrow_backward_blog.svg"
                alt="female doctor"
                width={7}
                height={12}
              />
            </div>
            <div>
              <Link href="#" className="text-[#758A9F]">
                <span className="text-[#2499A6]">Previous: </span>Things to
                consider for IVF Treatment
              </Link>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}
