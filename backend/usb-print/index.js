import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { SerialPort } from "serialport";

// Load .env variables
dotenv.config();

const app = express();
app.use(bodyParser.json());

// Read config from .env
const COM_PORT = process.env.ZEBRA_COM_PORT || "COM3";
const BAUD_RATE = parseInt(process.env.BAUD_RATE || "9600");
const API_PORT = parseInt(process.env.PORT || "5000");

// API: POST /api/print-zpl
app.post("/api/print-zpl", async (req, res) => {
  const { zpl } = req.body;

  // Input validation
  if (!zpl || typeof zpl !== "string" || !zpl.trim().startsWith("^XA")) {
    return res.status(400).json({
      success: false,
      message: "Invalid ZPL input. Must be a non-empty string starting with ^XA.",
    });
  }

  // Create serial port
  const port = new SerialPort({
    path: COM_PORT,
    baudRate: BAUD_RATE,
    autoOpen: false,
  });

  // Handle unexpected errors
  port.on("error", err => {
    console.error("SerialPort error:", err.message);
  });

  // Open the serial port
  port.open(err => {
    if (err) {
      console.error("Failed to open COM port:", err.message);
      return res.status(500).json({
        success: false,
        message: `Failed to open port ${COM_PORT}: ${err.message}`,
      });
    }

    console.log(`✅ Port ${COM_PORT} opened. Sending ZPL...`);

    // Send ZPL
    port.write(zpl, writeErr => {
      if (writeErr) {
        console.error("Write error:", writeErr.message);
        port.close();
        return res.status(500).json({
          success: false,
          message: `Failed to write ZPL to port: ${writeErr.message}`,
        });
      }

      console.log("✅ ZPL data sent to printer.");

      // Wait a bit before closing the port (ensure buffer flush)
      setTimeout(() => {
        port.close(closeErr => {
          if (closeErr) {
            console.error("Error closing port:", closeErr.message);
            return res.status(500).json({
              success: false,
              message: `Printed, but failed to close port: ${closeErr.message}`,
            });
          }

          console.log(`✅ Port ${COM_PORT} closed.`);
          return res.json({ success: true, message: "ZPL sent to printer successfully." });
        });
      }, 200); // Adjust delay if needed
    });
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ success: false, message: "Internal server error." });
});

// Start server
app.listen(API_PORT, () => {
  console.log(`🚀 Zebra ZPL Print API running at http://localhost:${API_PORT}`);
  console.log(`📤 COM Port: ${COM_PORT}, Baud: ${BAUD_RATE}`);
});
