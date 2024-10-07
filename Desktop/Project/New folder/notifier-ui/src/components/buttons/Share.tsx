import { TwitterShareButton, TwitterIcon } from "react-share";

import React from "react";

function Share({ portfolioContent }: { portfolioContent: string }) {
  return (
    <div className="absolute top-[20px] right-[5%] z-[50]">
      {" "}
      <TwitterShareButton
        url={window.location.origin}
        title={portfolioContent}
        hashtags={["dharke", "portfolio"]}
        className="cursor-pointer"
      >
        <TwitterIcon size={32} round={true} />
      </TwitterShareButton>
    </div>
  );
}

export default Share;
