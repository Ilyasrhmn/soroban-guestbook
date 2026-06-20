import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const dir = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      buffer: path.resolve(dir, "node_modules/buffer"),
      "@stellar/stellar-sdk/contract": path.resolve(dir, "node_modules/@stellar/stellar-sdk/lib/contract"),
      "@stellar/stellar-sdk/rpc": path.resolve(dir, "node_modules/@stellar/stellar-sdk/lib/rpc"),
      "@stellar/stellar-sdk": path.resolve(dir, "node_modules/@stellar/stellar-sdk"),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(dir, "..")],
    },
  },
  optimizeDeps: {
    include: ["@stellar/stellar-sdk", "buffer"],
  },
});
