"use server";
import { cookies } from "next/headers";

async function setCookies({ name, value }: { name: string; value: string }) {
  //expire in next  30 days

  cookies().set({
    name,
    value,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}

export default setCookies;
