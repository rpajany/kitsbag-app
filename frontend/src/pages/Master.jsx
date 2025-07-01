import React from "react";
import { MainKit, ChildKit } from "@/components";

export const Master = () => {
  return (
    <>
      <div className="w-full flex gap-8">
        <div className="w-150">
          <MainKit />
        </div>
        <div className="w-150">
          <ChildKit />
        </div>
      </div>
    </>
  );
};
