import { BASE_URL } from "@/constant/constant";
import endpoints from "../endpoints";
import { StockDataResponse } from "../../../global";

export const getStocks = async (token: string): Promise<StockDataResponse> => {
    const response = await fetch(BASE_URL + endpoints.stocks + `?limit=${1000}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data;

}
