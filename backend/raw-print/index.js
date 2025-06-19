import express from "express";
import bodyParser from "body-parser";
import { printDirect, getPrinters } from "printer";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const app = express();
app.use(bodyParser.json());

const printerName = process.env.PRINTER_NAME;
const PORT = process.env.PORT || 3000;

// GET ALL PRINTERS
console.log(getPrinters());

app.post("/api/print", (req, res) => {
  const { content } = req.body;

  // Check if the printer exists
  const printers = getPrinters();
  const matchedPrinter = printers.find((p) => p.name === printerName);

  if (!matchedPrinter) {
    return res
      .status(404)
      .json({ error: `Printer "${printerName}" not found.` });
  }

  printDirect({
    data: content,
    printer: printerName,
    type: "RAW", // or "TEXT"
    success: (jobID) => {
      console.log(`Print job sent to ${printerName} with ID:`, jobID);
      res.json({ success: true, jobID });
    },
    error: (err) => {
      console.error("Print error:", err);
      res.status(500).json({ error: err.message });
    },
  });
});

app.listen(PORT, () => {
  console.log(`Print server running on http://localhost:${PORT}`);
  console.log(`Using printer: ${printerName}`);
});
