import React, { ReactNode, Suspense } from "react";
import { SyncLoader } from "react-spinners";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="container px-5 mx-auto mt-16 mb-20">
      <Suspense fallback={<SyncLoader className="mt-4 w-full" color="gray" />}>
        {children}
      </Suspense>
    </div>
  );
};

export default MainLayout;
