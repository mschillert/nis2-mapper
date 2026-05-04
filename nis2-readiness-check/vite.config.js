import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/nis2-mapper/",
  plugins: [react()],
});
