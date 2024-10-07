"use client";
import { BASE_URL } from "@/constant/constant";
import numberWithCommas from "@/lib/Comma";
import useStore from "@/states/authStore";
import { useQuery } from "@tanstack/react-query";
import { createChart, ColorType, LineStyle } from "lightweight-charts";
import React, { Suspense, useEffect, useRef } from "react";
import { MdArrowDownward, MdArrowOutward } from "react-icons/md";
import { TbArrowsExchange } from "react-icons/tb";
import { useQueryClient } from "@tanstack/react-query";

export const ChartComponent = (props: any) => {
  const [currentValue, setCurrentValue] = React.useState("0");
  const [currentInvestedValue, setCurrentInvestedValue] = React.useState("0");
  const firstValue = props.data[0]?.value;
  const priceChange = parseFloat(currentValue) - parseFloat(firstValue);
  const queryClient = useQueryClient();

  const percentageChange = (priceChange / firstValue) * 100;

  const {
    data,
    mode,
    setMode,
    timePeriod,
    colors: {
      backgroundColor = "transparent",
      lineColor = priceChange > 0 ? "#53FF8E" : "red",
      textColor = "white",
      areaTopColor = "#2962FF",
      areaBottomColor = "rgba(41, 98, 255, 0.28)",
    } = {},
    setTimePeriod,
  } = props;

  const chartContainerRef = useRef<any>();
  const toolTipRef = useRef<any>();
  const legendRef = useRef<any>();

  useEffect(() => {
    if (!data.length) return;
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },

        textColor,
      },

      crosshair: {
        // hide the horizontal crosshair line
        horzLine: {
          visible: false,
          labelVisible: false,
        },
        // hide the vertical crosshair label
        vertLine: {
          labelVisible: false,
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: 280,
      timeScale: {
        visible: false,
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.3,
          bottom: 0.1,
        },
        visible: false,
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
        },
      },
    });
    chart.timeScale().fitContent();

    if (mode == "performance") {
      const newSeries = chart.addLineSeries({
        color: lineColor,
        lineWidth: 2,
        lineStyle: 0,
        baseLineVisible: false,
        baseLineWidth: 1,
        baseLineColor: "#53FF8E",
        priceLineVisible: false,
      });
      newSeries.setData(data);
      newSeries.createPriceLine({
        price: data[0].value,
        color: "green",
        lineWidth: 2,
        lineStyle: LineStyle.Dotted,
        axisLabelVisible: true,
      });

      const extraData = new Map();
      data.forEach((datapoint: any) => {
        extraData.set(datapoint.time, datapoint.investment);
      });

      const legend = legendRef.current;

      legend.style = `position: relative; left: 12px; top: 30px; z-index: 1; font-size: 14px; font-family: sans-serif; line-height: 18px; font-weight: 300;`;

      chart.subscribeCrosshairMove((param) => {
        console.log(param);
        let priceFormatted = "";
        let investedPrice = "";
        if (param.time) {
          const data: any = param.seriesData.get(newSeries);
          investedPrice = extraData.get(data.time);
          setCurrentInvestedValue(investedPrice);

          const price = data.value !== undefined ? data.value : data.close;
          priceFormatted = price.toFixed(2);
          setCurrentValue(priceFormatted);
        } else {
          setCurrentValue(data[data.length - 1].value.toFixed(2));
          setCurrentInvestedValue(data[data.length - 1].investment.toFixed(2));
        }
      });
      setCurrentInvestedValue(data[data.length - 1].investment.toFixed(2));
      setCurrentValue(data[data.length - 1].value.toFixed(2));

      const toolTipWidth = 80;
      const toolTipHeight = 80;
      const toolTipMargin = 15;
      const toolTip = toolTipRef.current;
      toolTip.style = `width: 150px; height: 80px; position: absolute; display: none; padding: 8px; box-sizing: border-box; background-color: black; font-size: 12px; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none; border: 1px solid; border-radius: 2px;font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`;

      toolTip.style.background = "#525252";
      toolTip.style.color = "white";
      toolTip.style.borderColor = "#242121";

      // update tooltip
      chart.subscribeCrosshairMove((param) => {
        console.log(param);
        if (
          param.point === undefined ||
          !param.time ||
          param.point.x < 0 ||
          param.point.x > chartContainerRef.current.clientWidth ||
          param.point.y < 0 ||
          param.point.y > chartContainerRef.current.clientHeight
        ) {
          toolTip.style.display = "none";
        } else {
          // time will be in the same format that we supplied to setData.
          // thus it will be YYYY-MM-DD
          const dateStr = new Date(parseInt(param.time.toString()));
          toolTip.style.display = "block";
          const data: any = param.seriesData.get(newSeries);
          const price = data.value !== undefined ? data.value : data.close;
          toolTip.innerHTML = `
        <div style="">
        ${
          dateStr.toDateString() +
          "-" +
          dateStr.getHours().toString() +
          ":" +
          `${dateStr.getMinutes() < 10 ? "0" : ""}` +
          dateStr.getMinutes().toString()
        }
        
        </div>
        <div style="font-size: 12px; margin: 4px 0px;">
            NPR ${numberWithCommas((Math.round(100 * price) / 100).toFixed(2))}
         </div>
    `;

          const coordinate = newSeries.priceToCoordinate(price);
          let shiftedCoordinate = param.point.x - 50;
          if (coordinate === null) {
            return;
          }
          shiftedCoordinate = Math.max(
            0,
            Math.min(
              chartContainerRef.current.clientWidth - toolTipWidth,
              shiftedCoordinate
            )
          );
          const coordinateY =
            coordinate - toolTipHeight - toolTipMargin > 0
              ? coordinate - toolTipHeight - toolTipMargin
              : Math.max(
                  0,
                  Math.min(
                    chartContainerRef.current.clientHeight -
                      toolTipHeight -
                      toolTipMargin,
                    coordinate + toolTipMargin
                  )
                );
          toolTip.style.left = shiftedCoordinate + "px";
          toolTip.style.top = coordinateY + "px";
        }
      });
    } else {
      const valueSeries = chart.addLineSeries({
        color: lineColor,
        lineWidth: 2,
        lineStyle: 0,
        baseLineVisible: false,
        baseLineWidth: 1,
        baseLineColor: "#53FF8E",
        priceLineVisible: false,
      });
      const investmentSeries = chart.addLineSeries({
        color: "#FF8E53",
        lineWidth: 2,
        lineStyle: 0,
        baseLineVisible: false,
        baseLineWidth: 1,
        baseLineColor: "#FF8E53",
      });

      // valueSeries.setData(data);
      valueSeries.setData(
        data.map((d: any) => ({ time: d.time, value: d.value + d.investment }))
      );
      investmentSeries.setData(
        data.map((d: any) => ({ time: d.time, value: d.investment }))
      );

      const extraData = new Map();
      data.forEach((datapoint: any) => {
        extraData.set(datapoint.time, datapoint.investment);
      });

      const legend = legendRef.current;

      legend.style = ` z-index: 1; left:12px; top:30px; font-size: 14px; font-family: sans-serif; line-height: 18px; font-weight: 300;`;

      chart.subscribeCrosshairMove((param) => {
        console.log(param);
        let priceFormatted = "";
        let investedPrice = "";
        if (param.time) {
          const data: any = param.seriesData.get(valueSeries);
          investedPrice = extraData.get(data.time);
          setCurrentInvestedValue(investedPrice);

          const price = data.value !== undefined ? data.value : data.close;
          priceFormatted = price.toFixed(2);
          setCurrentValue(priceFormatted);
        } else {
          setCurrentValue(
            (
              data[data.length - 1].value + data[data.length - 1].investment
            ).toFixed(2)
          );
          setCurrentInvestedValue(data[data.length - 1].investment.toFixed(2));
        }
      });
      setCurrentInvestedValue(data[data.length - 1].investment.toFixed(2));
      setCurrentValue(
        (
          data[data.length - 1].value + data[data.length - 1].investment
        ).toFixed(2)
      );

      const toolTipWidth = 80;
      const toolTipHeight = 80;
      const toolTipMargin = 15;
      const toolTip = toolTipRef.current;
      toolTip.style = `width: 200px; height: 80px; position: absolute;
      display: none; padding: 8px; box-sizing: border-box; background-color: black; font-size: 12px; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none; border: 1px solid; border-radius: 2px;font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`;

      toolTip.style.background = "#525252";
      toolTip.style.color = "white";
      toolTip.style.borderColor = "#242121";

      // update tooltip
      chart.subscribeCrosshairMove((param) => {
        console.log(param);
        if (
          param.point === undefined ||
          !param.time ||
          param.point.x < 0 ||
          param.point.x > chartContainerRef.current.clientWidth ||
          param.point.y < 0 ||
          param.point.y > chartContainerRef.current.clientHeight
        ) {
          toolTip.style.display = "none";
        } else {
          // time will be in the same format that we supplied to setData.
          // thus it will be YYYY-MM-DD
          const dateStr = new Date(parseInt(param.time.toString()));
          toolTip.style.display = "block";
          const data: any = param.seriesData.get(valueSeries);
          const price = data.value !== undefined ? data.value : data.close;
          toolTip.innerHTML = `
        <div style="">
        ${
          dateStr.toDateString() +
          "-" +
          dateStr.getHours().toString() +
          ":" +
          `${dateStr.getMinutes() < 10 ? "0" : ""}` +
          dateStr.getMinutes().toString()
        } 
        </div>
        <div style="font-size: 12px; margin: 4px 0px; display:flex; gap:2px; align-items:center;">
         <div style="height:10px; width:10px; background-color:${
           priceChange >= 0 ? "#53FF8E;" : "red;"
         } border-radius:50%;"></div style="color:#222">value: <span style="color:white;">NPR  ${numberWithCommas(
            (Math.round(100 * price) / 100).toFixed(2)
          )}
         </span>
         </div>
          
        </div>
        <div style="font-size: 12px; margin: 4px 0px; display:flex; gap:2px; align-items:center;">
         <div style="height:10px; width:10px; background-color:#FF8E53; border-radius:50%;"></div style="color:#222;">investment: <span style="color:white;">NPR ${numberWithCommas(
           (Math.round(100 * parseFloat(currentInvestedValue)) / 100).toFixed(2)
         )}</span>
         </div>
          
        </div>
       
    `;

          const coordinate = valueSeries.priceToCoordinate(price);
          let shiftedCoordinate = param.point.x - 50;
          if (coordinate === null) {
            return;
          }
          shiftedCoordinate = Math.max(
            0,
            Math.min(
              chartContainerRef.current.clientWidth - toolTipWidth,
              shiftedCoordinate
            )
          );
          const coordinateY =
            coordinate - toolTipHeight - toolTipMargin > 0
              ? coordinate - toolTipHeight - toolTipMargin
              : Math.max(
                  0,
                  Math.min(
                    chartContainerRef.current.clientHeight -
                      toolTipHeight -
                      toolTipMargin,
                    coordinate + toolTipMargin
                  )
                );
          toolTip.style.left = shiftedCoordinate + "px";
          toolTip.style.top = coordinateY + "px";
        }
      });
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [
    data,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
    mode,
    // priceChange,
    // currentInvestedValue,
  ]);

  return (
    <div
      className="w-full h-[370px] rounded-[12px] overflow-hidden relative bg-[#9b9b9b1a]"
      ref={chartContainerRef}
    >
      <div ref={legendRef} className="relative left-[12px] top-2">
        <p className="md:text-xl text-base">
          NPR{" "}
          {currentValue.split(".").map((txt: string, ind) =>
            ind == 0 ? (
              <span key={ind} className="md:text-[26px] text-xl">
                {numberWithCommas(txt)}
              </span>
            ) : (
              <span key={ind}>.{txt}</span>
            )
          )}{" "}
          <br />
          <span
            className={`text-base ${
              0 < priceChange ? "text-[#53ff8e]" : "text-red-500"
            } flex items-center gap-[5px]`}
          >
            {/* <MdArrowOutward /> 1.22% (+ NPR 20,000) */}
            {priceChange > 0 ? (
              <MdArrowOutward className="text-[#53FF8E]" />
            ) : (
              <MdArrowDownward className="text-red-500" />
            )}{" "}
            {Math.abs(percentageChange).toFixed(2)}%{" "}
            {`(${numberWithCommas(priceChange.toFixed(2))})`}
          </span>
        </p>
      </div>
      <div className="absolute right-5 md:top-4 bottom-3 flex flex-col gap-2">
        <div
          className="z-[50] text-sm hover:text-[#525252] transition-colors cursor-pointer flex items-center gap-1"
          onClick={() =>
            setMode((prev: string) =>
              prev === "performance" ? "value" : "performance"
            )
          }
        >
          <TbArrowsExchange className="" size={24} />
          {mode === "performance" ? "Performance" : "Portfolio value"}
        </div>
        <div className="flex gap-2">
          <div
            className={`${
              timePeriod === "intraday"
                ? "bg-[#525252] text-[#fff]"
                : "text-[#525252]"
            }  h-8 w-8 text-sm hover:bg-[#525252] hover:text-[#fff] transition-colors  flex items-center justify-center rounded-[5px] z-[50] cursor-pointer`}
            onClick={() => setTimePeriod("intraday")}
          >
            1D
          </div>
          <div
            className={`${
              timePeriod === "week"
                ? "bg-[#525252] text-[#fff]"
                : "text-[#525252]"
            }  h-8 w-8 text-sm hover:bg-[#525252] hover:text-[#fff]  transition-colors flex items-center justify-center rounded-[5px] z-[50] cursor-pointer`}
            onClick={() => setTimePeriod("week")}
          >
            1W
          </div>
          <div
            className={`${
              timePeriod === "month"
                ? "bg-[#525252] text-[#fff]"
                : "text-[#525252]"
            }  h-8 w-8 text-sm hover:bg-[#525252] hover:text-[#fff]  transition-colors flex items-center justify-center rounded-[5px] z-[50] cursor-pointer`}
            onClick={() => setTimePeriod("month")}
          >
            1M
          </div>
          <div
            className={`${
              timePeriod === "year"
                ? "bg-[#525252] text-[#fff]"
                : "text-[#525252]"
            }  h-8 w-8 text-sm hover:bg-[#525252] hover:text-[#fff] transition-colors flex items-center justify-center rounded-[5px] z-[50] cursor-pointer`}
            onClick={() => setTimePeriod("year")}
          >
            1Y
          </div>
          <div
            className={`${
              timePeriod === "all"
                ? "bg-[#525252] text-[#fff]"
                : "text-[#525252]"
            }  h-8 w-10 text-sm hover:bg-[#525252] hover:text-[#fff] transition-colors flex items-center justify-center rounded-[5px] z-[50] cursor-pointer`}
            onClick={() => {
              setTimePeriod("all");
            }}
          >
            max
          </div>
        </div>
      </div>
      {!data.length && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p className="text-[#525252] text-lg">No data available</p>
        </div>
      )}
      <div ref={toolTipRef} className="relative"></div>
    </div>
  );
};

const initialData = [
  { time: "2018-12-22", value: 32.51 },
  { time: "2018-12-23", value: 31.11 },
  { time: "2018-12-24", value: 27.02 },
  { time: "2018-12-25", value: 27.32 },
  { time: "2018-12-26", value: 25.17 },
  { time: "2018-12-27", value: 28.89 },
  { time: "2018-12-28", value: 25.46 },
  { time: "2018-12-29", value: 23.92 },
  { time: "2018-12-30", value: 22.68 },
  { time: "2018-12-31", value: 22.67 },
];

export function PortfolioLineChart(props: any) {
  const queryClient = useQueryClient();
  const [initialData, setInitialData] = React.useState([]);
  const [timePeriod, setTimePeriod] = React.useState("intraday");
  const [mode, setMode] = React.useState("performance");
  //   console.log(accessToken);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["snapshots", props.portfolioId, timePeriod],
    refetchOnWindowFocus: false,

    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/api/portfolios/${props.portfolioId}/snapshots?period=${timePeriod}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${props.token}`,
          },
        }
      );
      const data = await response.json();
      setInitialData(
        data.data.map((d: any) => ({
          time: new Date(d.createdAt).getTime(),
          value: d.value,
          investment: d.investedCapital,
        }))
      );

      return data;
    },
  });

 

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChartComponent
        {...props}
        data={initialData.length ? initialData : []}
        setTimePeriod={setTimePeriod}
        mode={mode}
        setMode={setMode}
        timePeriod={timePeriod}
      ></ChartComponent>
    </Suspense>
  );
}
