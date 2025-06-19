import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components";
import { Home, Login } from "@/pages";

export const AllRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* No header/sidebar on these */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};
