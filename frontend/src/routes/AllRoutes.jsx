import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components";
import { Home, Login, Master, Order, PartLabel, WeightLabel } from "@/pages";

export const AllRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/master" element={<Master />} />
          <Route path="/order" element={<Order />} />
          <Route path="/partlabel" element={<PartLabel />} />
          <Route path="/weightlabel" element={<WeightLabel />} />
        </Route>

        {/* No header/sidebar on these */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};
