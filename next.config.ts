import type { NextConfig } from "next"

const isProd = process.env.NODE_ENV === "production"

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isProd ? "/gy-taxcalc" : "",
  assetPrefix: isProd ? "/gy-taxcalc/" : "",
  trailingSlash: true,
}

export default nextConfig
