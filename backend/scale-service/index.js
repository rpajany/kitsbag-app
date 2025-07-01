import express from "express";
import cors from "cors";
import "dotenv/config";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true); // Allows all origins
    },
    credentials: true,
  })
);

let scalePort;
let parser;
let lastStableWeight = 0.0;
let isStable = false;
let reconnecting = false;

// list COM ports
SerialPort.list().then((ports) => {
  console.log("Available ports:");
  ports.forEach((port) => {
    console.log(`- ${port.path}`);
  });
});

// Initialize and open the scale connection
async function connectToScale() {
  const ports = await SerialPort.list();

  if (ports.length === 0) {
    console.error("No serial ports found!");
    lastStableWeight = 0.0; // Reset weight on missing USB
    scheduleReconnect();
    return;
  }

  const serialPath = process.env.SERIAL_PORT || ports[0].path;

  if (!serialPath) {
    console.error("Serial path undefined");
    lastStableWeight = 0.0;
    scheduleReconnect();
    return;
  }

  console.log("Connecting to:", serialPath);

  if (parser) {
    parser.removeAllListeners("data");
  }

  if (scalePort) {
    scalePort.removeAllListeners();
  }

  scalePort = new SerialPort({
    path: serialPath, // ✅ Must use object with "path"
    baudRate: 9600,
    autoOpen: false,
  });

  scalePort.open((err) => {
    if (err) {
      console.error("Failed to open serial port:", err.message);
      lastStableWeight = 0.0; // Reset on port error
      scheduleReconnect();
      return;
    }

    console.log("Serial port opened:", serialPath);

    parser = scalePort.pipe(new ReadlineParser({ delimiter: "\r\n" }));

    parser.on("data", (data) => {
      try {
        const raw = data.trim();
        console.log("Raw data from scale:", JSON.stringify(raw));

        // Extract number using regex (e.g. "+0012.34kg" -> 12.34)
        const match = raw.match(/-?\d+(\.\d+)?/);
        if (match) {
          lastStableWeight = parseFloat(match[0]);
          console.log("Parsed weight:", lastStableWeight);
        } else {
          console.warn("No numeric weight found in data:", raw);
          lastStableWeight = 0.0; // Reset if bad data
        }
      } catch (error) {
        console.error("Error parsing scale data:", err.message);
        lastStableWeight = 0.0;
      }
    });

    scalePort.on("close", () => {
      console.warn("Port closed.");
      lastStableWeight = 0.0;
      scheduleReconnect();
    });

    scalePort.on("error", (err) => {
      console.error("Serial error:", err.message);
      lastStableWeight = 0.0;
      scheduleReconnect();
    });
  });
}

// Reconnect logic
function scheduleReconnect() {
  if (reconnecting) return;
  reconnecting = true;

  const retry = async () => {
    console.log("Attempting to reconnect...");
    const ports = await SerialPort.list();

    if (ports.length === 0) {
      console.warn("No serial ports found. Retrying in 5s...");
      lastStableWeight = 0.0;
      setTimeout(retry, 5000);
      return;
    }

    reconnecting = false;
    await connectToScale();
  };

  setTimeout(retry, 5000);
}

// API endpoint
app.get("/api/weight", (req, res) => {
  res.json({
    port: process.env.SERIAL_PORT,
    weight: lastStableWeight,
    unit: "kg", // or 'g' if your scale uses grams
  });
});

app.listen(PORT, async () => {
  console.log(`Weight service running on http://localhost:${PORT}`);
  await connectToScale(); // Start serial connection
});
