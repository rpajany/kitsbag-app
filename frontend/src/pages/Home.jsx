import React, { useState, useEffect } from "react";
import { Load_Home_Service } from "../services/Home_Service";
import { DateRange } from "react-date-range";
import { DoughnutChart, DateRangePicker } from "../components";

import { useDateRange } from "@/context/DateRangeContext";
import { safeCall, POST_Api, GET_Api } from "../services/ApiService";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import "react-date-range/dist/styles.css"; // main style
import "react-date-range/dist/theme/default.css"; // theme style

import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  // ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Loader2 } from "lucide-react"; // Lucide spinner icon (or any spinner of your choice)

export const Home = () => {
  const { API_DateRange } = useDateRange();

  const [printer, setPrinter] = useState(null);
  const [weight, setWeight] = useState(0);

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const load_Data = async () => {
    try {
      const { startDate, endDate } = API_DateRange(); // get ISO strings
      setLoading(true);

      const result = await Load_Home_Service(startDate, endDate);

      if (result?.data?.success) {
        const fetchedData = result?.data?.data;
        // console.log("Load Data :", fetchedData);

        if (Array.isArray(fetchedData) && fetchedData.length >= 1) {
          setChartData(fetchedData); // force new reference even if empty
        } else if (fetchedData.length === 0) {
          // console.warn("Expected an array, got:", fetchedData);
          // console.log("Setting empty data: []");
          setChartData([]);
        }
      } else if (result.error) {
        toast.error(result.message); // or use dialog, alert, etc.
      }
    } catch (error) {
      console.log("Error Load Childkit Data:", error);
      toast.error("Something went wrong while loading kits.");
    } finally {
      setLoading(false);
    }
  };

  console.log("chartData :", chartData);

  useEffect(() => {
    load_Data();
  }, [API_DateRange]);

  // useEffect(() => {
  //   if (window.BrowserPrint) {
  //     window.BrowserPrint.getDefaultDevice(
  //       "printer",
  //       (device) => {
  //         setPrinter(device);
  //       },
  //       (err) => {
  //         console.error("Printer not found", err);
  //         // add alert
  //       }
  //     );
  //   } else {
  //     console.warn("BrowserPrint library not loaded.");
  //     return;
  //   }
  // }, []);

  // useEffect(() => {
  //   const Get_Weight = async () => {
  //     try {
  //       const weight_url = import.meta.env.VITE_SCALE_URL;
  //       const result = await safeCall(() =>
  //         GET_Api(`${weight_url}/api/weight`)
  //       );
  //       // console.log(result);
  //       if (result.success) setWeight(result?.data?.weight ?? 0);
  //       else toast.error(result.message);
  //     } catch (error) {
  //       console.error("Error fetching weight:", error);
  //     }
  //   };

  //   // Call once immediately
  //   Get_Weight();

  //   // Set interval to call every 5 seconds
  //   const scaleInterval = Number(import.meta.env.VITE_SCALE_INTERVAL) || 5000; // fallback to 5 sec, 5000 ms = 5 sec

  //   const interval = setInterval(() => {
  //     Get_Weight();
  //   }, scaleInterval);

  //   // Cleanup interval on unmount
  //   return () => clearInterval(interval);
  // }, []);

  // const printLabel = () => {
  //   try {
  //     if (printer) {
  //       const zpl = `^XA^FO50,50^ADN,36,20^FDHello from React^FS^XZ`;
  //       printer.send(
  //         zpl,
  //         () => {
  //           console.log("Print sent successfully");
  //         },
  //         (error) => {
  //           console.error("Error printing", error);
  //         }
  //       );
  //     } else {
  //       console.warn("No printer available");
  //     }
  //   } catch (error) {
  //     console.error("Unexpected error in printLabel:", error);
  //   }
  // };

  // const handleSelect = (ranges) => {
  //   setDateRange([ranges.selection]);
  // };

  return (
    <div className="w-full border-2 rounded-t-sm">
      <div className="bg-gray-400 text-white px-5 py-2 rounded-t-sm">
        Dashboard
      </div>

      {/* Spinner */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </div>
      )}

      {/* Chart or No Data */}
      {!loading && (
        <>
          {chartData.length > 0 ? (
            <DoughnutChart
              data={chartData}
              COLORS={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]}
            />
          ) : (
            <div className="text-center text-gray-500 py-10 text-lg">
              No data available
            </div>
          )}
        </>
      )}

      <div className=" ml-4 mb-4">
        <DateRangePicker />
      </div>
    </div>
  );
};
