import { BASE_URL } from "@/constant/constant";

export const createJWT = async ({ code }: { code: string }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/jwt/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    return response;
  } catch (error) {
    console.error("Error creating JWT", error);
  }
};
