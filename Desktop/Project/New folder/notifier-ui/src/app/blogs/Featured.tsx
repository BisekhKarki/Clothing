import React from "react";
import { FeatureCard } from "./FeatureCard";
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
    `${BLOG_API_URL}/api/projects/main-notifier-api-tf-api-66169414256c645f151e22dd/posts/public?category=FEATURED`,
    {
      cache: "no-cache",
    }
  );

  return res.json();
}

export default async function Featured() {
  const { data } = await fetchBlog();
  
  if (data.length <= 0) return null;

  return (
    <div className="articles flex flex-col  lg:flex lg:flex-col lg:items-start md:flex md:flex-col md:justify-center md:items-center lg:gap-6 md:mb-14 mb-10">
      <div
        className={`head text-start font-semibold text-2xl tracking-[0.03em] leading-8 text-[#ffffffce] md:text-[32px] lg:px-0 px-4 my-8 lg:my-0`}
      >
        Featured <span className="text-[#299e43]">This Month</span>
      </div>
      {data.length > 0 ? (
        <div className="blog-cards lg:w-4/5 flex flex-col gap-8 lg:flex lg:flex-col md:grid md:grid-cols-2 lg:gap-8">
          {data.slice(0, 2).map((blogItem: any) => (
            <FeatureCard
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
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No featured articles available.
        </div>
      )}
    </div>
  );
}
