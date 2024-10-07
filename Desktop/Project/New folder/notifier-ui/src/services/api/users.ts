import { BASE_URL } from "@/constant/constant";
import endpoints from "../endpoints";

export async function getMe(token: string) {
  const response = await fetch(BASE_URL + endpoints.getUser, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    next: { tags: ['user'] }
  });
  return response;
}

export const getAccessToken = async (refreshToken: string) => {
  const response = await fetch(BASE_URL + endpoints.refreshToken, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });
  return response;
};
