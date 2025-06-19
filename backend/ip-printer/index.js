import { error } from "console";
import express from "express";
import net from "net";

const app = express();
const PORT = 8081;

app.use(express.json()); // ✅ Add this to parse JSON body

async function sendToPrinter(ip, port, zpl) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();

    client.setTimeout(5000); // optional timeout

    client.on("error", (err) => {
      reject(err);
    });

    client.on("timeout", () => {
      client.destroy();
      reject(new Error("Connection timed out"));
    });

    client.connect(port, ip, () => {
      client.write(zpl);
      client.end();
      resolve();
    });
  });
}

// sendToPrinter("192.168.1.100", 9100, "^XA^FO50,50^ADN,36,20^FDLabel^FS^XZ");

// API to ip-print
app.post("/api/ip-print", async (req, res) => {
  try {
    const { ip, port, zpl } = req.body;
    // console.log(req.body);

    await sendToPrinter(ip, Number(port), zpl); // ensure port is number
    res.json({ message: "Print Successful" });
    
  } catch (error) {
    console.error("Print error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
