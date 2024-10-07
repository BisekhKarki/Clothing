import { BASE_URL } from "@/constant/constant";
import endpoints from "../endpoints";
// import { cookies } from "next/headers";
import { Alert, AlertResponse } from "../../../global";
class FetchError extends Error {
  constructor(public res: Response, message?: string) {
    super("Something went wrong status " + res.status.toString());
  }
}

export const getAlerts = async (
  token: string,
  status: string
): Promise<AlertResponse> => {
  const response = await fetch(
    BASE_URL + endpoints.alerts + `?status=${status}&limit=50&offset=0`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new FetchError(response);
  }
  const data = await response.json();
  return data;
};

export const addAlert = async (token: string, alert: any) => {
  const response = await fetch(BASE_URL + endpoints.alerts, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(alert),
  });
  const data = await response.json();
  return data;
};

export const updateAlert = async (token: string, alert: any) => {
  const response = await fetch(BASE_URL + endpoints.alerts, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(alert),
  });
  const data = await response.json();
  return data;
};

export const deleteAlert = async (token: string, alertId: string) => {
  const response = await fetch(BASE_URL + endpoints.alert(alertId), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
  // const data = await response.json();
  // return data;
};
