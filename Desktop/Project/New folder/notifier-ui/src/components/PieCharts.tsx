"use client";
import { BASE_URL } from "@/constant/constant";
import numberWithCommas from "@/lib/Comma";
import useStore from "@/states/authStore";
import React, { useState, useCallback, useEffect, Suspense } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts";
import { Dashboard } from "../../global";
import { useQuery } from "@tanstack/react-query";
import { getAllocation, getPosition } from "@/services/api/portfolios";

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g className="z-[10000]">
      <text x={cx} y={cy} fontSize={12} textAnchor="middle" fill={fill}>
        <tspan x={cx} dy="0em">
          {payload.title
            ? payload.title
                .split("_")
                .map(
                  (str: string) =>
                    str.charAt(0).toUpperCase() +
                    str.slice(1).toLowerCase() +
                    " "
                )
            : payload.symbol}
        </tspan>
        <tspan x={cx} dy="1.2em">{`NPR ${numberWithCommas(
          parseFloat(value).toFixed(2)
        )}`}</tspan>

        <tspan x={cx} dy="2.4em">{` ${(percent * 100).toFixed(2)}%`}</tspan>
      </text>

      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />

      {/* <text
        x={ex + (cos >= 0 ? 1 : -1) * -30}
        y={ey}
        textAnchor={textAnchor}
        fill="#fff"
      > */}
      <text
        x={ex + (cos >= 0 ? 1 : -1) * -30}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      ></text>
    </g>
  );
};

const PieCharts = ({
  portfolioId,
  token,
positions
}: {
  portfolioId: string;
    token: string;
  positions: any;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dataType, setDataType] = useState<"POSITION" | "SECTOR">("SECTOR");
  const [data, setData] = useState<any[]>([]);

  const { data: pieDataAllocation } = useQuery({
    queryKey: ["allocations", portfolioId],
    queryFn: async () => await getAllocation(token, portfolioId),
    refetchOnWindowFocus: false,
  });

  const onPieEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    if(!positions || !pieDataAllocation) return;
    async function getPositions() {
      if (dataType === "POSITION") {
        const modifiedData = positions.map((position: any) => ({
          ...position,
          value: position.quantity * position.stock.last,
        }));

        setData(modifiedData);
        return;
      }
      if (dataType === "SECTOR") {
        setData(pieDataAllocation.data);
        return;
      }
      return;
    }
    getPositions();
  }, [dataType, positions, pieDataAllocation]);
  // not black color

  const pieColor = [
    "#FF5733",
    "#FFC300",
    "#DAF7A6",
    "#FF8D1A",
    "#FF7F50",
    "#87CEEB",
    "#9370DB",
    "#FFB6C1",
    "#FFD700",
    "#00CED1",
    "#FF6347",
    "#32CD32",
    "#6A5ACD",
    "#FFDAB9",
    "#66CDAA",
    "#BA55D3",
    "#FFA07A",
    "#3CB371",
    "#4682B4",
    "#FA8072",
    "#7B68EE",
    "#00FA9A",
    "#FF69B4",
    "#1E90FF",
    "#DDA0DD",
    "#E9967A",
    "#B0E0E6",
    "#ADFF2F",
    "#F08080",
    "#40E0D0",
  ];

  return (
    <Suspense fallback={<h1>loading</h1>}>
      <div className="flex w-full min-w-[300px] flex-col relative  bg-[#9b9b9b1a] border border-[#9b9b9b4d] backdrop-blur-[30px] rounded-xl">
        <h1 className="text-lg absolute top-[10px] left-[6%]">
          Allocation Chart
        </h1>
        <div className="w-full h-[370px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={100}
                outerRadius={130}
                fill="#8884d8"
                dataKey="value"
                overflow={"visible"}
                onMouseEnter={onPieEnter}
              >
                {/* Math.floor(
                      Math.abs(Math.random() * 16777213 - 16777215 + 16777215)
                    ).toString(16) */}

                {data.length &&
                  data.map((entry: any, index: number) => (
                    <Cell fill={pieColor[index]} key={index} />
                  ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center items-center absolute bottom-[10px] left-[5%] gap-2">
          <div
            className={` px-4 py-2 text-[10px] ${
              dataType === "POSITION"
                ? "bg-[#222] border border-white"
                : "bg-[#3e3e3e] text-[#747474] "
            } rounded-[5px] cursor-pointer`}
            onClick={() => setDataType("POSITION")}
          >
            Positions
          </div>
          <div
            className={` px-4 py-2 text-[10px] ${
              dataType === "SECTOR"
                ? "bg-[#222] border border-white"
                : "bg-[#3e3e3e] text-[#747474]"
            } rounded-[5px] cursor-pointer`}
            onClick={() => setDataType("SECTOR")}
          >
            Sectors
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default PieCharts;
