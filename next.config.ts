import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  // A stray package-lock.json in the home folder makes Turbopack pick ~ as the
  // workspace root and scan it; pin the root to this project.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
