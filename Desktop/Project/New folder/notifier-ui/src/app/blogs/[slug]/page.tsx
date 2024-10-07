import React from "react";
import BlogSingleHero from "./BlogSingleHero";
import { Metadata, ResolvingMetadata } from "next";
import { BLOG_API_URL } from "@/constant/constant";
type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params

  const slug = params.slug;

  // fetch data
  const res = await fetch(
    `${BLOG_API_URL}/api/projects/main-notifier-api-tf-api-66169414256c645f151e22dd/posts/public/${slug}`
  );

  const blog = await res.json();

  return {
    title: blog.title,
    description: blog.summary,
    keywords: blog.tags,
  };
}
export default function page({ params }: { params: { slug: string } }) {
  return (
    <>
      <div>
        <div className="md:flex md:justify-center md:items-center">
          <div className="md:max-w-screen-4xl md:w-full">
            {/* <Header />
            <Navbar /> */}
            <BlogSingleHero id={params.slug} />
            {/* <Footer /> */}
          </div>
        </div>
      </div>
    </>
  );
}
