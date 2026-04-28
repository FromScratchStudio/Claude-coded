import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    plugins: [react()],
    base: "/Claude-coded/",
    server: {
      port: 5173,
      open: true,
    },
    build: {
      outDir: "dist",
      sourcemap: env.VITE_SOURCEMAP === "true",
    },
  };
});
