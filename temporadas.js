// ============================================================
// temporadas.js — Capa de personalización estacional
//
// Muestra una cinta de temporada y elementos cayendo suavemente
// según la FECHA DEL DÍA. Fuera de las fechas configuradas no
// hace absolutamente nada (ni cinta, ni animación, ni botón).
//
// Se sube UNA sola vez: el calendario de todo el año ya viene
// aquí abajo y se repite cada año automáticamente. Para agregar
// una fecha nueva, basta con añadir un objeto a la lista
// TEMPORADAS — no hay que tocar ninguna otra parte del código.
//
// Cómo se usa en una página:
//     <script src="js/temporadas.js"></script>
// (o "temporadas.js" si está en la raíz del repo)
//
// La cinta y la lluvia se ven siempre durante la temporada (no se
// pueden cerrar). Si la temporada tiene «intro», se carga además su
// entrada animada cada vez que se abre la página.
// ============================================================

(function () {
  'use strict';
  // Carpeta de este archivo, para cargar la entrada animada de la temporada (si tiene).
  const BASE = (document.currentScript && document.currentScript.src || '').replace(/[^/]*$/, '');

  // ---------- Calendario de temporadas ----------
  // desde / hasta en formato 'MM-DD' (inclusive ambos extremos).
  // Se evalúan en orden: la primera que coincida es la que se usa.
  const TEMPORADAS = [
    {
      id: 'patrio',
      mensaje: '¡Viva México!',
      desde: '09-01', hasta: '09-30',
      emojis: ['🇲🇽', '🎉', '🪅', '🎊', '🌽'],
      colorCinta: '#006341',   // verde bandera
      colorTexto: '#FFFFFF',
    },
    {
      id: 'muertos',
      mensaje: 'Día de Muertos',
      desde: '10-25', hasta: '11-03',
      emojis: ['💀', '🕯️', '🌼', '🍬', '🎃'],
      colorCinta: '#5B2C6F',
      colorTexto: '#FFF4D6',
      brillo: '#F28C1B',          // las piezas cercanas brillan como veladoras
      intro: 'intro-muertos.js',   // entrada animada: calavera que cae, papel picado y veladoras
    },
    {
      id: 'navidad',
      mensaje: 'Felices fiestas',
      desde: '12-01', hasta: '12-31',
      emojis: ['🎄', '❄️', '⭐', '🎁', '🔔'],
      colorCinta: '#A63D2F',
      colorTexto: '#FFF8EC',
    },
    {
      id: 'anio-nuevo',
      mensaje: 'Feliz Año Nuevo',
      desde: '01-01', hasta: '01-06',
      emojis: ['🎆', '✨', '🥂', '🎊'],
      colorCinta: '#C98A2C',
      colorTexto: '#231F1A',
    },
    {
      id: 'primavera',
      mensaje: 'Bienvenida, primavera',
      desde: '03-20', hasta: '03-31',
      emojis: ['🌸', '🌱', '🦋', '🌷'],
      colorCinta: '#6B7A5E',
      colorTexto: '#FFFFFF',
    },
    {
      id: 'dia-maestro',
      mensaje: 'Feliz Día del Maestro',
      desde: '05-15', hasta: '05-15',
      emojis: ['📚', '✏️', '🍎', '🎓'],
      colorCinta: '#8A5E12',
      colorTexto: '#FFF8EC',
    },
  ];

  // ---------- Ajustes generales ----------
  const CANTIDAD_ELEMENTOS = 24;   // cuántos caen a la vez

  // ---------- ¿Qué temporada toca hoy? ----------
  function temporadaDeHoy() {
    const hoy = new Date();
    const mmdd = String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
                 String(hoy.getDate()).padStart(2, '0');

    return TEMPORADAS.find(t => {
      // Rango normal dentro del mismo año (ej. 09-01 a 09-30).
      if (t.desde <= t.hasta) return mmdd >= t.desde && mmdd <= t.hasta;
      // Rango que cruza el fin de año (ej. 12-20 a 01-05).
      return mmdd >= t.desde || mmdd <= t.hasta;
    });
  }

  const temporada = temporadaDeHoy();
  if (!temporada) return; // fuera de temporada: no se hace nada


  // Respeta a quien pidió al sistema reducir animaciones.
  const sinMovimiento = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Estilos (van aquí para no tocar los CSS de cada página) ----------
  const estilos = document.createElement('style');
  estilos.textContent = `
    .temporada-cinta{
      position:relative; z-index:60;
      display:flex; align-items:center; justify-content:center; gap:10px;
      padding:9px 16px;
      font-family:'Public Sans', -apple-system, sans-serif;
      font-size:.88rem; font-weight:600; letter-spacing:.02em;
      text-align:center; line-height:1.35;
    }
    .temporada-cinta-emojis{ font-size:1rem; letter-spacing:.12em; }

    .temporada-lluvia{
      position:fixed; inset:0; z-index:1;
      pointer-events:none; overflow:hidden;
    }
    .temporada-pieza{
      position:absolute; top:-60px;
      font-size:1.4rem; line-height:1;
      animation-name:temporada-caer;
      animation-timing-function:linear;
      animation-iteration-count:infinite;
    }
    .temporada-pieza > span{
      display:inline-block;
      animation:temporada-mece var(--mece,3s) ease-in-out infinite alternate;
      filter:drop-shadow(0 0 6px var(--brillo,transparent));
    }
    @keyframes temporada-caer{
      0%   { transform:translateY(-60px); }
      100% { transform:translateY(110vh); }
    }
    @keyframes temporada-mece{
      0%   { transform:translateX(calc(var(--lado,30px) * -1)) rotate(-25deg) scale(.9); }
      100% { transform:translateX(var(--lado,30px)) rotate(25deg) scale(1.1); }
    }
    @media print{
      .temporada-cinta, .temporada-lluvia{ display:none !important; }
    }
  `;
  document.head.appendChild(estilos);

  // ---------- Cinta superior ----------
  function crearCinta() {
    const cinta = document.createElement('div');
    cinta.className = 'temporada-cinta';
    cinta.style.background = temporada.colorCinta;
    cinta.style.color = temporada.colorTexto;

    const emojis = temporada.emojis.slice(0, 3).join(' ');
    cinta.innerHTML =
      `<span class="temporada-cinta-emojis">${emojis}</span>` +
      `<span>${temporada.mensaje}</span>` +
      `<span class="temporada-cinta-emojis">${emojis}</span>`;

    document.body.insertBefore(cinta, document.body.firstChild);
    return cinta;
  }

  // ---------- Elementos cayendo ----------
  function crearLluvia() {
    const capa = document.createElement('div');
    capa.className = 'temporada-lluvia';
    capa.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < CANTIDAD_ELEMENTOS; i++) {
      const pieza = document.createElement('span');
      pieza.className = 'temporada-pieza';
      const dentro = document.createElement('span');
      dentro.textContent = temporada.emojis[i % temporada.emojis.length];
      pieza.appendChild(dentro);
      // Unas cerca (grandes, rápidas, nítidas) y otras lejos (chicas, lentas, tenues): da profundidad.
      const cerca = Math.random();
      pieza.style.left = Math.random() * 100 + '%';
      pieza.style.fontSize = (1 + cerca * 1.6).toFixed(2) + 'rem';
      pieza.style.animationDuration = (16 - cerca * 8 + Math.random() * 3).toFixed(1) + 's';
      pieza.style.animationDelay = (-Math.random() * 16).toFixed(1) + 's';
      pieza.style.opacity = (0.4 + cerca * 0.5).toFixed(2);
      dentro.style.setProperty('--lado', (15 + Math.random() * 45).toFixed(0) + 'px');
      dentro.style.setProperty('--mece', (2 + Math.random() * 2.5).toFixed(1) + 's');
      dentro.style.animationDelay = (-Math.random() * 4).toFixed(1) + 's';
      if (temporada.brillo && cerca > 0.6) dentro.style.setProperty('--brillo', temporada.brillo);
      capa.appendChild(pieza);
    }

    document.body.appendChild(capa);
    return capa;
  }

  let cinta = null;
  let lluvia = null;

  // ---------- Arranque ----------
  function iniciar() {
    cinta = crearCinta();
    if (!sinMovimiento) lluvia = crearLluvia();
    if (temporada.intro) {
      const s = document.createElement('script');
      s.src = BASE + temporada.intro + '?v=2026103102';
      document.body.appendChild(s);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
