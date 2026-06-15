/** @type {import('next').NextConfig} */
const nextConfig = {
  // The landing page is one big imperative scroll-FX engine; React Strict Mode's
  // double-invoke of effects would set up the rAF loop / listeners twice in dev.
  reactStrictMode: false,
};

export default nextConfig;
