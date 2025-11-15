import React, { ReactNode, Suspense } from "react";
import { SyncLoader } from "react-spinners";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">Industry Insights</h1>
      </div>
      <Suspense fallback={<SyncLoader className="mt-4 w-full" color="gray" />}>
        {children}
      </Suspense>
    </>
  );
};

export default DashboardLayout;
