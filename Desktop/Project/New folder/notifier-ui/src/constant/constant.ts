const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://main-notifier-api-tf-api.vuldesk.com";


  const BLOG_API_URL = process.env.NEXT_PUBLIC_BLOG_API_URL || "https://main-cosmos-api-tf-api.vuldesk.com";
 

const COSMOS_API_SLUG = process.env.NEXT_PUBLIC_COSMOS_API_SLUG;

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_MEASUREMENT_ID || "";

const config = {
  BASE_URL,
  COSMOS_API_SLUG,
  TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",
};

const CANONICAL_URL =
  process.env.NEXT_PUBLIC_CANONICAL_URL || "https://www.dharke.com";

export { BASE_URL, COSMOS_API_SLUG, config, MEASUREMENT_ID, CANONICAL_URL, BLOG_API_URL };
