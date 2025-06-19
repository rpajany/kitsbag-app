import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Header, Footer, SideBar } from "@/components";
export const MainLayout = () => {
  return (
    <>
      <Header />
      <SidebarProvider>
        <SideBar />
        <main className="w-full mx-4 mt-4">
          <SidebarTrigger className="absolute top-2 left-65" />
          <Outlet /> {/* Nested routes will render here */}
        </main>
      </SidebarProvider>
      <Footer />
    </>
  );
};
