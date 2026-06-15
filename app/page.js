"use client";

import { useEffect } from "react";
import { mountFx } from "./fx";

/* ============================================================
   Data (ported from the prototype's renderVals / helper methods)
   ============================================================ */
const SERIF = "'Cormorant Garamond', Georgia, serif";
const WA = "http://wa.me/5493407667777";

const wix = (id, fill) =>
  `https://static.wixstatic.com/media/${id}~mv2.jpg/v1/fill/${fill}/${id}~mv2.jpg`;

const ROOM_LABELS = ["Suite", "Single", "Doble", "Doble Twin", "Triple", "Cuádruple"];
const ROOM_IDS = [
  "59862d_74c6f720ca6c4622bfcfbeab25696ba7",
  "59862d_96fbf2a4cc874ab5a460b04686917a36",
  "59862d_927585beda0a40f19439ce1bdd2bdb48",
  "59862d_17152af4d2be433f8bde0779692dc1be",
  "59862d_bc346bfccfe14c8d991121c57fb6af00",
  "59862d_3f9596924adf4a6c8952f09719d1cd2d",
];
const roomCards = ROOM_IDS.map((id, i) => ({
  src: wix(id, "w_1500,h_1800,al_c,q_90"),
  label: ROOM_LABELS[i] || "El Destino",
}));

const STRIP_A_IDS = [
  "59862d_0533244ab7674d5bbafba80bde43841e",
  "59862d_a6389a83de71481cbd863671b44a7989",
  "59862d_fbaa5d3043fc4f828190f73a0c1a7c30",
  "59862d_619cc26d8abf4ba5acba9d23c52b38e8",
  "59862d_203c7c915b9148a698ff7ad74e8d6adc",
  "59862d_19b807ab22724c42aaff5ea21cc62ff2",
];
const STRIP_B_IDS = [
  "59862d_bfe530b50530490fb01e9b2947895e91",
  "59862d_8eca0eed171f4730805a37062843f134",
  "59862d_32980b2d16d34a0fb38ca4b0ed0559e9",
  "59862d_a5f90d5c137345dcb16f9434dbab55f1",
  "59862d_3443279cb4174caca25ed7b544725947",
  "59862d_183a9fa455fc4f7fa695dce4fb02d635",
];
// strip() duplicates the list so the marquee can wrap seamlessly
const buildStrip = (ids) => {
  const u = ids.map((id) => ({ src: wix(id, "w_936,h_702,al_c,q_85") }));
  return u.concat(u);
};
const stripA = buildStrip(STRIP_A_IDS);
const stripB = buildStrip(STRIP_B_IDS);

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
    bg: "59862d_fb2284a3d7ab4365b6e27cc1fe61ee41",
    alt: "Náutica en el Río Paraná",
    title: "Lago & Oratorio",
    items: ["Lago natural", "Oratorio único", "Atardeceres"],
  },
  {
    bg: "59862d_d8d1c738c9da465cb8d42b48e4a11647",
    alt: "Pileta y relax",
    title: "Piscina",
    items: ["Piscina al aire libre", "Reposeras & solárium", "Rincones para relajarse"],
  },
  {
    bg: "59862d_b32504c35cdf4d73a78a9ee5e01f27e4",
    alt: "Naturaleza y aire libre",
    title: "Naturaleza",
    items: ["Senderos", "Vistas y rincones", "Espacios al aire libre"],
  },
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
  borderTop: "1px solid rgba(245,239,230,.18)",
  color: "#EFE6D6",
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
   Page
   ============================================================ */
export default function Page() {
  useEffect(() => {
    const cleanup = mountFx();
    return cleanup;
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
          background: "#2E241B",
          transition: "opacity .5s ease",
        }}
      >
        <video
          src="https://video.wixstatic.com/video/11062b_7488edba38234bd69b0603ad498efdf5/1080p/mp4/file.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster={wix("59862d_bbb055a7a18a4f5db0da30d0faecc77e", "w_1872,h_1404,al_c,q_90")}
          data-hero-video="x"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scale(1.07)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(26,19,12,.42) 0%, rgba(26,19,12,.18) 45%, rgba(46,36,27,.72) 100%)",
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
            Pequeños detalles. Grandes momentos.
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
            Aquí solo soplan buenos vientos
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
          padding: "130px 7vw 110px",
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
            <p style={eyebrow("#A3835F", "0 0 18px")}>Bienvenidos</p>
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
              Un lugar para quedarse un poco más
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
                background: "repeating-linear-gradient(90deg,#E4D5BC 0 3px,#EADDC8 3px 14px)",
                borderRadius: 4,
              }}
            />
            <img
              src={wix("59862d_bbb055a7a18a4f5db0da30d0faecc77e", "w_1872,h_1404,al_c,q_90")}
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
        data-theme="dark"
        data-hscroll=""
        style={{
          position: "relative",
          zIndex: 2,
          background: "#2E241B",
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,.025) 0 2px, rgba(0,0,0,0) 2px 90px), linear-gradient(180deg,#33281D,#241B12)",
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
            <div data-hscroll-intro="" style={{ flex: "0 0 clamp(330px, 34vw, 520px)", boxSizing: "border-box" }}>
              <p style={eyebrow("#C9A878", "0 0 18px")}>Habitaciones</p>
              <h2
                style={{
                  margin: "0 0 24px",
                  fontFamily: SERIF,
                  fontWeight: 500,
                  fontSize: "clamp(30px,3vw,44px)",
                  lineHeight: 1.2,
                  color: "#F5EFE6",
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
                  color: "#D8CBB8",
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
                  borderBottom: "1px solid rgba(245,239,230,.18)",
                }}
              >
                {AMENITIES.map((a) => (
                  <div key={a} style={amenityCell}>
                    {a}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 34, color: "#C9A878" }}>
                <span style={{ fontSize: 12, letterSpacing: ".24em", textTransform: "uppercase" }}>
                  Deslizá
                </span>
                <span style={{ flex: 1, height: 1, background: "rgba(201,168,120,.5)", minWidth: 40 }} />
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
                    bottom: 24,
                    color: "#F5EFE6",
                    fontFamily: SERIF,
                    fontSize: 24,
                    letterSpacing: ".02em",
                  }}
                >
                  {card.label}
                </figcaption>
              </figure>
            ))}

            {/* Cierre: CTA */}
            <div
              data-hscroll-end=""
              style={{ flex: "0 0 clamp(280px, 26vw, 420px)", boxSizing: "border-box", textAlign: "left" }}
            >
              <p
                style={{
                  margin: "0 0 18px",
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontSize: "clamp(24px,2.4vw,34px)",
                  lineHeight: 1.35,
                  color: "#F5EFE6",
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
          <video
            src="https://video.wixstatic.com/video/11062b_c0f82e7370a041fb92d161623b53b27a/1080p/mp4/file.mp4"
            autoPlay
            muted
            loop
            playsInline
            poster={wix("59862d_6edc706cf75948dfb049216adaa35e33", "w_2940,h_1494,al_c,q_90")}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
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
          <a
            href={WA}
            target="_blank"
            rel="noopener"
            className="fx-link fx-brighten"
            style={{
              marginTop: 8,
              display: "inline-block",
              color: "#2E241B",
              background: "#F5EFE6",
              textDecoration: "none",
              fontSize: 13.5,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              fontWeight: 500,
              padding: "15px 34px",
              borderRadius: 999,
            }}
          >
            Conocer Playa Blanca
          </a>
        </div>
      </section>

      {/* ===== ACTIVIDADES ===== */}
      <section
        id="actividades"
        data-theme="light"
        style={{
          position: "relative",
          zIndex: 2,
          padding: "130px 7vw 110px",
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
              src={wix(a.bg, "w_2200,h_1467,al_c,q_90")}
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
                  src={wix(a.bg, "w_1100,h_1300,al_c,q_85")}
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
          data-grid-rev="x"
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
        data-theme="dark"
        style={{
          position: "relative",
          zIndex: 2,
          background: "#241B12",
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,.02) 0 2px, rgba(0,0,0,0) 2px 110px)",
          padding: "96px 7vw 44px",
          color: "#D8CBB8",
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
          <img
            src="/assets/logo-blanco.avif"
            alt="El Destino — Posada Boutique"
            style={{ width: 300, maxWidth: "70vw", height: "auto" }}
          />
          <p
            style={{
              margin: 0,
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: "clamp(26px,3vw,38px)",
              lineHeight: 1.3,
              color: "#F5EFE6",
              textWrap: "balance",
            }}
          >
            Tu próxima pausa empieza acá.
          </p>
          <p style={{ margin: "-12px 0 0", fontSize: 13, letterSpacing: ".28em", textTransform: "uppercase", color: "#C9B894" }}>
            Menos apuro. Más destino.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <a
              href="https://www.instagram.com/eldestinoposada/"
              target="_blank"
              rel="noopener"
              className="fx-link fx-ghost"
              style={{
                color: "#EFE6D6",
                textDecoration: "none",
                fontSize: 13,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                padding: "12px 24px",
                border: "1px solid rgba(245,239,230,.3)",
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
                color: "#EFE6D6",
                textDecoration: "none",
                fontSize: 13,
                letterSpacing: ".2em",
                textTransform: "uppercase",
                padding: "12px 24px",
                border: "1px solid rgba(245,239,230,.3)",
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
          <div style={{ width: "100%", height: 1, background: "rgba(245,239,230,.14)", marginTop: 26 }} />
          <p style={{ margin: 0, fontSize: 13, letterSpacing: ".14em", color: "rgba(216,203,184,.6)" }}>
            El Destino · Posada Boutique — Paseo “Viva el Río” · Ramallo · Bs. As. · Argentina
          </p>
        </div>
      </footer>
    </div>
  );
}
