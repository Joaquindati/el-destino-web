# El Destino · Posada Boutique

Sitio web one-page de **El Destino · Posada Boutique** (Ramallo, Buenos Aires, Argentina),
implementado en **Next.js 15 / React 19** (App Router) a partir de un diseño de Claude Design.

> _Pequeños detalles. Grandes momentos. Aquí solo soplan buenos vientos._

## Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- React 19
- CSS-in-JS inline + un `globals.css` con keyframes, reset y media queries responsive
- Tipografías Cormorant Garamond + Jost (Google Fonts)

## Estructura

| Archivo | Descripción |
|---|---|
| `app/page.js` | Página completa (Hero, El Lugar, Habitaciones, Playa Blanca, Actividades, Galería, Ubicación, Footer) |
| `app/fx.js` | Motor de animación: cursor custom, barra de progreso, reveal con clip-path, scroll horizontal con pin, marquees, reveal de texto letra por letra, banda interactiva y CTA flotante |
| `app/globals.css` | Reset, keyframes, hovers y media queries responsive |
| `app/layout.js` | Layout raíz, fuentes y metadata SEO |
| `public/assets/` | Logo (el resto de imágenes/videos son recursos externos) |

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build de producción

```bash
npm run build
npm start
```

## Contacto

- WhatsApp: (54 9) 3407 66-7777
- Email: info@eldestino.com.ar
- Ramallo · Buenos Aires · Argentina
