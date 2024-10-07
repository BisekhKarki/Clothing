import Link from "next/link";
import React from "react";
import { MdArrowOutward } from "react-icons/md";

function ArrowButton({ text }: { text: string }) {
  return (
    <div className="flex px-[35px] py-[10px] border border-[#fff] rounded-[5px] items-center gap-[5px]">
      <span>{text}</span> <MdArrowOutward />
    </div>
  );
}

export default ArrowButton;
