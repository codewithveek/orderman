import type { NextConfig } from "next";

const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const netlifySiteUrl = process.env.NETLIFY && process.env.URL;
const url =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_SITE_URL ||
    netlifySiteUrl ||
    `https://${vercelProductionUrl}`
    : "http://localhost:4300"; const nextConfig: NextConfig = {
      /* config options here */
      reactCompiler: true,
      env: {
        NEXT_PUBLIC_API_URL: url + '/api',
        BETTER_AUTH_URL: url,
      },
      images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '**',
          },
        ],
      }
    };

export default nextConfig;
