import { NextConfig } from "next"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

let remotePatterns: {
  protocol: "http" | "https"
  hostname: string
  port: string
  pathname: string
}[] = []

// Next refuses to fetch an upstream image that resolves to a private IP. In dev
// the API is on localhost, so the optimizer rejects every uploaded image with a
// misleading "url parameter is not allowed". Only lift the guard for a local API
// host, so a real deployment keeps its SSRF protection.
const LOCAL_HOSTS = ["localhost", "127.0.0.1", "[::1]", "::1"]
let allowLocalIP = false

if (apiUrl) {
  try {
    const url = new URL(apiUrl)
    const protocol = url.protocol.replace(":", "") as "http" | "https"
    const hostname = url.hostname
    allowLocalIP = LOCAL_HOSTS.includes(hostname)
    // Without this, a non-default port (localhost:9022 in dev) never matches and
    // next/image rejects every uploaded image with "url parameter is not allowed".
    // Empty for standard ports, which is what production uses.
    const port = url.port

    remotePatterns = [
      {
        protocol,
        hostname,
        port,
        pathname: "/storage/**",
      },
      {
        protocol,
        hostname,
        port,
        pathname: "/sample_storage/**",
      },
    ]
  } catch (error) {
    console.warn("Invalid NEXT_PUBLIC_API_URL:" + error, apiUrl)
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
    dangerouslyAllowLocalIP: allowLocalIP,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
}

export default nextConfig
