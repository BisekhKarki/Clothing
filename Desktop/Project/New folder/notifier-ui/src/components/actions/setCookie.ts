"use server";
import { cookies } from "next/headers";

async function setCookie({ name, value }: { name: string; value: string }) {
  cookies().set({ name, value });
}

export { setCookie };