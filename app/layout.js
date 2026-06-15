import "./globals.css";

export const metadata = {
  title: "El Destino · Posada Boutique — Ramallo, Buenos Aires",
  description:
    "Posada boutique frente al Río Paraná en Ramallo. Pequeños detalles, grandes momentos. Habitaciones, Playa Blanca, piscina y naturaleza. Aquí solo soplan buenos vientos.",
  metadataBase: new URL("https://eldestino.com.ar"),
  openGraph: {
    title: "El Destino · Posada Boutique",
    description: "Pequeños detalles. Grandes momentos. Aquí solo soplan buenos vientos.",
    type: "website",
    locale: "es_AR",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2E241B",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
