import Link from "next/link";
import React from "react";
import { MdArrowOutward } from "react-icons/md";

function HoverButton({
  buttonText,
  buttonLink,
}: {
  buttonText: string;
  buttonLink: string;
}) {
  return (
    <Link
      href={buttonLink}
      className="relative bg-transparent z-10 flex gap-[5px] items-center text-lg font-semibold text-[12px] md:text-base py-[10px] px-5 border-white border-2 rounded-[5px] text-[#fff] transition-colors overflow-hidden before:absolute before:left-0 before:top-0 before:z-[-1] before:h-[200%] before:w-[100%] before:rounded-full before:origin-center before:scale-0 before:bg-white before:transition-all before:duration-500 before:content-[''] hover:text-black before:hover:scale-[2] before:hover:rounded-[5px]"
    >
      {buttonText}
      <MdArrowOutward size={24} />
    </Link>
  );
}

export default HoverButton;
