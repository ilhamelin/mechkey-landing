import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
// Automatically detect repo name from GITHUB_REPOSITORY (owner/repo) or fallback to "mechkey-landing"
const repoFromEnv = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split("/")[1]
  : "mechkey-landing";
const basePath = isProd ? `/${repoFromEnv}` : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  turbopack: {
    rules: {
      "*.{glsl,vert,frag,vs,fs}": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
  transpilePackages: ["three"],
};

export default nextConfig;
