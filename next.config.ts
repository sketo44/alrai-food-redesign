import type { NextConfig } from "next";

// GITHUB_PAGES=1 builds a static preview for GitHub Pages under /<repo>.
const pages = process.env.GITHUB_PAGES === "1";
const basePath = pages ? process.env.NEXT_PUBLIC_BASE_PATH ?? "" : "";

const nextConfig: NextConfig = pages
  ? {
      output: "export",
      basePath,
      trailingSlash: true,
      experimental: { globalNotFound: true },
      images: { loader: "custom", loaderFile: "./src/lib/image-loader.ts" },
    }
  : {
      experimental: { globalNotFound: true },
      images: { formats: ["image/avif", "image/webp"] },
      async redirects() {
        return [{ source: "/", destination: "/ar", permanent: false }];
      },
    };

export default nextConfig;
