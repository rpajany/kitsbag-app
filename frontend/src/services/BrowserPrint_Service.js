import { useEffect, useState } from "react";

export const useZebraPrinter = () => {  
  const [printer, setPrinter] = useState(null);

  useEffect(() => {
    if (window.BrowserPrint) {
      window.BrowserPrint.getDefaultDevice(
        "printer",
        (device) => setPrinter(device),
        (err) => {
          console.error("Printer not found", err);
          alert("Printer not found");
        }
      );
    } else {
      console.warn("BrowserPrint library not loaded.");
    }
  }, []);

  const printZPL = (zplData) => {
    if (printer) {
      printer.send(
        zplData,
        () => console.log("Print sent successfully"),
        (error) => console.error("Error printing", error)
      );
    } else {
      console.warn("Printer not available yet.");
    }
  };

  return { printer, printZPL };
};
