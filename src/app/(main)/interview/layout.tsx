import React, { ReactNode, Suspense } from "react";
import { SyncLoader } from "react-spinners";

const InterviewLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="px-5">
      <Suspense fallback={<SyncLoader className="mt-4 w-full" color="gray" />}>
        {children}
      </Suspense>
    </div>
  );
};

export default InterviewLayout;
