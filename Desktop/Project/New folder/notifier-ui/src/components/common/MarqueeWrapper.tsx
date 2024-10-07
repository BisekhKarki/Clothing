import clsx from "clsx";
import { ReactNode } from "react";
import Marquee from "react-fast-marquee";

function MarqueeWrapper({ children, className }: { children: ReactNode; className?: string }) {
  return <Marquee className={clsx(className)}>
        {children}
  </Marquee>
}

export default MarqueeWrapper;
