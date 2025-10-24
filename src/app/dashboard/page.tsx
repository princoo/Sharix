"use client";
import type React from "react";
// import Lottie from "lottie-react";
// import constructionAnimation from "../../../public/animations/website-maintenance.json";
import { SummaryCards } from "@/components/custom/dashboard/summary-cards";
import { ContributionChart } from "@/components/custom/dashboard/contribution-chart";
import { UsersTable } from "@/components/custom/dashboard/users-table";
export default function UnderConstructionPage() {
  return (
    <div className="flex justify-center ">
      {/* <div className="w-full relative"> */}
      {/* Construction Illustration */}
      {/* <div className="bg-rd-500 flex flex-col items-center justify-center">
          <div className="flex justify-center">
            <div className="w-64 h-64 md:w-96 md:h-96">
              <Lottie animationData={constructionAnimation} loop={true} />;
            </div>
          </div>

          <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
              Under Development!
            </h2>
            <p className="text-muted-foreground text-lg text-balance">
              To make things right we need some time to rebuild
            </p>
          </div>
        </div> */}
      <div className=" space-y-8 w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Overview of contributions, invites, and user activity
          </p>
        </div>

        <SummaryCards />
        <ContributionChart />
        <UsersTable />
      </div>
      {/* </div> */}
    </div>
  );
}
