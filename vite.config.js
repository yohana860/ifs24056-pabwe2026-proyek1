import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import process from "process";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = Number(env.APP_PORT) || 5173;
  return {
    plugins: [react(), tailwindcss()],
    server: { port, proxy: { "/api": env.VITE_PROXY_TARGET || "http://localhost:4000" } },
    preview: { port },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html", "lcov"],
        include: ["src/**/*.{js,jsx}"],
        exclude: ["src/main.jsx", "src/setupTests.js", "src/test-utils.jsx", "**/*.test.{js,jsx}", "node_modules/**"],
        thresholds: { lines: 100, functions: 100, branches: 100, statements: 100 },
      },
    },
  };
});
