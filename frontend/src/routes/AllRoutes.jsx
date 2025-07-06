import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components";
import { Home, Login, Master, Order, PartLabel, WeightLabel, KitReport,OrderReport,BagReport,BinStock,ChildMaster} from "@/pages";

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
          <Route path="/bin_stock" element={<BinStock />} />
          <Route path="/kit_report" element={<KitReport />} />
          <Route path="/order_report" element={<OrderReport />} />
          <Route path="/bag_report" element={<BagReport />} />
          <Route path="/child_master" element={<ChildMaster />} />
        </Route>

        {/* No header/sidebar on these */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};
