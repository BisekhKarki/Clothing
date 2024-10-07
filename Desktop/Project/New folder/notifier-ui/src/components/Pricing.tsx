import React from "react";
import { ScrollArea } from "./ui/scroll-area";

function Pricing() {
  return (
    <ScrollArea className="max-h-[95vh]">
      <h2 className="text-3xl font-bold text-center my-8">Pricing Plans</h2>

      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="shadow-lg rounded-lg overflow-hidden w-full md:w-1/3">
          <div className="p-6 text-center">
            <h3 className="text-2xl font-semibold mb-4">Free</h3>
            <p className="text-4xl font-bold mb-4">
              NRS 0 <span className="text-lg font-normal">/ month</span>
            </p>
            <p className="text-gray-400 mb-4">
              essential features to get started
            </p>
            <ul className="text-center space-y-2">
              <li>✔️ Single Portfolio</li>
              <li>✔️ Upto 5 Alerts</li>
              <li>✔️ Upto 5 Watchlists</li>
              <li>✔️ Upto 200 portfolio transactions</li>
            </ul>
          </div>
        </div>

        <div className="shadow-lg rounded-lg overflow-hidden w-full md:w-1/3">
          <div className="p-6 text-center">
            <h3 className="text-2xl font-semibold mb-4">Starter</h3>
            <p className="text-3xl font-bold">
              NRS 99 <span className="text-lg font-normal">/ month</span>
            </p>
            <p className="text font-semibold">or</p>
            <p className="text-xl font-bold">
              NRS 999 <span className="text-lg font-normal">/ year</span>
            </p>
            <p className="text-gray-400 mb-4">ideal for passive investors</p>
            <ul className="text-center space-y-2">
              <li>✔️ Upto 2 Portfolios</li>
              <li>✔️ Upto 10 Alerts</li>
              <li>✔️ Upto 10 Watchlists</li>
              <li>✔️ Upto 500 portfolio transactions</li>
              <li>* Custom alerts for your stocks</li>
              <li>* Portfolio Analyser</li>
            </ul>
          </div>
        </div>

        <div className="shadow-lg rounded-lg overflow-hidden w-full md:w-1/3">
          <div className="p-6 text-center">
            <h3 className="text-2xl font-semibold mb-4">Investor</h3>
            <p className="text-3xl font-bold">
              NRS 299 <span className="text-lg font-normal">/ month</span>
            </p>
            <p className="text font-semibold">or</p>
            <p className="text-xl font-bold">
              NRS 2999 <span className="text-lg font-normal">/ year</span>
            </p>
            <p className="text-gray-400 mb-4">
              ideal for seasoned investors with complex requirements
            </p>
            <ul className="text-center space-y-2">
              <li>✔️ Upto 5 Portfolios</li>
              <li>✔️ Upto 20 Alerts</li>
              <li>✔️ Upto 20 Watchlists</li>
              <li>✔️ Unlimited portfolio transactions</li>
              <li>* Custom alerts for your stocks</li>
              <li>* Advanced AI Portfolio Analyser</li>
              <li>* Invite Users To Portfolio</li>
            </ul>
          </div>
        </div>

        <div className="shadow-lg rounded-lg overflow-hidden w-full md:w-1/3">
          <div className="p-6 text-center">
            <h3 className="text-2xl font-semibold mb-4">Enterprise</h3>
            <p className="text-4xl font-bold mb-4">Custom Pricing</p>
            <p className="text-gray-400 mb-4">
              Contact Us with your requirements
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-lg">
        <p>
          Fill this{" "}
          <a
            href="https://forms.gle/oCmPxpRdmkgjVYTVA"
            className="text-blue-500 underline"
            target="_blank"
          >
            Google Form
          </a>{" "}
          to subscribe or contact us via
        </p>
        <p>
          Email:{" "}
          <a
            href="mailto:contact@vuldesk.com"
            className="text-blue-500 underline"
          >
            contact@vuldesk.com
          </a>
        </p>
        <p>
          Phone:{" "}
          <a href="tel:+9779863299610" className="text-blue-500 underline">
            +977-9863299610
          </a>
        </p>
      </div>
      <div className="text-center text-sm">
        * features will be rolled out soon.
      </div>
    </ScrollArea>
  );
}

export default Pricing;
