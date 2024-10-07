"use client";
import LivemarketStore from "@/states/livemarketSotre";
import MarqueeWrapper from "./MarqueeWrapper"

function StockMarquee() {
  const { stockData } = LivemarketStore();
  return (
    <MarqueeWrapper className="h-8">
      {stockData.map((stock) => {
         const priceChangePercentage =
         ((stock.last - stock.prevClose) /
         stock.prevClose) *
          100;
        return (
          <div key={stock.symbol} className="flex items-center gap-1 mr-6">
            <span className="text-sm font-bold">{stock.symbol}</span>
            <span className="text-sm font-bold">
              {stock.last}
            </span>
            <span
              className={`text-sm font-bold ${
                priceChangePercentage > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {priceChangePercentage.toFixed(2)}%
            </span>
          </div>
        );
      }
      )
}
        
    </MarqueeWrapper>
  )
}

export default StockMarquee