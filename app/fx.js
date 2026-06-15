"use client";

/**
 * Scroll & pointer FX engine for the El Destino landing page.
 *
 * This is a faithful port of the imperative animation script that shipped inside
 * the Claude Design prototype (`El Destino.dc.html`). It drives everything that
 * isn't plain CSS:
 *   - the scroll-progress bar
 *   - the hero fade-out
 *   - Playa Blanca's clip-path video reveal
 *   - the pinned horizontal scroll of the rooms strip
 *   - parallax elements + the two marquee gallery strips
 *   - the scroll-scrubbed, letter-by-letter heading reveal (`[data-type]`)
 *   - the floating CTA that re-colours itself against the section behind it
 *   - the custom cursor (ring + dot)
 *   - the interactive 3-zone "Actividades" band
 *
 * Call once on mount; it returns a cleanup function to call on unmount.
 */
export function mountFx() {
  const mm = (q) => (window.matchMedia ? window.matchMedia(q) : null);
  const matches = (q) => {
    const m = mm(q);
    return !!(m && m.matches);
  };
  const reduceMotion = matches("(prefers-reduced-motion: reduce)");

  let hscrollActive = false;
  let typeEls = [];
  let io = null;
  let fx = null;
  let raf = 0;
  let onMove = null;
  const zoneHandlers = [];

  function layoutHScroll() {
    const sec = document.querySelector("[data-hscroll]");
    if (!sec) return;
    const track = sec.querySelector("[data-hscroll-track]");
    const stack = reduceMotion || window.innerWidth <= 900;
    hscrollActive = !stack;
    if (stack) {
      sec.style.height = "auto";
      if (track) track.style.transform = "none";
    } else {
      const maxX = Math.max(0, track.scrollWidth - window.innerWidth);
      sec.style.height = maxX + window.innerHeight + "px";
    }
  }

  function setActivity(i) {
    document.querySelectorAll("[data-act-bg]").forEach((b) => {
      b.style.opacity = parseInt(b.getAttribute("data-act-bg"), 10) === i ? "1" : "0";
    });
    document.querySelectorAll("[data-act-zone]").forEach((z) => {
      const on = parseInt(z.getAttribute("data-act-zone"), 10) === i;
      const t = z.querySelector("[data-act-title]");
      const l = z.querySelector("[data-act-list]");
      if (t) {
        t.style.opacity = on ? "1" : "0.55";
        t.style.letterSpacing = on ? "0.12em" : "0.04em";
      }
      if (l) {
        l.style.opacity = on ? "1" : "0";
        l.style.transform = on ? "translateY(0)" : "translateY(12px)";
      }
    });
  }

  const onResize = () => {
    layoutHScroll();
  };
  window.addEventListener("resize", onResize);

  // Force video autoplay (belt and braces)
  document.querySelectorAll("video").forEach((v) => {
    v.muted = true;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  });

  // Scroll-reveal via WAAPI: elements stay visible if animations can't run
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const delay = parseInt(e.target.getAttribute("data-reveal") || "0", 10);
        try {
          e.target.animate(
            [
              { opacity: 0, transform: "translateY(42px)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 950, delay, easing: "cubic-bezier(.22,.61,.36,1)", fill: "backwards" }
          );
        } catch (err) {}
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

  setActivity(0);

  // Banda de actividades: la imagen cambia según el tercio (zona) bajo el cursor
  document.querySelectorAll("[data-act-zone]").forEach((z) => {
    const i = parseInt(z.getAttribute("data-act-zone"), 10);
    const enter = () => setActivity(i);
    const move = () => setActivity(i);
    z.addEventListener("mouseenter", enter);
    z.addEventListener("mousemove", move);
    zoneHandlers.push({ z, enter, move });
  });

  // Letras ligadas al scroll: cada carácter se revela según la posición del bloque
  typeEls = [];
  document.querySelectorAll("[data-type]").forEach((el) => {
    const full = el.textContent;
    el.textContent = "";
    const spans = [];
    for (const ch of full) {
      const s = document.createElement("span");
      s.textContent = ch;
      s.style.opacity = "0.08";
      s.style.display = "inline";
      s.style.transition =
        "opacity .35s ease, filter .35s ease, transform .45s cubic-bezier(.22,.61,.36,1)";
      s.style.filter = "blur(4px)";
      s.style.transform = "translateY(.18em)";
      el.appendChild(s);
      spans.push(s);
    }
    typeEls.push({ el, spans, shown: 0 });
  });

  layoutHScroll();

  // Si hay reduced-motion (no corre el rAF), dejamos visibles los elementos que el loop animaría
  if (reduceMotion) {
    const pv = document.querySelector("[data-playa-video]");
    if (pv) {
      pv.style.clipPath = "none";
      pv.style.transform = "none";
    }
    // El loop normalmente revela las letras; sin rAF las mostramos directamente
    typeEls.forEach((t) =>
      t.spans.forEach((s) => {
        s.style.opacity = "1";
        s.style.filter = "blur(0px)";
        s.style.transform = "translateY(0)";
      })
    );
  }

  startFx();

  function startFx() {
    if (reduceMotion) return;
    const fine = matches("(pointer: fine)");
    if (!fine) {
      const d = document.querySelector("[data-cursor-dot]");
      const r = document.querySelector("[data-cursor-ring]");
      if (d) d.style.display = "none";
      if (r) r.style.display = "none";
    }
    fx = {
      mx: 0,
      my: 0,
      rx: 0,
      ry: 0,
      cx: -100,
      cy: -100,
      rcx: -100,
      rcy: -100,
      lastY: window.scrollY,
      vel: 0,
      t0: performance.now(),
      strips: {},
      hover: 1,
      ringScale: 1,
    };
    onMove = (e) => {
      fx.mx = (e.clientX / window.innerWidth) * 2 - 1;
      fx.my = (e.clientY / window.innerHeight) * 2 - 1;
      fx.cx = e.clientX;
      fx.cy = e.clientY;
      const t = e.target && e.target.closest ? e.target.closest("a,button") : null;
      fx.hover = t ? 2.1 : 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const loop = (now) => {
      const dt = Math.min(50, now - fx.t0);
      fx.t0 = now;
      const y = window.scrollY;
      fx.vel = fx.vel * 0.92 + Math.abs(y - fx.lastY) * 0.08;
      fx.lastY = y;

      const hero = document.querySelector("[data-hero]");
      if (hero) {
        const gone = y > window.innerHeight * 0.96;
        hero.style.opacity = gone ? "0" : "1";
        hero.style.visibility = gone ? "hidden" : "visible";
      }

      const bar = document.querySelector("[data-progress]");
      if (bar) {
        const p = Math.min(
          1,
          y / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
        );
        bar.style.width = (p * 100).toFixed(2) + "%";
      }

      // Playa Blanca: el video se revela deslizándose desde la derecha según el scroll
      const playaV = document.querySelector("[data-playa-video]");
      if (playaV) {
        const sec = document.getElementById("playa");
        const r = sec.getBoundingClientRect();
        const p = Math.min(
          1,
          Math.max(0, (window.innerHeight - r.top) / (window.innerHeight * 0.9))
        );
        playaV.style.clipPath = "inset(0 0 0 " + ((1 - p) * 100).toFixed(1) + "%)";
        playaV.style.transform = "translateX(" + ((1 - p) * 10).toFixed(1) + "%)";
      }

      // Habitaciones: scroll horizontal con pin (la web "se corre" mostrando las fotos)
      if (hscrollActive) {
        const sec = document.querySelector("[data-hscroll]");
        if (sec) {
          const track = sec.querySelector("[data-hscroll-track]");
          const top = sec.getBoundingClientRect().top;
          const total = Math.max(1, sec.offsetHeight - window.innerHeight);
          const p = Math.min(1, Math.max(0, -top / total));
          const maxX = Math.max(0, track.scrollWidth - window.innerWidth);
          track.style.transform = "translate3d(" + (-p * maxX).toFixed(1) + "px,0,0)";
        }
      }

      document.querySelectorAll("[data-parallax]").forEach((el) => {
        const f = parseFloat(el.getAttribute("data-parallax"));
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
        const d = r.top + r.height / 2 - window.innerHeight / 2;
        el.style.translate = "0 " + (-d * f).toFixed(1) + "px";
      });

      document.querySelectorAll("[data-strip]").forEach((el, i) => {
        const dir = parseFloat(el.getAttribute("data-strip"));
        const s = (fx.strips[i] = (fx.strips[i] || 0) + dir * (0.032 + fx.vel * 0.0045) * dt);
        const half = el.scrollWidth / 2;
        if (half > 0) {
          let o = s % half;
          if (o > 0) o -= half;
          el.style.transform = "translate3d(" + o.toFixed(1) + "px,0,0)";
        }
      });

      // Reveal de letras conducido por el scroll (scrub bidireccional)
      typeEls.forEach((t) => {
        const r = t.el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > window.innerHeight + 100) return;
        const start = window.innerHeight * 0.92;
        const end = window.innerHeight * 0.45;
        const p = Math.max(0, Math.min(1, (start - r.top) / (start - end)));
        const count = Math.round(p * t.spans.length);
        if (count === t.shown) return;
        const dir = count > t.shown ? 1 : -1;
        let i = t.shown;
        while (i !== count) {
          i += dir;
          const s = t.spans[dir > 0 ? i - 1 : i];
          if (!s) continue;
          const on = dir > 0;
          s.style.opacity = on ? "1" : "0.08";
          s.style.filter = on ? "blur(0px)" : "blur(4px)";
          s.style.transform = on ? "translateY(0)" : "translateY(.18em)";
        }
        t.shown = count;
      });

      // CTA flotante: aparece tras el hero y adapta su color al bloque de fondo
      const cta = document.querySelector("[data-float-cta]");
      if (cta) {
        const show = y > window.innerHeight * 0.72;
        cta.style.opacity = show ? "1" : "0";
        cta.style.transform = show ? "translateY(0)" : "translateY(18px)";
        cta.style.pointerEvents = show ? "auto" : "none";
        const py = window.innerHeight - 56;
        let theme = "light";
        document.querySelectorAll("[data-theme]").forEach((s) => {
          const r = s.getBoundingClientRect();
          if (py >= r.top && py <= r.bottom) theme = s.getAttribute("data-theme");
        });
        if (theme === "dark") {
          cta.style.background = "#EBDFC9";
          cta.style.color = "#2E241B";
        } else {
          cta.style.background = "#2E241B";
          cta.style.color = "#F5EFE6";
        }
      }

      // Tilt 3D en tarjetas (data-tilt) — se conserva por fidelidad aunque no haya ninguna
      if (fine)
        document.querySelectorAll("[data-tilt]").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) return;
          const inside =
            fx.cx >= r.left && fx.cx <= r.right && fx.cy >= r.top && fx.cy <= r.bottom;
          const st = el._tilt || (el._tilt = { rx: 0, ry: 0, s: 1 });
          const tx = inside ? ((fx.cx - r.left) / r.width) * 2 - 1 : 0;
          const ty = inside ? ((fx.cy - r.top) / r.height) * 2 - 1 : 0;
          st.ry += (tx * 7 - st.ry) * 0.12;
          st.rx += (-ty * 7 - st.rx) * 0.12;
          st.s += ((inside ? 1.04 : 1) - st.s) * 0.12;
          el.style.transform =
            "perspective(900px) rotateX(" +
            st.rx.toFixed(2) +
            "deg) rotateY(" +
            st.ry.toFixed(2) +
            "deg) scale(" +
            st.s.toFixed(3) +
            ")";
        });

      const dot = fine ? document.querySelector("[data-cursor-dot]") : null;
      const ring = fine ? document.querySelector("[data-cursor-ring]") : null;
      if (dot) dot.style.transform = "translate3d(" + (fx.cx - 4) + "px," + (fx.cy - 4) + "px,0)";
      if (ring) {
        fx.rcx += (fx.cx - fx.rcx) * 0.16;
        fx.rcy += (fx.cy - fx.rcy) * 0.16;
        fx.ringScale += (fx.hover - fx.ringScale) * 0.16;
        ring.style.transform =
          "translate3d(" +
          (fx.rcx - 21).toFixed(1) +
          "px," +
          (fx.rcy - 21).toFixed(1) +
          "px,0) scale(" +
          fx.ringScale.toFixed(3) +
          ")";
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  }

  // Cleanup
  return function unmount() {
    window.removeEventListener("resize", onResize);
    if (onMove) window.removeEventListener("mousemove", onMove);
    if (raf) cancelAnimationFrame(raf);
    if (io) io.disconnect();
    zoneHandlers.forEach(({ z, enter, move }) => {
      z.removeEventListener("mouseenter", enter);
      z.removeEventListener("mousemove", move);
    });
  };
}
