
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LiveMarket } from "../../global";


const createState = (set: any): { stockData: LiveMarket[]; setStockData: (data:LiveMarket[])=>void } => {
  return {
    stockData: [],
    setStockData: (stockData: LiveMarket[]) => {
      set(() => ({
        stockData,
      }));
    },
  };
};


const LivemarketStore = create(persist(createState, { name: "livemarket-storage" }));

export default LivemarketStore;
