import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import { useDateRange } from "../context/DateRangeContext";
import { safeCall, POST_Api, GET_Api } from "../services/ApiService";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import "react-date-range/dist/styles.css"; // main style
import "react-date-range/dist/theme/default.css"; // theme style

export const Home = () => {
  const { dateRange, setDateRange } = useDateRange();
  const [printer, setPrinter] = useState(null);
  const [weight, setWeight] = useState(0);

  useEffect(() => {
    if (window.BrowserPrint) {
      window.BrowserPrint.getDefaultDevice(
        "printer",
        (device) => {
          setPrinter(device);
        },
        (err) => {
          console.error("Printer not found", err);
          // add alert
        }
      );
    } else {
      console.warn("BrowserPrint library not loaded.");
      return;
    }
  }, []);

  useEffect(() => {
    const Get_Weight = async () => {
      try {
        const weight_url = import.meta.env.VITE_SCALE_URL;
        const result = await safeCall(() =>
          GET_Api(`${weight_url}/api/weight`)
        );
        // console.log(result);
        if (result.success) setWeight(result?.data?.weight ?? 0);
        else toast.error(result.message);
      } catch (error) {
        console.error("Error fetching weight:", error);
      }
    };

    // Call once immediately
    Get_Weight();

    // Set interval to call every 5 seconds
    const scaleInterval = Number(import.meta.env.VITE_SCALE_INTERVAL) || 5000; // fallback to 5 sec, 5000 ms = 5 sec

    const interval = setInterval(() => {
      Get_Weight();
    }, scaleInterval);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const printLabel = () => {
    try {
      if (printer) {
        const zpl = `^XA^FO50,50^ADN,36,20^FDHello from React^FS^XZ`;
        printer.send(
          zpl,
          () => {
            console.log("Print sent successfully");
          },
          (error) => {
            console.error("Error printing", error);
          }
        );
      } else {
        console.warn("No printer available");
      }
    } catch (error) {
      console.error("Unexpected error in printLabel:", error);
    }
  };

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  return (
    <>
      <p>Home</p>
      <div>
        <h1 className=" text-blue-500 text-3xl font-bold  ">
          Weighing Scale Demo
        </h1>
        <div>
          <input
            id="weight"
            name="weight"
            value={Number(weight).toFixed(2)}
            readOnly
            className="border rounded-md"
          />
        </div>
        <div>
          <h2>Zebra Printer Test</h2>
          <button
            onClick={printLabel}
            className="bg-green-400 text-white p-2 rounded-md hover:cursor-pointer"
          >
            Print Label
          </button>

          <Button>Click me</Button>
        </div>

        <div>
          <DateRange
            editableDateInputs={true}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            numberOfMonths={2}
          />
        </div>
      </div>
    </>
  );
};
