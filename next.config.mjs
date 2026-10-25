/** @type {import('next').NextConfig} */
const nextConfig = {
  // The landing page is one big imperative scroll-FX engine; React Strict Mode's
  // double-invoke of effects would set up the rAF loop / listeners twice in dev.
  reactStrictMode: false,
  // EXPORTAR=1 (set by .github/workflows/sitio-estatico.yml) builds plain HTML into out/,
  // which the hosting serves without a Node process. Without it, the build is unchanged.
  ...(process.env.EXPORTAR === '1' && {
    output: 'export',
    images: { unoptimized: true },
    trailingSlash: true,
  }),
};

export default nextConfig;
