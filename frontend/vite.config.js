// import { fileURLToPath } from "url";
// import { dirname, resolve } from "path";
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // https://vite.dev/config/
// export default defineConfig({  
//   plugins: [react(), tailwindcss()],
//   base: "./", // 👈 CRITICAL for static hosting like Render, change if deploying to a subdirectory
//   resolve: {
//     alias: {
//       "@": resolve(__dirname, "./src"),
//     },
//   },
// });



import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 👇 defineConfig receives ({ mode })
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()); // ✅ This should work

  return {
    plugins: [react(), tailwindcss()],
    base: "./",
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    server: {
      port: parseInt(env.VITE_PORT) || 5173,
    },
  };
});
