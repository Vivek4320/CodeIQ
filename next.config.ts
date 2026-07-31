import type { NextConfig } from "next";
import { join } from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: join(__dirname),
  },
  allowedDevOrigins: ["*.loca.lt", "*.ngrok-free.app", "*.ngrok.io"],
};

export default nextConfig;
