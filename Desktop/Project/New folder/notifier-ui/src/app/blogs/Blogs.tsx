import React from "react";
import { BlogCard } from "./BlogCard";
import { parseISO, format } from "date-fns";


import { BLOG_API_URL } from "@/constant/constant";

function calculateReadingTime(content: string) {
  // Split the content into words using whitespace as a delimiter
  const words = content.split(/\s+/);

  // Calculate the number of words in the content
  const wordCount = words.length;

  // Assuming an average reading speed of 200 words per minute
  const wordsPerMinute = 200;

  // Calculate the estimated reading time in minutes
  const estimatedMinutesToRead = Math.ceil(wordCount / wordsPerMinute);

  return estimatedMinutesToRead;
}

async function fetchBlog() {
  const res = await fetch(
    `${BLOG_API_URL}/api/projects/main-notifier-api-tf-api-66169414256c645f151e22dd/posts/public?category=GENERAL`,
    {
      cache: "no-cache",
    }
  );

  return res.json();
}

export default async function Blogs() {
  const blog = await fetchBlog();

  if (blog.data.length === 0) {
    // Handle the case where there are no featured articles
    return (
      null
    );
  }
  return (
    <>
      <div className="articles mb-10 lg:px-16 2xl:px-56 3xl:px-64 4xl:px-96 md:flex md:flex-col md:gap-12">
        {/* <div
          className={`head text-start font-semibold text-3xl tracking-[0.03em] leading-8 my-8 md:mt-20 text-[#299e43] md:text-[44px]`}
        >
          General
        </div> */}
        <div className="blog-cards grid gap-6 md:grid md:grid-cols-2  2xl:grid-cols-3 2xl:gap-4  md:gap-9">
          {blog.data.map((blogItem: any) => (
            <BlogCard
              key={blogItem._id}
              id={blogItem._id}
              imageSrc={blogItem.imageUri}
              title={blogItem.title}
              authorName={blogItem.author}
              date={blogItem.updatedAt}
              readTime={`${calculateReadingTime(
                blogItem.content.toString()
              )} min. to Read`}
              summary={blogItem.summary}
              slug={blogItem.slug}
              customClassName={""}
            />
          ))}
        </div>
      </div>
    </>
  );
}
