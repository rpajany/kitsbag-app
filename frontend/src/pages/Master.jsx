import React from "react";
import { MainKit, PartKit } from "@/components";

export const Master = () => {
  return (
    <>
      <div className="flex gap-8">
        <div className="w-1/2 ">
          <MainKit />
        </div>
        <div className="w-1/2">
          <PartKit />
        </div>
      </div>
    </>
  );
};
