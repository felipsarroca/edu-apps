import { ETAPES } from './dades/etapes.js';
import { suavitza, acumulades, puntA, suau, redueixMoviment, escapa } from './util.js';

const L = window.L;

// Nau grega: buc llarg amb esperó, ull a la proa, vela quadrada i rems.
const NAU_SVG = `
<svg viewBox="0 0 72 52" aria-hidden="true">
  <path class="v-pal" d="M34 6 V36 M20 9 H48"/>
  <path class="v-vela" d="M21 10 H47 Q49 21 46 30 H22 Q19 21 21 10 Z"/>
  <path class="v-ratlles" d="M28 10 V30 M34 10 V30 M40 10 V30"/>
  <path class="v-rems" d="M18 40 L12 48 M26 41 L21 49 M34 41 L30 49 M42 41 L39 49 M50 40 L48 48"/>
  <path class="v-buc" d="M4 34 Q8 33 12 35 H58 Q63 33 66 26 Q67 31 64 36 L60 40 Q36 44 12 41 Q6 39 4 34 Z"/>
  <circle class="v-ull" cx="58" cy="36.5" r="1.4"/>
  <path class="v-onada" d="M2 49 Q8 46 14 49 T26 49 T38 49 T50 49 T62 49 T70 49"/>
</svg>`;

/** Calcula, un sol cop, el traç que porta a cada etapa. */
function preparaGeometria() {
  const pos = ETAPES.map((e, i) => e.pos || ETAPES[i - 1].pos);
  const trams = ETAPES.map((e, i) => {
    if (i === 0 || e.epileg) return [];
    const [a, b] = [pos[i - 1], pos[i]];
    if (a[0] === b[0] && a[1] === b[1]) return [];
    return suavitza([a, ...(e.ruta || []), b]);
  });
  return { pos, trams };
}

function esperaMoviment(map, maxim = 2600) {
  return new Promise((resol) => {
    const t = setTimeout(resol, maxim);
    map.once('moveend', () => { clearTimeout(t); resol(); });
  });
}

export function creaMapa(element, { padding, onEtapa }) {
  const map = L.map(element, {
    zoomControl: false,
    minZoom: 3,
    maxZoom: 9,
    zoomSnap: 0.25,
    zoomDelta: 0.5,
    center: ETAPES[0].pos,
    zoom: 5,
    maxBounds: [[20, -15], [55, 50]],
  });
  L.control.zoom({ position: 'bottomleft', zoomInTitle: 'Apropa', zoomOutTitle: 'Allunya' }).addTo(map);
  map.attributionControl.setPosition('bottomleft');
  map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer">Leaflet</a>');

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
    maxNativeZoom: 8,
    maxZoom: 9,
    attribution: 'Mapa &copy; <a href="https://www.esri.com" target="_blank" rel="noopener noreferrer">Esri</a>, US National Park Service',
  }).addTo(map);

  const { pos, trams } = preparaGeometria();

  const etiquetaMar = (latlng, text) => L.marker(latlng, {
    interactive: false,
    keyboard: false,
    icon: L.divIcon({ className: 'etiqueta-mar', html: `<span>${text}</span>`, iconSize: [0, 0] }),
  }).addTo(map);
  etiquetaMar([38.9, 25.2], 'Mar Egeu');
  etiquetaMar([37.4, 18.7], 'Mar Jònic');
  etiquetaMar([40.0, 12.0], 'Mar Tirrè');
  etiquetaMar([34.6, 16.5], 'Mediterrani');

  const totaRuta = trams.flat();
  L.polyline(totaRuta, { className: 'ruta-futura', interactive: false }).addTo(map);
  const vora = L.polyline([], { className: 'ruta-vora', interactive: false }).addTo(map);
  const feta = L.polyline([], { className: 'ruta-feta', interactive: false }).addTo(map);

  // Etiquetes amb el temps de navegació que dona el poema, a mig tram.
  const RELLOTGE = '<svg viewBox="0 0 16 20" aria-hidden="true"><path d="M3 1.5h10M3 18.5h10M4 2c0 5 4 5.5 4 8s-4 3-4 8M12 2c0 5-4 5.5-4 8s4 3 4 8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6 16.5c.6-1.6 1.4-2.3 2-2.3s1.4.7 2 2.3z" fill="currentColor"/></svg>';
  const etiquetesDurada = ETAPES.map((e, i) => {
    if (!e.durada || trams[i].length < 2) return null;
    const { punt } = puntA(trams[i], acumulades(trams[i]), 0.5);
    return L.marker(punt, {
      interactive: false,
      keyboard: false,
      icon: L.divIcon({ className: 'dies-tram', html: `<span>${RELLOTGE}${escapa(e.durada)}</span>`, iconSize: [0, 0] }),
    });
  });
  let fins = 0;

  /** Mostra les etiquetes dels trams fets, si el tram és prou llarg en pantalla perquè no molestin. */
  function actualitzaDurades(index = fins, nou = false) {
    fins = index;
    etiquetesDurada.forEach((m, i) => {
      if (!m) return;
      const t = trams[i];
      const a = map.latLngToContainerPoint(t[0]);
      const b = map.latLngToContainerPoint(t[t.length - 1]);
      const visible = i <= index && !ETAPES[index].epileg && a.distanceTo(b) > 110;
      if (visible && !map.hasLayer(m)) {
        m.addTo(map);
        if (nou && i === index) m.getElement()?.classList.add('nou');
      } else if (!visible && map.hasLayer(m)) {
        m.remove();
      }
    });
  }
  map.on('zoomend', () => actualitzaDurades());

  // Si dues etapes comparteixen lloc, només es dibuixa el marcador de la primera.
  const marcadors = ETAPES.map((e, i) => {
    if (e.epileg || (i > 0 && trams[i].length === 0)) return null;
    const m = L.marker(pos[i], {
      title: `${i + 1}. ${e.lloc}`,
      keyboard: false,
      icon: L.divIcon({
        className: 'marca-etapa',
        html: `<span>${i + 1}</span>`,
        iconSize: [0, 0], // la mida i el centrat són al CSS, en rem
      }),
      zIndexOffset: i,
    }).addTo(map);
    m.bindTooltip(escapa(e.lloc), { direction: 'top', offset: [0, -14], className: 'tooltip-etapa' });
    m.on('click', () => onEtapa(i));
    return m;
  });

  const vaixell = L.marker(pos[0], {
    interactive: false,
    keyboard: false,
    zIndexOffset: 1000,
    icon: L.divIcon({ className: 'vaixell', html: `<div class="vaixell-cos">${NAU_SVG}</div>`, iconSize: [0, 0] }),
  }).addTo(map);

  const orientaVaixell = (deLng, aLng) => {
    const el = vaixell.getElement();
    if (el && Math.abs(aLng - deLng) > 1e-6) el.classList.toggle('oest', aLng < deLng);
  };

  const rutaFins = (index) => trams.slice(1, index + 1).flat();

  const marcaEstat = (index) => {
    marcadors.forEach((m, i) => {
      const el = m?.getElement();
      if (!el) return;
      const aqui = pos[i] === pos[index] || (pos[i][0] === pos[index][0] && pos[i][1] === pos[index][1]);
      el.classList.toggle('visitada', i < index && (!aqui || ETAPES[index].epileg));
      el.classList.toggle('actual', aqui && !ETAPES[index].epileg);
      el.classList.toggle('futura', i > index);
    });
  };

  const opcionsPadding = () => {
    const p = padding();
    return { paddingTopLeft: p.topLeft, paddingBottomRight: p.bottomRight };
  };

  /** Enquadra l'etapa: el tram que hi porta, o un entorn del punt. */
  function enquadra(index, animat = true) {
    const e = ETAPES[index];
    const dur = animat && !redueixMoviment() ? 1.1 : 0;
    let limits;
    if (e.epileg) {
      limits = L.latLngBounds(totaRuta);
    } else if (trams[index].length > 1) {
      limits = L.latLngBounds(trams[index]);
    } else {
      const [lat, lng] = pos[index];
      limits = L.latLngBounds([[lat - 1.5, lng - 2.2], [lat + 1.5, lng + 2.2]]);
    }
    const opcions = { ...opcionsPadding(), maxZoom: e.epileg ? 6 : 7.5 };
    if (dur) map.flyToBounds(limits, { ...opcions, duration: dur });
    else map.fitBounds(limits, { ...opcions, animate: false });
    return dur ? esperaMoviment(map) : Promise.resolve();
  }

  /** Mostra l'estat d'una etapa sense animar el viatge. */
  function mostra(index, animat = true) {
    const ruta = rutaFins(index);
    feta.setLatLngs(ruta);
    vora.setLatLngs(ruta);
    vaixell.setLatLng(pos[index]);
    const tram = trams[index];
    if (tram.length > 1) orientaVaixell(tram[tram.length - 2][1], tram[tram.length - 1][1]);
    marcaEstat(index);
    return enquadra(index, animat).then(() => actualitzaDurades(index));
  }

  /** Anima el viatge de l'etapa index-1 a index. onProgres rep la fracció recorreguda. */
  async function viatja(index, onProgres = () => {}) {
    const tram = trams[index];
    if (tram.length < 2 || redueixMoviment()) {
      onProgres(1);
      return mostra(index);
    }
    const base = rutaFins(index - 1);
    marcaEstat(index - 1);
    await enquadra(index);
    actualitzaDurades(index - 1);

    const acc = acumulades(tram);
    const durada = Math.min(6500, Math.max(1600, 900 + acc[acc.length - 1] * 180));
    vaixell.getElement()?.classList.add('navegant');
    await new Promise((resol) => {
      const inici = performance.now();
      let lngAnterior = tram[0][1];
      const pas = (ara) => {
        const t = Math.min(1, (ara - inici) / durada);
        const { punt, tram: k } = puntA(tram, acc, suau(t));
        const ruta = base.concat(tram.slice(0, k), [punt]);
        feta.setLatLngs(ruta);
        vora.setLatLngs(ruta);
        vaixell.setLatLng(punt);
        orientaVaixell(lngAnterior, punt[1]);
        lngAnterior = punt[1];
        onProgres(t);
        if (t < 1) requestAnimationFrame(pas);
        else resol();
      };
      requestAnimationFrame(pas);
    });
    vaixell.getElement()?.classList.remove('navegant');
    marcaEstat(index);
    actualitzaDurades(index, true);
  }

  return { map, mostra, viatja, enquadra };
}
