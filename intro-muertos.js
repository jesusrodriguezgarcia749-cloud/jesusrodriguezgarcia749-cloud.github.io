// ============================================================
// intro-muertos.js — Entrada animada de Día de Muertos
//
// La carga temporadas.js solo durante la temporada de Día de
// Muertos. Cae una calavera de azúcar grande desde arriba (¡tuc!),
// rebota, castañetea los dientes entre pétalos de cempasúchil,
// papel picado y veladoras, aparece «Día de Muertos» y a los pocos
// segundos todo se desvanece y queda la página normal.
//
// · Aparece cada vez que se abre la página, durante toda la temporada.
// · Se salta tocando la pantalla, con el botón «Saltar» o con Esc.
// ============================================================
(function () {
  'use strict';

  // ---------- La calavera (dibujo original en SVG) ----------
  const flor = (x, y, r, c1, c2) => `<g transform="translate(${x} ${y})">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<ellipse rx="${r * .42}" ry="${r}" fill="${c1}" transform="rotate(${a}) translate(0 ${-r * .75})"/>`).join('')}<circle r="${r * .55}" fill="${c2}"/></g>`;
  const CALAVERA = `
  <svg viewBox="0 0 400 440" class="im-svg" aria-hidden="true">
    <defs>
      <radialGradient id="imHueso" cx="50%" cy="38%" r="65%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".75" stop-color="#F6EFE2"/><stop offset="1" stop-color="#E4D6BF"/></radialGradient>
      <radialGradient id="imOjo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#3A1240"/><stop offset="1" stop-color="#14061A"/></radialGradient>
    </defs>
    <!-- cráneo -->
    <path d="M200 18 C90 18 32 100 38 196 C42 256 74 292 104 306 L112 342 C116 356 128 362 142 360 L258 360 C272 362 284 356 288 342 L296 306 C326 292 358 256 362 196 C368 100 310 18 200 18 Z" fill="url(#imHueso)" stroke="#2B1630" stroke-width="6"/>
    <!-- adornos de la frente -->
    ${flor(200, 92, 26, '#F28C1B', '#D6336C')}
    ${flor(150, 112, 12, '#2BB3A3', '#FFD23F')}
    ${flor(250, 112, 12, '#2BB3A3', '#FFD23F')}
    <path d="M118 70 q22 -26 44 -10 M282 70 q-22 -26 -44 -10" fill="none" stroke="#7B2D8E" stroke-width="6" stroke-linecap="round"/>
    <g fill="#D6336C">${[100, 120, 280, 300].map((x, i) => `<circle cx="${x}" cy="${i % 2 ? 132 : 146}" r="5"/>`).join('')}</g>
    <!-- ojos: cuencas con pétalos alrededor -->
    <g class="im-ojos">
      ${[138, 262].map(x => `<g transform="translate(${x} 190)">${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => `<ellipse rx="9" ry="16" fill="${a % 60 ? '#F28C1B' : '#FFD23F'}" transform="rotate(${a}) translate(0 -48)"/>`).join('')}<circle r="40" fill="url(#imOjo)"/><circle class="im-brillo" r="11" cx="-10" cy="-10" fill="#FFD23F"/><circle r="4" cx="12" cy="10" fill="#FFF4D6"/></g>`).join('')}
    </g>
    <!-- nariz: corazón invertido -->
    <path d="M200 268 C186 252 176 240 188 230 C194 226 200 232 200 236 C200 232 206 226 212 230 C224 240 214 252 200 268 Z" fill="#2B1630"/>
    <!-- mejillas -->
    <g fill="none" stroke="#2BB3A3" stroke-width="5" stroke-linecap="round">
      <path d="M76 236 q18 -16 34 0 q-16 16 -34 0 Z"/><path d="M290 236 q18 -16 34 0 q-16 16 -34 0 Z"/>
    </g>
    <g fill="#7B2D8E"><circle cx="86" cy="266" r="5"/><circle cx="104" cy="276" r="4"/><circle cx="314" cy="266" r="5"/><circle cx="296" cy="276" r="4"/></g>
    <!-- dientes de arriba -->
    <g class="im-arriba">
      <path d="M128 300 L272 300 L268 318 L132 318 Z" fill="#FFFFFF" stroke="#2B1630" stroke-width="5" stroke-linejoin="round"/>
      <g stroke="#2B1630" stroke-width="4">${[150, 168, 186, 204, 222, 240, 258].map(x => `<line x1="${x}" y1="300" x2="${x}" y2="318"/>`).join('')}</g>
    </g>
    <!-- mandíbula (se mueve) -->
    <g class="im-mandibula">
      <path d="M118 322 C120 372 150 410 200 412 C250 410 280 372 282 322 Z" fill="url(#imHueso)" stroke="#2B1630" stroke-width="6" stroke-linejoin="round"/>
      <path d="M132 326 L268 326 L264 344 L136 344 Z" fill="#FFFFFF" stroke="#2B1630" stroke-width="5" stroke-linejoin="round"/>
      <g stroke="#2B1630" stroke-width="4">${[152, 170, 188, 206, 224, 242].map(x => `<line x1="${x}" y1="326" x2="${x}" y2="344"/>`).join('')}</g>
      ${flor(200, 380, 11, '#D6336C', '#FFD23F')}
      <path d="M150 372 q-14 10 -6 24 M250 372 q14 10 6 24" fill="none" stroke="#F28C1B" stroke-width="5" stroke-linecap="round"/>
    </g>
  </svg>`;

  // ---------- Papel picado ----------
  const COLORES = ['#D6336C', '#F28C1B', '#7B2D8E', '#2BB3A3', '#FFD23F', '#3F7FD0'];
  const banderita = c => `<svg viewBox="0 0 100 120" class="im-bandera" style="--c:${c}"><path d="M0 0 H100 V104 L90 120 L80 104 L70 120 L60 104 L50 120 L40 104 L30 120 L20 104 L10 120 L0 104 Z" fill="${c}"/>
    <g fill="#24102B" opacity=".55"><circle cx="50" cy="44" r="16"/><circle cx="44" cy="40" r="4" fill="${c}"/><circle cx="56" cy="40" r="4" fill="${c}"/><rect x="42" y="56" width="16" height="7" rx="2"/>
    <path d="M14 18 l8 8 l-8 8 l-8 -8 Z M86 18 l8 8 l-8 8 l-8 -8 Z M14 74 l8 8 l-8 8 l-8 -8 Z M86 74 l8 8 l-8 8 l-8 -8 Z"/><circle cx="50" cy="88" r="5"/><circle cx="30" cy="88" r="3"/><circle cx="70" cy="88" r="3"/></g></svg>`;

  const css = `
  .im-capa{position:fixed;inset:0;z-index:9999;overflow:hidden;cursor:pointer;
    background:radial-gradient(ellipse at 50% 42%,#3E1650 0%,#1D0927 58%,#0D0412 100%);
    animation:im-entra .35s ease-out both}
  .im-capa.sale{animation:im-sale .8s ease-in forwards}
  @keyframes im-entra{from{opacity:0}to{opacity:1}}
  @keyframes im-sale{to{opacity:0;transform:scale(1.06)}}
  .im-estrellas{position:absolute;inset:0;background-image:radial-gradient(2px 2px at 12% 18%,#fff8 50%,transparent),radial-gradient(1.5px 1.5px at 78% 12%,#fff7 50%,transparent),radial-gradient(2px 2px at 64% 30%,#fff6 50%,transparent),radial-gradient(1.5px 1.5px at 30% 8%,#fff8 50%,transparent),radial-gradient(1.5px 1.5px at 90% 40%,#fff5 50%,transparent),radial-gradient(2px 2px at 6% 46%,#fff5 50%,transparent);animation:im-titila 2.4s ease-in-out infinite alternate}
  @keyframes im-titila{to{opacity:.4}}
  .im-cordel{position:absolute;top:0;left:-2%;right:-2%;display:flex;justify-content:space-between;padding-top:6px;transform-origin:top;animation:im-cordel 1s cubic-bezier(.3,1.6,.5,1) .15s both}
  .im-cordel::before{content:"";position:absolute;top:6px;left:0;right:0;height:3px;background:#E9D9B5;opacity:.8}
  .im-bandera{width:clamp(46px,8vw,96px);height:auto;transform-origin:top center;animation:im-mece 2.2s ease-in-out infinite alternate;filter:drop-shadow(0 4px 6px #0006)}
  .im-bandera:nth-child(odd){animation-delay:-1.1s}
  @keyframes im-cordel{from{transform:translateY(-140%)}to{transform:none}}
  @keyframes im-mece{from{transform:rotate(-6deg)}to{transform:rotate(6deg)}}
  .im-escena{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(6px,1.6vh,18px);padding:12vh 16px 16vh}
  .im-cae{width:min(80vw,46vh,400px);animation:im-cae 1.05s cubic-bezier(.55,0,1,.45) .35s both}
  @keyframes im-cae{from{transform:translateY(-130vh) rotate(-14deg)}to{transform:none}}
  .im-golpe{transform-origin:50% 100%;animation:im-golpe .75s ease-out 1.4s both}
  @keyframes im-golpe{0%{transform:scale(1.18,.78)}28%{transform:translateY(-9%) scale(.94,1.07)}55%{transform:scale(1.05,.95)}78%{transform:translateY(-2%)}100%{transform:none}}
  .im-baila{animation:im-baila 1.6s ease-in-out 2.15s infinite alternate}
  @keyframes im-baila{from{transform:rotate(-5deg)}to{transform:rotate(5deg)}}
  .im-svg{display:block;width:100%;height:auto;filter:drop-shadow(0 0 28px #F28C1B66) drop-shadow(0 18px 24px #0009)}
  .im-mandibula{transform-box:fill-box;transform-origin:50% 0;animation:im-castanea .22s ease-in-out 1.6s 14 alternate}
  @keyframes im-castanea{from{transform:none}to{transform:translateY(13px) rotate(1.5deg)}}
  .im-brillo{animation:im-brilla 1s ease-in-out 1.5s infinite alternate}
  @keyframes im-brilla{from{opacity:.35}to{opacity:1}}
  .im-temblor{animation:im-tiembla .38s linear 1.4s}
  @keyframes im-tiembla{0%,100%{transform:none}20%{transform:translate(-10px,6px)}40%{transform:translate(9px,-7px)}60%{transform:translate(-6px,4px)}80%{transform:translate(4px,-2px)}}
  .im-titulo{margin:0;font-family:'Fraunces',Georgia,serif;font-weight:700;font-size:clamp(2.4rem,9vw,5.6rem);line-height:1;text-align:center;letter-spacing:.01em;
    color:#FFD23F;text-shadow:0 3px 0 #D6336C,0 6px 0 #7B2D8E,0 0 30px #F28C1B99}
  .im-titulo span{display:inline-block;opacity:0;transform:translateY(40px) scale(.3) rotate(-12deg);animation:im-letra .55s cubic-bezier(.3,1.7,.5,1) both}
  @keyframes im-letra{to{opacity:1;transform:none}}
  .im-sub{margin:0;font-family:'Public Sans',system-ui,sans-serif;font-size:clamp(.95rem,2.6vw,1.3rem);color:#FFF4D6;letter-spacing:.08em;text-align:center;opacity:0;animation:im-entra .8s ease-out 2.9s forwards}
  .im-sub b{color:#F28C1B;font-weight:700}
  .im-altar{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:center;align-items:flex-end;gap:clamp(18px,5vw,64px);padding-bottom:3vh;opacity:0;animation:im-entra .7s ease-out 1.9s forwards}
  .im-vela{position:relative;width:clamp(16px,2.6vw,26px);height:clamp(34px,6vh,64px);border-radius:4px 4px 2px 2px;background:linear-gradient(90deg,#E9D9B5,#FFF8EC 40%,#D9C49A)}
  .im-vela:nth-child(even){height:clamp(26px,4.4vh,48px)}
  .im-vela::before{content:"";position:absolute;left:50%;bottom:100%;width:70%;height:clamp(14px,2.4vh,24px);transform:translateX(-50%);border-radius:50% 50% 45% 45%/60% 60% 40% 40%;
    background:radial-gradient(ellipse at 50% 70%,#FFF7C2 0%,#FFD23F 35%,#F28C1B 70%,transparent 72%);filter:blur(.4px);animation:im-llama .18s ease-in-out infinite alternate;transform-origin:50% 100%}
  .im-vela::after{content:"";position:absolute;left:50%;bottom:60%;width:clamp(60px,9vw,110px);aspect-ratio:1;border-radius:50%;transform:translateX(-50%);background:radial-gradient(circle,#F28C1B38,transparent 68%);pointer-events:none}
  @keyframes im-llama{from{transform:translateX(-50%) scale(1,1) rotate(-2deg)}to{transform:translateX(-50%) scale(.9,1.12) rotate(2deg)}}
  .im-flor{position:absolute;font-size:clamp(20px,3vw,34px);line-height:1}
  .im-petalo{position:absolute;width:11px;height:17px;border-radius:60% 60% 50% 50%;pointer-events:none}
  .im-saltar{position:absolute;top:calc(12px + clamp(46px,8vw,96px));right:14px;z-index:2;border:1px solid #FFF4D655;background:#0006;color:#FFF4D6;border-radius:999px;padding:8px 16px;font:600 .9rem 'Public Sans',system-ui,sans-serif;cursor:pointer}
  .im-saltar:hover{background:#000a}
  `;

  function arrancar() {
    const est = document.createElement('style'); est.textContent = css; document.head.appendChild(est);
    const capa = document.createElement('div');
    capa.className = 'im-capa'; capa.setAttribute('role', 'dialog'); capa.setAttribute('aria-label', 'Día de Muertos');
    const titulo = 'Día de Muertos';
    capa.innerHTML = `<div class="im-estrellas"></div>
      <div class="im-cordel">${Array.from({ length: 11 }, (_, i) => banderita(COLORES[i % COLORES.length])).join('')}</div>
      <button type="button" class="im-saltar">Saltar ✕</button>
      <div class="im-escena im-temblor">
        <div class="im-cae"><div class="im-golpe"><div class="im-baila">${CALAVERA}</div></div></div>
        <h1 class="im-titulo">${[...titulo].map((ch, i) => ch === ' ' ? ' ' : `<span style="animation-delay:${(1.75 + i * .07).toFixed(2)}s">${ch}</span>`).join('')}</h1>
        <p class="im-sub"><b>Recordar es volver a vivir</b> · Aula Virtual</p>
      </div>
      <div class="im-altar">${Array.from({ length: 7 }, () => '<span class="im-vela"></span>').join('')}</div>`;
    document.body.appendChild(capa);
    document.documentElement.style.overflow = 'hidden';

    // Pétalos de cempasúchil que saltan cuando la calavera cae (¡tuc!) y luego llueven.
    const petalos = (n, desdeCentro) => {
      if (!capa.animate) return;
      const r = capa.getBoundingClientRect(), cx = r.width / 2, cy = r.height * .52;
      for (let i = 0; i < n; i++) {
        const p = document.createElement('span');
        p.className = 'im-petalo';
        p.style.background = ['#F28C1B', '#FFB020', '#FFD23F', '#E8590C', '#D6336C'][i % 5];
        capa.appendChild(p);
        const x0 = desdeCentro ? cx + (Math.random() - .5) * 120 : Math.random() * r.width;
        const y0 = desdeCentro ? cy : -30;
        const ang = Math.random() * Math.PI * 2, vel = 180 + Math.random() * 320;
        const x1 = desdeCentro ? x0 + Math.cos(ang) * vel : x0 + (Math.random() - .5) * 160;
        const y1 = desdeCentro ? y0 + Math.sin(ang) * vel * .7 - 120 : r.height * (.5 + Math.random() * .6);
        const dur = desdeCentro ? 1400 + Math.random() * 900 : 2600 + Math.random() * 2200;
        p.animate([
          { transform: `translate(${x0}px,${y0}px) rotate(0deg)`, opacity: 1 },
          { transform: `translate(${x1}px,${y1}px) rotate(${(Math.random() * 720 - 360) | 0}deg)`, opacity: desdeCentro ? .9 : 1, offset: .6 },
          { transform: `translate(${x1 + (Math.random() - .5) * 60}px,${y1 + 260}px) rotate(${(Math.random() * 900) | 0}deg)`, opacity: 0 },
        ], { duration: dur, easing: 'cubic-bezier(.2,.7,.4,1)', delay: desdeCentro ? 0 : Math.random() * 1500, fill: 'both' }).onfinish = () => p.remove();
      }
    };
    const t = [];
    t.push(setTimeout(() => petalos(46, true), 1400));
    t.push(setTimeout(() => petalos(36, false), 2000));

    // Un «¡tuc!» si el navegador permite sonido (si no, en silencio).
    t.push(setTimeout(() => {
      try {
        const A = window.AudioContext || window.webkitAudioContext; if (!A) return;
        const ac = new A(); if (ac.state !== 'running') { ac.close(); return; }
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(150, ac.currentTime); o.frequency.exponentialRampToValueAtTime(48, ac.currentTime + .22);
        g.gain.setValueAtTime(.55, ac.currentTime); g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + .3);
        o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + .32); setTimeout(() => ac.close(), 600);
      } catch (e) { /* sin sonido */ }
    }, 1400));

    let cerrado = false;
    const cerrar = () => {
      if (cerrado) return; cerrado = true; t.forEach(clearTimeout);
      capa.classList.add('sale');
      setTimeout(() => { capa.remove(); est.remove(); document.documentElement.style.overflow = ''; document.removeEventListener('keydown', tecla); }, 800);
    };
    const tecla = e => { if (e.key === 'Escape') cerrar(); };
    capa.addEventListener('click', cerrar);
    document.addEventListener('keydown', tecla);
    t.push(setTimeout(cerrar, 6200));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
