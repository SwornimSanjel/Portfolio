/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Produce the minimal server bundle consumed by the Docker runtime stage.
  output: "standalone",
  outputFileTracingRoot: import.meta.dirname,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
