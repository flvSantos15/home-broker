import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "",
        search: ""
      }
    ]
    // domains: ["localhost"]
  }
}

export default nextConfig
