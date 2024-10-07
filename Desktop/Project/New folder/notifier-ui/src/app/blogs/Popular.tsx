import React from "react";
import { PopularCard } from "./PopularCard";
import { BLOG_API_URL } from "@/constant/constant";

function calculateReadingTime(content: string) {
  const words = content.split(/\s+/);
  const wordCount = words.length;
  const wordsPerMinute = 200;
  const estimatedMinutesToRead = Math.ceil(wordCount / wordsPerMinute);
  return estimatedMinutesToRead;
}

async function fetchBlog() {
  const res = await fetch(
    `${BLOG_API_URL}/api/projects/main-notifier-api-tf-api-66169414256c645f151e22dd/posts/public?category=POPULAR`,
    {
      cache: "no-cache",
    }
  );

  return res.json();
}

export default async function Popular() {
  const { data } = await fetchBlog();

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="articles lg:flex lg:flex-col md:flex md:flex-col  lg:gap-6  md:mb-14 mb-10">
      <div
        className={`head text-start font-semibold text-3xl tracking-[0.03em] leading-8 text-[#ffffffce] lg:text-[32px] px-4 my-8 lg:my-0 lg:px-0`}
      >
        Popular <span className="text-[#299e43]">Posted</span>
      </div>
      <div className="blog-cards flex flex-col gap-8 lg:flex lg:flex-col lg:gap-6">
        {data.slice(0, 3).map((blogItem: any) => (
          <PopularCard
            key={blogItem._id}
            id={blogItem._id}
            imageSrc={blogItem.imageUri}
            title={blogItem.title}
            authorName={blogItem.author}
            dateIconSrc="/images/icons/date-blog.svg"
            date={blogItem.updatedAt}
            readTime={`${calculateReadingTime(
              blogItem.content.toString()
            )} min. to Read`}
            summary={blogItem.summary}
            slug={blogItem.slug}
          />
        ))}
      </div>
    </div>
  );
}
