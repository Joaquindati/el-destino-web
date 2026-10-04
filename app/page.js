"use client";

import { useEffect, useRef, useState } from "react";
import { mountFx } from "./fx";
import eventPhotos from "./eventPhotos.json";

/* ============================================================
   Data (ported from the prototype's renderVals / helper methods)
   ============================================================ */
const SERIF = "'Cormorant Garamond', Georgia, serif";
const WA = "https://wa.me/5493407667777?text=Hola!%20Quiero%20reservar%20en%20El%20Destino";

const wix = (id, fill) =>
  `https://static.wixstatic.com/media/${id}~mv2.jpg/v1/fill/${fill}/${id}~mv2.jpg`;

// Fotos nuevas (HEIC → WebP, en /public/assets/habitaciones).
const roomCards = [
  { src: "/assets/habitaciones/suite.webp", label: "Suite", text: "La habitación de las grandes historias." },
  { src: "/assets/habitaciones/doble.webp", label: "Doble", text: "Dos personas. Cero apuro." },
  { src: "/assets/habitaciones/doble-twin.webp", label: "Doble Twin", text: "Viajar juntos. Descansar mejor." },
  { src: "/assets/habitaciones/triple.webp", label: "Triple", text: "Más espacio. Más momentos." },
  { src: "/assets/habitaciones/cuadruple.webp", label: "Cuádruple", text: "Los mejores viajes se comparten." },
];

// Nota: se quitaron de la galería las fotos que ya aparecen en otras secciones
// (0533244a, 8eca0eed, 203c7c91 → Eventos; a6389a83 → Piscina/Actividades).
const STRIP_A_IDS = [
  "59862d_fbaa5d3043fc4f828190f73a0c1a7c30",
  "59862d_619cc26d8abf4ba5acba9d23c52b38e8",
  "59862d_19b807ab22724c42aaff5ea21cc62ff2",
];
const STRIP_B_IDS = [
  "59862d_bfe530b50530490fb01e9b2947895e91",
  "59862d_32980b2d16d34a0fb38ca4b0ed0559e9",
  "59862d_a5f90d5c137345dcb16f9434dbab55f1",
  "59862d_3443279cb4174caca25ed7b544725947",
  "59862d_183a9fa455fc4f7fa695dce4fb02d635",
];
// Fotos locales agregadas a la galería (7 por tira).
const STRIP_A_LOCAL = [
  "/assets/galeria/g-01.webp",
  "/assets/galeria/g-02.webp",
  "/assets/galeria/g-03.webp",
  "/assets/galeria/g-04.webp",
  "/assets/galeria/g-05.webp",
  "/assets/galeria/g-06.webp",
  "/assets/galeria/g-07.webp",
];
const STRIP_B_LOCAL = [
  "/assets/galeria/g-08.webp",
  "/assets/galeria/g-09.webp",
  "/assets/galeria/g-10.webp",
  "/assets/galeria/g-11.webp",
  "/assets/galeria/g-12.webp",
  "/assets/galeria/g-13.webp",
  "/assets/galeria/g-14.webp",
];
// strip() duplicates the list so the marquee can wrap seamlessly
const buildStrip = (ids, local = []) => {
  const u = [
    ...ids.map((id) => ({ src: wix(id, "w_936,h_702,al_c,q_85") })),
    ...local.map((src) => ({ src })),
  ];
  return u.concat(u);
};
const stripA = buildStrip(STRIP_A_IDS, STRIP_A_LOCAL);
const stripB = buildStrip(STRIP_B_IDS, STRIP_B_LOCAL);

// Relleno temporal (se usa solo si /public/assets/eventos está vacío).
const EVENT_IMAGES = [
  wix("59862d_0533244ab7674d5bbafba80bde43841e", "w_900,h_675,al_c,q_85"),
  wix("59862d_8eca0eed171f4730805a37062843f134", "w_900,h_675,al_c,q_85"),
  wix("59862d_203c7c915b9148a698ff7ad74e8d6adc", "w_900,h_675,al_c,q_85"),
];
// Pool del slider de Eventos. Se nutre de las fotos reales en
// /public/assets/eventos (manifiesto generado por scripts/gen-event-photos.mjs).
// Si todavía no hay fotos cargadas, cae al relleno de arriba.
const EVENT_POOL = eventPhotos.length ? eventPhotos : EVENT_IMAGES;

const AMENITIES = [
  "Terraza privada",
  "Climatización frío/calor",
  "Wi-Fi",
  "TV LED & streaming",
  "Minibar",
  "Caja de seguridad",
  "Amenities",
  "Desayuno artesanal",
  "Estacionamiento privado",
];

const ACTIVITIES = [
  {
    src: "/assets/actividades/lago.avif",
    alt: "Lago natural al atardecer",
    title: "Lago & Oratorio",
    items: ["Lago natural", "Oratorio único", "Atardeceres"],
  },
  {
    src: "/assets/actividades/piscina.webp",
    alt: "Piscina rodeada de palmeras al atardecer",
    title: "Piscina",
    items: ["Piscina al aire libre", "Reposeras & solárium", "Rincones para relajarse"],
  },
  {
    src: "/assets/actividades/naturaleza.webp",
    alt: "Flores y naturaleza a contraluz",
    title: "Naturaleza",
    items: ["Senderos", "Vistas y rincones", "Espacios al aire libre"],
  },
];

// Slider Playa Blanca (fotos del parador). Auto-avanza con fade cruzado.
const PLAYA_SLIDES = [
  "/assets/playa/playa-1.webp",
  "/assets/playa/playa-2.webp",
  "/assets/playa/playa-3.webp",
  "/assets/playa/playa-4.webp",
  "/assets/playa/playa-5.webp",
  "/assets/playa/playa-6.webp",
  "/assets/playa/playa-7.webp",
];

const CONTACT = [
  { label: "WhatsApp", value: "(54 9) 3407 66-7777", href: WA, external: true },
  {
    label: "Email",
    value: "info@eldestino.com.ar",
    href: "mailto:info@eldestino.com.ar?subject=Consulta%20Web%20EL%20DESTINO!",
    external: false,
  },
  {
    label: "Mapa",
    value: "Cómo llegar →",
    href: "https://maps.app.goo.gl/x1hV9pZx2w8uF9PE9",
    external: true,
  },
];

/* ============================================================
   Reusable style fragments
   ============================================================ */
const amenityCell = {
  padding: "13px 4px",
  borderTop: "1px solid rgba(58,46,34,.16)",
  color: "#3A2E22",
  fontSize: 14.5,
  letterSpacing: ".06em",
  fontWeight: 300,
};
const actItem = { fontFamily: SERIF, fontStyle: "italic", fontSize: 19, color: "#EADFCB" };
const eyebrow = (color, margin) => ({
  margin,
  fontSize: 13,
  letterSpacing: ".34em",
  textTransform: "uppercase",
  color,
});
const bodyText = (margin) => ({
  margin,
  fontSize: 17,
  lineHeight: 1.85,
  fontWeight: 300,
  color: "#5C4D3C",
  textWrap: "pretty",
});

/* ============================================================
   Slider de Eventos
   3 fotos siempre visibles (1 en mobile). Sin botones ni navegación.
   No se deslizan: cada tile se DESVANECE (crossfade) hacia otra foto
   del pool, de a uno por vez y sin repetir la que muestran los demás.
   ============================================================ */
function EventSlider({ pool }) {
  const TILES = 3;
  const [tiles, setTiles] = useState(() =>
    Array.from({ length: TILES }, (_, i) => {
      const idx = pool.length ? i % pool.length : 0;
      return { front: idx, back: idx, showFront: true };
    })
  );
  const nextRef = useRef(pool.length ? TILES % pool.length : 0);
  const turnRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq && mq.matches) return; // respeta reduced-motion: fotos fijas
    if (pool.length <= TILES) return; // con 3 o menos no hay a qué desvanecerse

    const id = setInterval(() => {
      setTiles((prev) => {
        const t = turnRef.current % TILES;
        turnRef.current += 1;
        // próxima foto que no esté visible en ningún otro tile
        const visible = new Set(prev.map((x) => (x.showFront ? x.front : x.back)));
        let ni = nextRef.current;
        let guard = 0;
        while (visible.has(ni) && guard < pool.length) {
          ni = (ni + 1) % pool.length;
          guard++;
        }
        nextRef.current = (ni + 1) % pool.length;
        const copy = prev.slice();
        const cur = { ...copy[t] };
        // cargo la nueva foto en la capa oculta y recién ahí cruzo el fade
        if (cur.showFront) {
          cur.back = ni;
          cur.showFront = false;
        } else {
          cur.front = ni;
          cur.showFront = true;
        }
        copy[t] = cur;
        return copy;
      });
    }, 2600);
    return () => clearInterval(id);
  }, [pool]);

  return (
    <div
      data-grid="3"
      data-event-slider=""
      data-reveal="0"
      style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}
    >
      {tiles.map((t, i) => (
        <div
          key={i}
          data-ev-tile=""
          style={{
            position: "relative",
            aspectRatio: "4 / 3",
            borderRadius: 6,
            overflow: "hidden",
            background: "#EFE7DA",
            boxShadow: "0 20px 50px rgba(74,53,39,.18)",
          }}
        >
          {[t.front, t.back].map((imgIdx, layer) => (
            <img
              key={layer}
              src={pool[imgIdx]}
              loading="lazy"
              decoding="async"
              alt=""
              aria-hidden="true"
              draggable="false"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: (layer === 0) === t.showFront ? 1 : 0,
                transition: "opacity 1300ms cubic-bezier(.4,0,.2,1)",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   Page
   ============================================================ */
export default function Page() {
  const [playaSlide, setPlayaSlide] = useState(0);
  // El video del hero se resuelve recién en el cliente para elegir la calidad
  // según el ancho de pantalla (480p en mobile, 720p en desktop) y para no
  // descargar los ~25 MB del 1080p en la carga inicial. Hasta entonces el hero
  // es negro. Wix sirve /480p, /720p y /1080p para el mismo id de video.
  const [heroVideoSrc, setHeroVideoSrc] = useState(null);
  // El video arranca invisible y aparece con un fade recién cuando tiene buffer,
  // así no se ve el arranque entrecortado sobre una conexión lenta.
  const [heroVideoReady, setHeroVideoReady] = useState(false);

  useEffect(() => {
    const base =
      "https://video.wixstatic.com/video/11062b_7488edba38234bd69b0603ad498efdf5";
    const res = window.matchMedia("(max-width: 768px)").matches ? "480p" : "720p";
    setHeroVideoSrc(`${base}/${res}/mp4/file.mp4`);
  }, []);

  // Red para que el hero nunca quede negro para siempre si el video falla o
  // el browser no llega a emitir canplay/loadeddata.
  useEffect(() => {
    if (!heroVideoSrc) return;
    const t = setTimeout(() => setHeroVideoReady(true), 6000);
    return () => clearTimeout(t);
  }, [heroVideoSrc]);

  useEffect(() => {
    const cleanup = mountFx();
    return cleanup;
  }, []);

  // Auto-avance del slider de Playa Blanca
  useEffect(() => {
    const id = setInterval(
      () => setPlayaSlide((s) => (s + 1) % PLAYA_SLIDES.length),
      4800
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Jost', Helvetica, sans-serif",
        color: "#3A2E22",
        background: "#FAF7F1",
        overflowX: "clip",
      }}
    >
      {/* ===== FX: progreso + cursor ===== */}
      <div
        data-progress="x"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 3,
          width: "0%",
          background: "linear-gradient(90deg,#C9A878,#EBDFC9)",
          zIndex: 60,
          pointerEvents: "none",
        }}
      />
      <div
        data-cursor-ring="x"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 42,
          height: 42,
          border: "1.5px solid #E8D9BD",
          borderRadius: 999,
          zIndex: 95,
          pointerEvents: "none",
          mixBlendMode: "difference",
          transform: "translate3d(-100px,-100px,0)",
        }}
      />
      <div
        data-cursor-dot="x"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: 999,
          background: "#E8D9BD",
          zIndex: 95,
          pointerEvents: "none",
          mixBlendMode: "difference",
          transform: "translate3d(-100px,-100px,0)",
        }}
      />

      {/* ===== CTA FLOTANTE ===== */}
      <a
        data-float-cta="x"
        href={WA}
        target="_blank"
        rel="noopener"
        style={{
          position: "fixed",
          right: 30,
          bottom: 30,
          zIndex: 80,
          display: "inline-block",
          padding: "17px 36px",
          borderRadius: 999,
          fontSize: 13.5,
          letterSpacing: ".22em",
          textTransform: "uppercase",
          fontWeight: 500,
          textDecoration: "none",
          background: "#2E241B",
          color: "#F5EFE6",
          boxShadow: "0 14px 38px rgba(30,22,15,.35)",
          opacity: 0,
          transform: "translateY(18px)",
          pointerEvents: "none",
          transition: "opacity .45s ease, transform .45s ease",
        }}
      >
        Reservar
      </a>

      {/* ===== HERO ===== */}
      <header
        id="inicio"
        data-theme="dark"
        data-hero="x"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 0,
          height: "100vh",
          minHeight: 640,
          display: "grid",
          placeItems: "center",
          overflow: "clip",
          background: "#000",
          transition: "opacity .5s ease",
        }}
      >
        <video
          src={heroVideoSrc || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setHeroVideoReady(true)}
          onLoadedData={() => setHeroVideoReady(true)}
          data-hero-video="x"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scale(1.07)",
            opacity: heroVideoReady ? 1 : 0,
            transition: "opacity 1.2s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(26,19,12,.52) 0%, rgba(26,19,12,.34) 45%, rgba(46,36,27,.82) 100%)",
          }}
        />
        <div
          data-hero-content="x"
          style={{
            position: "relative",
            textAlign: "center",
            padding: "0 24px",
            maxWidth: 980,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 26,
            willChange: "transform",
          }}
        >
          <img
            src="/assets/logo-blanco.avif"
            alt="El Destino — Posada Boutique"
            fetchPriority="high"
            decoding="async"
            style={{ width: "min(460px, 72vw)", height: "auto" }}
            data-reveal="100"
          />
          <div
            style={{ width: 54, height: 1, background: "rgba(245,239,230,.55)" }}
            data-reveal="380"
          />
          <p
            style={{
              margin: 0,
              fontFamily: SERIF,
              fontWeight: 500,
              fontSize: "clamp(26px,3.2vw,42px)",
              lineHeight: 1.2,
              color: "#FAF6EE",
              textWrap: "balance",
            }}
            data-reveal="460"
          >
            Aquí solo soplan buenos vientos
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              letterSpacing: ".34em",
              textTransform: "uppercase",
              color: "rgba(245,239,230,.82)",
            }}
            data-reveal="600"
          >
            Pequeños detalles. Grandes momentos.
          </p>
          <a
            href={WA}
            target="_blank"
            rel="noopener"
            className="fx-link fx-lift"
            style={{
              marginTop: 12,
              display: "inline-block",
              color: "#2E241B",
              background: "#F5EFE6",
              textDecoration: "none",
              fontSize: 14,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              fontWeight: 500,
              padding: "16px 38px",
              borderRadius: 999,
              boxShadow: "0 10px 30px rgba(0,0,0,.25)",
            }}
            data-reveal="740"
          >
            Reservar ahora
          </a>
        </div>
        <a
          href="#lugar"
          aria-label="Bajar"
          style={{
            position: "absolute",
            bottom: 26,
            left: "50%",
            transform: "translateX(-50%)",
            color: "rgba(245,239,230,.9)",
            textDecoration: "none",
            fontSize: 22,
            animation: "cue 2.2s ease-in-out infinite",
          }}
        >
          ↓
        </a>
      </header>

      {/* ===== EL LUGAR ===== */}
      <section
        id="lugar"
        data-theme="light"
        style={{
          position: "relative",
          zIndex: 2,
          marginTop: -40,
          borderRadius: "40px 40px 0 0",
          padding: "150px 7vw 110px",
          background: "linear-gradient(180deg,#FAF7F1, #F3ECDF)",
          boxShadow: "0 -34px 60px rgba(30,22,15,.32)",
        }}
      >
        <div
          data-grid="2"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr .95fr",
            gap: 64,
            alignItems: "center",
            maxWidth: 1280,
            margin: "0 auto",
          }}
        >
          <div data-reveal="0">
            <p style={eyebrow("#A3835F", "0 0 18px")}>Menos apuro. Más destino.</p>
            <h2
              style={{
                margin: "0 0 26px",
                fontFamily: SERIF,
                fontWeight: 500,
                fontSize: "clamp(32px,3.4vw,46px)",
                lineHeight: 1.2,
                color: "#3A2E22",
                textWrap: "balance",
              }}
              data-type="x"
            >
              Tu próxima pausa empieza acá.
            </h2>
            <p style={bodyText("0 0 16px")}>
              Naturaleza, confort y experiencias que invitan a disfrutar sin apuros. Habitaciones
              equipadas, desayunos artesanales y amplios espacios al aire libre.
            </p>
            <p style={bodyText("0 0 34px")}>
              Cada detalle está pensado para que tu única preocupación sea disfrutar.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 40, height: 1, background: "#C5AE8C" }} />
              <p
                style={{
                  margin: 0,
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontSize: 21,
                  color: "#8A6A4F",
                }}
              >
                Aquí solo soplan buenos vientos
              </p>
            </div>
          </div>
          <div style={{ position: "relative" }} data-reveal="0">
            <div
              style={{
                position: "absolute",
                inset: "26px -26px -26px 26px",
                backgroundImage: "url(/assets/texturas/palos-2.webp)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 4,
              }}
            />
            <img
              src={wix("59862d_bbb055a7a18a4f5db0da30d0faecc77e", "w_1872,h_1404,al_c,q_90")}
              loading="lazy"
              decoding="async"
              alt="Cabañas de tronco blanco junto al Río Paraná"
              data-parallax="0.05"
              style={{
                position: "relative",
                willChange: "transform",
                width: "100%",
                aspectRatio: "4 / 3.1",
                objectFit: "cover",
                borderRadius: 4,
                display: "block",
                boxShadow: "0 24px 60px rgba(74,53,39,.22)",
              }}
            />
          </div>
        </div>
        <p
          data-parallax="0.08"
          className="quote-big"
          style={{
            maxWidth: 880,
            margin: "90px auto 0",
            willChange: "transform",
            textAlign: "center",
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(26px,2.8vw,36px)",
            lineHeight: 1.5,
            color: "#6B563F",
            textWrap: "balance",
          }}
          data-reveal="0"
          data-type="x"
        >
          Porque algunas escapadas no se miden en días. Se miden en momentos.
        </p>
      </section>

      {/* ===== HABITACIONES (scroll horizontal con pin) ===== */}
      <section
        id="habitaciones"
        data-theme="light"
        data-hscroll=""
        style={{
          position: "relative",
          zIndex: 2,
          background: "#EDE7DD",
          backgroundImage: "url(/assets/texturas/palos-3.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div
          data-hscroll-pin=""
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            data-hscroll-track=""
            style={{
              display: "flex",
              alignItems: "center",
              gap: 34,
              padding: "0 7vw",
              willChange: "transform",
            }}
          >
            {/* Panel de texto (primer panel) */}
            <div
              data-hscroll-intro=""
              style={{
                flex: "0 0 clamp(330px, 34vw, 520px)",
                boxSizing: "border-box",
                backgroundColor: "#EBE4CA",
                backgroundImage:
                  "linear-gradient(rgba(235,228,202,.84), rgba(235,228,202,.84)), url(/assets/texturas/palos-3.webp)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: "48px 44px",
                borderRadius: 10,
                boxShadow: "0 20px 50px rgba(74,53,39,.18)",
              }}
            >
              <p style={eyebrow("#8A6A4F", "0 0 18px")}>Habitaciones</p>
              <h2
                style={{
                  margin: "0 0 24px",
                  fontFamily: SERIF,
                  fontWeight: 500,
                  fontSize: "clamp(30px,3vw,44px)",
                  lineHeight: 1.2,
                  color: "#3A2E22",
                  textWrap: "balance",
                }}
                data-type="x"
              >
                Dormir bien cambia todo
              </h2>
              <p
                style={{
                  margin: "0 0 30px",
                  fontSize: 16,
                  lineHeight: 1.8,
                  fontWeight: 300,
                  color: "#5C4D3C",
                  textWrap: "pretty",
                }}
              >
                Suite, single, doble, doble twin, triple y cuádruple. Cada categoría pensada para tu
                mejor descanso.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 0,
                  borderBottom: "1px solid rgba(58,46,34,.16)",
                }}
              >
                {AMENITIES.map((a) => (
                  <div key={a} style={amenityCell}>
                    {a}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 34, color: "#8A6A4F" }}>
                <span style={{ fontSize: 12, letterSpacing: ".24em", textTransform: "uppercase" }}>
                  Deslizá
                </span>
                <span style={{ flex: 1, height: 1, background: "rgba(138,106,79,.5)", minWidth: 40 }} />
                <span style={{ fontSize: 18 }}>→</span>
              </div>
            </div>

            {/* Fotos */}
            {roomCards.map((card) => (
              <figure
                key={card.label}
                data-hscroll-card=""
                style={{
                  margin: 0,
                  flex: "0 0 clamp(420px, 44vw, 720px)",
                  height: "72vh",
                  position: "relative",
                  borderRadius: 6,
                  overflow: "hidden",
                  boxShadow: "0 30px 80px rgba(0,0,0,.45)",
                }}
              >
                <img
                  src={card.src}
                  alt={card.label}
                  loading="lazy"
                  decoding="async"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: "auto 0 0 0",
                    height: 150,
                    background: "linear-gradient(180deg,transparent,rgba(20,14,9,.7))",
                  }}
                />
                <figcaption
                  style={{
                    position: "absolute",
                    left: 26,
                    right: 26,
                    bottom: 24,
                    color: "#F5EFE6",
                    fontFamily: SERIF,
                    fontSize: 24,
                    letterSpacing: ".02em",
                  }}
                >
                  {card.label}
                  <span
                    style={{
                      display: "block",
                      marginTop: 6,
                      fontFamily: "'Jost', Helvetica, sans-serif",
                      fontSize: 13,
                      fontWeight: 300,
                      letterSpacing: ".04em",
                      color: "rgba(245,239,230,.85)",
                    }}
                  >
                    {card.text}
                  </span>
                </figcaption>
              </figure>
            ))}

            {/* Cierre: CTA */}
            <div
              data-hscroll-end=""
              style={{
                flex: "0 0 clamp(280px, 26vw, 420px)",
                boxSizing: "border-box",
                textAlign: "left",
                backgroundColor: "#EBE4CA",
                backgroundImage:
                  "linear-gradient(rgba(235,228,202,.84), rgba(235,228,202,.84)), url(/assets/texturas/palos-3.webp)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: "48px 44px",
                borderRadius: 10,
                boxShadow: "0 20px 50px rgba(74,53,39,.18)",
              }}
            >
              <p
                style={{
                  margin: "0 0 18px",
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontSize: "clamp(24px,2.4vw,34px)",
                  lineHeight: 1.35,
                  color: "#3A2E22",
                }}
              >
                Tu próxima pausa empieza acá.
              </p>
              <a
                href={WA}
                target="_blank"
                rel="noopener"
                className="fx-link fx-brighten"
                style={{
                  display: "inline-block",
                  color: "#2E241B",
                  background: "#EBDFC9",
                  textDecoration: "none",
                  fontSize: 13.5,
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  padding: "15px 34px",
                  borderRadius: 999,
                }}
              >
                Consultar disponibilidad
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ACTIVIDADES ===== */}
      <section
        id="actividades"
        data-theme="light"
        style={{
          position: "relative",
          zIndex: 2,
          padding: "130px 7vw 0",
          background: "#EFE6D6",
          backgroundImage: "radial-gradient(circle at 50% 0%, #F6F0E4, #E7DAC2)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }} data-reveal="0">
            <p style={eyebrow("#A3835F", "0 0 18px")}>El lugar</p>
            <h2
              style={{
                margin: "0 0 22px",
                fontFamily: SERIF,
                fontWeight: 500,
                fontSize: "clamp(32px,3.4vw,46px)",
                lineHeight: 1.2,
                color: "#3A2E22",
                textWrap: "balance",
              }}
              data-type="x"
            >
              Mucho más que una estadía
            </h2>
            <p style={bodyText(0)}>
              Piscina, naturaleza y rincones que invitan a recorrer y descubrir cada parte del
              complejo. Senderos, un oratorio único en su estilo y un lago que forma parte del
              paisaje.
            </p>
          </div>
        </div>

        {/* Banda interactiva de 3 zonas */}
        <div
          data-activities=""
          data-theme="dark"
          data-reveal="0"
          style={{
            position: "relative",
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
            marginTop: 72,
            height: "76vh",
            minHeight: 560,
            overflow: "hidden",
            background: "#241B12",
          }}
        >
          {ACTIVITIES.map((a, i) => (
            <img
              key={`bg-${i}`}
              data-act-bg={String(i)}
              src={a.src}
              loading="lazy"
              decoding="async"
              alt={a.alt}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: i === 0 ? 1 : 0,
                transition: "opacity .85s ease",
                zIndex: 0,
              }}
            />
          ))}
          <div
            data-act-scrim-global=""
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(26,19,12,.34), rgba(26,19,12,.52))",
              zIndex: 1,
            }}
          />
          <div data-act-row="" style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex" }}>
            {ACTIVITIES.map((a, i) => (
              <div
                key={`zone-${i}`}
                data-act-zone={String(i)}
                style={{
                  position: "relative",
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: 24,
                  boxSizing: "border-box",
                }}
              >
                {i > 0 && (
                  <div
                    data-act-div=""
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "20%",
                      bottom: "20%",
                      width: 1,
                      background: "rgba(245,239,230,.32)",
                      zIndex: 3,
                    }}
                  />
                )}
                <img
                  data-act-img=""
                  src={a.src}
                  loading="lazy"
                  decoding="async"
                  alt=""
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "none",
                    zIndex: 0,
                  }}
                />
                <div
                  data-act-imgscrim=""
                  style={{ position: "absolute", inset: 0, background: "rgba(26,19,12,.45)", display: "none", zIndex: 1 }}
                />
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <h3
                    data-act-title=""
                    style={{
                      margin: 0,
                      fontFamily: SERIF,
                      fontWeight: 500,
                      fontSize: "clamp(26px,2.5vw,40px)",
                      letterSpacing: ".04em",
                      color: "#F5EFE6",
                      opacity: 0.6,
                      transition: "opacity .45s ease, letter-spacing .45s ease",
                    }}
                  >
                    {a.title}
                  </h3>
                  <div
                    data-act-list=""
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 9,
                      opacity: 0,
                      transform: "translateY(12px)",
                      transition: "opacity .5s ease, transform .5s ease",
                    }}
                  >
                    {a.items.map((it) => (
                      <span key={it} style={actItem}>
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EVENTOS ===== */}
      {/* TODO: reemplazar las 3 imágenes (aún de relleno) por las fotos reales de eventos del cliente. */}
      <section
        id="eventos"
        data-theme="light"
        style={{
          position: "relative",
          zIndex: 2,
          padding: "130px 7vw 110px",
          background: "#FCFAF6",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ maxWidth: 720, margin: "0 auto 56px", textAlign: "center" }} data-reveal="0">
            <p style={eyebrow("#A3835F", "0 0 18px")}>Eventos</p>
            <h2
              style={{
                margin: "0 0 22px",
                fontFamily: SERIF,
                fontWeight: 500,
                fontSize: "clamp(32px,3.4vw,46px)",
                lineHeight: 1.2,
                color: "#3A2E22",
                textWrap: "balance",
              }}
              data-type="x"
            >
              Eventos boutique. Momentos inolvidables.
            </h2>
            <p style={bodyText(0)}>
              Celebraciones sociales y empresariales en un entorno natural único. Gastronomía de
              excelencia, atención personalizada y espacios pensados para disfrutar cada encuentro y
              convertirlo en un recuerdo inolvidable.
            </p>
          </div>
          <EventSlider pool={EVENT_POOL} />
        </div>
      </section>

      {/* ===== PLAYA BLANCA ===== */}
      <section
        id="playa"
        data-theme="dark"
        style={{
          position: "relative",
          zIndex: 2,
          height: "96vh",
          minHeight: 620,
          overflow: "hidden",
          display: "grid",
          placeItems: "center",
          background: "#9AA9A2",
        }}
      >
        <div
          data-playa-video=""
          style={{ position: "absolute", inset: 0, clipPath: "inset(0 0 0 100%)", willChange: "clip-path,transform" }}
        >
          {PLAYA_SLIDES.map((src, i) => (
            <img
              key={src}
              src={src}
              loading="lazy"
              decoding="async"
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: i === playaSlide ? 1 : 0,
                transition: "opacity 1.4s ease",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(26,19,12,.28), rgba(26,19,12,.12) 45%, rgba(30,22,13,.55))",
            }}
          />
        </div>
        <div
          data-reveal="0"
          style={{
            position: "relative",
            zIndex: 3,
            textAlign: "center",
            padding: "0 24px",
            maxWidth: 900,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          <p style={eyebrow("rgba(255,255,255,.82)", 0)}>A pasos del río</p>
          <h2
            style={{
              margin: 0,
              fontFamily: SERIF,
              fontWeight: 500,
              fontSize: "clamp(44px,7vw,104px)",
              lineHeight: 1.04,
              color: "#FFFFFF",
              textWrap: "balance",
            }}
          >
            Playa Blanca
          </h2>
          <p
            style={{
              margin: 0,
              maxWidth: 600,
              fontSize: 16.5,
              lineHeight: 1.8,
              fontWeight: 300,
              color: "rgba(255,255,255,.92)",
              textWrap: "pretty",
            }}
          >
            Frente a la posada, cruzando la calle, te espera nuestro parador sobre la costa del
            Paraná. Playa, naturaleza, gastronomía y algunos de los atardeceres más lindos de la
            región.
          </p>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 26,
            zIndex: 4,
            display: "flex",
            justifyContent: "center",
            gap: 12,
          }}
        >
          {PLAYA_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ver foto ${i + 1} de Playa Blanca`}
              onClick={() => setPlayaSlide(i)}
              className="fx-link"
              style={{
                width: i === playaSlide ? 30 : 10,
                height: 10,
                padding: 0,
                border: "none",
                borderRadius: 999,
                cursor: "pointer",
                background: i === playaSlide ? "#F5EFE6" : "rgba(245,239,230,.5)",
                transition: "width .4s ease, background .4s ease",
              }}
            />
          ))}
        </div>
      </section>

      {/* ===== GALERÍA ===== */}
      <section
        id="galeria"
        data-theme="light"
        style={{ position: "relative", zIndex: 2, padding: "110px 0 120px", background: "#FAF7F1", overflow: "clip" }}
      >
        <div style={{ textAlign: "center", marginBottom: 54, padding: "0 7vw" }} data-reveal="0">
          <p style={eyebrow("#A3835F", "0 0 16px")}>Galería</p>
          <h2
            style={{
              margin: 0,
              fontFamily: SERIF,
              fontWeight: 500,
              fontSize: "clamp(32px,3.4vw,46px)",
              color: "#3A2E22",
            }}
            data-type="x"
          >
            Postales de El Destino
          </h2>
        </div>
        <div data-strip="-1" style={{ display: "flex", gap: 18, width: "max-content", willChange: "transform" }}>
          {stripA.map((g, i) => (
            <img
              key={`a-${i}`}
              src={g.src}
              loading="lazy"
              decoding="async"
              alt="El Destino — galería"
              style={{ height: 300, width: "auto", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: 4, display: "block" }}
            />
          ))}
        </div>
        <div data-strip="1" style={{ display: "flex", gap: 18, width: "max-content", marginTop: 18, willChange: "transform" }}>
          {stripB.map((g, i) => (
            <img
              key={`b-${i}`}
              src={g.src}
              loading="lazy"
              decoding="async"
              alt="El Destino — galería"
              style={{ height: 300, width: "auto", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: 4, display: "block" }}
            />
          ))}
        </div>
      </section>

      {/* ===== UBICACIÓN ===== */}
      <section
        id="ubicacion"
        data-theme="light"
        style={{
          position: "relative",
          zIndex: 2,
          padding: "120px 7vw",
          background: "#E7DAC2",
          backgroundImage: "linear-gradient(180deg,#EFE6D6,#E2D2B6)",
        }}
      >
        <div
          data-grid="2"
          style={{
            display: "grid",
            gridTemplateColumns: ".9fr 1.1fr",
            gap: 64,
            alignItems: "center",
            maxWidth: 1280,
            margin: "0 auto",
          }}
        >
          <div data-reveal="0">
            <p style={eyebrow("#A3835F", "0 0 18px")}>Ubicación</p>
            <h2
              style={{
                margin: "0 0 24px",
                fontFamily: SERIF,
                fontWeight: 500,
                fontSize: "clamp(32px,3.4vw,46px)",
                lineHeight: 1.22,
                color: "#3A2E22",
                textWrap: "balance",
              }}
              data-type="x"
            >
              No hace falta irse lejos para desconectar
            </h2>
            <p style={{ margin: "0 0 34px", fontSize: 17, lineHeight: 1.85, fontWeight: 300, color: "#5C4D3C" }}>
              Ramallo, Buenos Aires. A solo 1 hora de Rosario y 2 horas de Buenos Aires.
              <br />
              Tu próxima escapada está más cerca de lo que imaginás.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {CONTACT.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener" } : {})}
                  style={{
                    color: "#3A2E22",
                    textDecoration: "none",
                    fontSize: 16,
                    fontWeight: 400,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      letterSpacing: ".24em",
                      textTransform: "uppercase",
                      color: "#A3835F",
                      width: 84,
                    }}
                  >
                    {c.label}
                  </span>
                  {c.value}
                </a>
              ))}
            </div>
          </div>
          <div
            style={{ position: "relative", borderRadius: 6, overflow: "clip", boxShadow: "0 24px 60px rgba(74,53,39,.2)" }}
            data-reveal="0"
          >
            <iframe
              src="https://www.google.com/maps?q=El%20Destino%20Posada%20Boutique%2C%20Ramallo%2C%20Buenos%20Aires&output=embed"
              title="Mapa — El Destino Posada Boutique"
              loading="lazy"
              style={{
                width: "100%",
                height: 440,
                border: 0,
                display: "block",
                filter: "sepia(.22) saturate(.9)",
                pointerEvents: "none",
              }}
            />
            <a
              href="https://maps.app.goo.gl/x1hV9pZx2w8uF9PE9"
              target="_blank"
              rel="noopener"
              aria-label="Abrir en Google Maps"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 2,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-start",
                textDecoration: "none",
                padding: 18,
              }}
            >
              <span
                style={{
                  background: "rgba(36,27,18,.85)",
                  color: "#F5EFE6",
                  fontSize: 12.5,
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  padding: "11px 20px",
                  borderRadius: 999,
                  backdropFilter: "blur(4px)",
                }}
              >
                Abrir en Google Maps ↗
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer
        data-theme="light"
        style={{
          position: "relative",
          zIndex: 2,
          background: "#EDE7DD",
          padding: "96px 7vw 44px",
          color: "#5C4D3C",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 30,
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: "clamp(26px,3vw,38px)",
              lineHeight: 1.3,
              color: "#3A2E22",
              textWrap: "balance",
            }}
          >
            Tu próxima pausa empieza acá.
          </p>
          <p style={{ margin: "-12px 0 0", fontSize: 13, letterSpacing: ".28em", textTransform: "uppercase", color: "#8A6A4F" }}>
            Menos apuro. Más destino.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <a
              href="https://www.instagram.com/eldestinoposada/"
              target="_blank"
              rel="noopener"
              className="fx-link fx-ghost"
              style={{
                color: "#3A2E22",
                textDecoration: "none",
                fontSize: 13,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                padding: "12px 24px",
                border: "1px solid rgba(58,46,34,.3)",
                borderRadius: 999,
              }}
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@eldestinoposada/"
              target="_blank"
              rel="noopener"
              className="fx-link fx-ghost"
              style={{
                color: "#3A2E22",
                textDecoration: "none",
                fontSize: 13,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                padding: "12px 24px",
                border: "1px solid rgba(58,46,34,.3)",
                borderRadius: 999,
              }}
            >
              TikTok
            </a>
            <a
              href={WA}
              target="_blank"
              rel="noopener"
              className="fx-link fx-brighten"
              style={{
                color: "#2E241B",
                background: "#EBDFC9",
                textDecoration: "none",
                fontSize: 13,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                fontWeight: 500,
                padding: "12px 24px",
                borderRadius: 999,
              }}
            >
              WhatsApp
            </a>
          </div>
          <div style={{ width: "100%", height: 1, background: "rgba(58,46,34,.14)", marginTop: 26 }} />
          <p style={{ margin: 0, fontSize: 13, letterSpacing: ".14em", color: "rgba(58,46,34,.55)" }}>
            El Destino · Posada Boutique — Paseo “Viva el Río” · Ramallo · Bs. As. · Argentina
          </p>
          <p style={{ margin: "-18px 0 0", fontSize: 12, letterSpacing: ".14em", color: "rgba(58,46,34,.55)" }}>
            Desarrollo:{" "}
            <a href="https://joaquindati.com" target="_blank" rel="noopener" style={{ color: "inherit" }}>
              Joaquín Dati
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
