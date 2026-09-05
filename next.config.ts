import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Turbopack config (Next.js 16+)
  turbopack: {
    rules: {
      // Load GLSL shader files as raw strings
      "*.{glsl,vert,frag,vs,fs}": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
  // Transpile Three.js ecosystem
  transpilePackages: ["three"],
};

export default nextConfig;
