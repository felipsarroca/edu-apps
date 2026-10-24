import { ETAPES, RUTA_TRINIDAD, TORDESILLAS, ANTIMERIDIA } from './dades/etapes.js';
import { desplega, suavitza, acumulades, puntA, suau, redueixMoviment, escapa } from './util.js';

const L = window.L;

const VAIXELL_SVG = `
<svg viewBox="0 0 64 56" aria-hidden="true">
  <path class="v-vela" d="M30 6 C38 10 40 20 38 30 L30 30 Z"/>
  <path class="v-vela" d="M30 10 C24 14 22 22 23 30 L30 30 Z"/>
  <path class="v-vela" d="M44 14 C50 18 51 25 49 31 L44 31 Z"/>
  <path class="v-vela" d="M16 16 C12 20 12 26 13 31 L17 31 Z"/>
  <path class="v-pal" d="M30 3 V34 M44 11 V34 M17 13 V34"/>
  <path class="v-bandera" d="M30 3 L37 5 L30 7 Z"/>
  <path class="v-buc" d="M6 34 H58 L52 46 Q32 50 12 46 Z"/>
  <path class="v-onada" d="M2 50 Q8 47 14 50 T26 50 T38 50 T50 50 T62 50"/>
</svg>`;

/** Calcula, un sol cop, la posició contínua de cada etapa i el traç que hi porta. */
function preparaGeometria() {
  const pos = [];
  const trams = [];
  ETAPES.forEach((e, i) => {
    if (i === 0) {
      pos.push(e.pos);
      trams.push([]);
    } else if (e.epileg) {
      pos.push(pos[i - 1]);
      trams.push([]);
    } else {
      const cru = desplega([pos[i - 1], ...(e.ruta || []), e.pos], pos[i - 1][1]);
      pos.push(cru[cru.length - 1]);
      trams.push(suavitza(cru));
    }
  });
  const tidore = pos[ETAPES.findIndex((e) => e.id === 'tidore')];
  const trinidad = suavitza(desplega(RUTA_TRINIDAD, tidore[1]));
  return { pos, trams, trinidad };
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
    minZoom: 1.5,
    maxZoom: 9,
    zoomSnap: 0.25,
    zoomDelta: 0.5,
    worldCopyJump: false,
    center: ETAPES[0].pos,
    zoom: 4,
  });
  L.control.zoom({ position: 'bottomleft', zoomInTitle: 'Apropa', zoomOutTitle: 'Allunya' }).addTo(map);
  map.attributionControl.setPosition('bottomleft');
  map.attributionControl.setPrefix('<a href="https://leafletjs.com" target="_blank" rel="noopener noreferrer">Leaflet</a>');

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
    maxNativeZoom: 8,
    maxZoom: 9,
    attribution: 'Mapa &copy; <a href="https://www.esri.com" target="_blank" rel="noopener noreferrer">Esri</a>, US National Park Service',
  }).addTo(map);

  const { pos, trams, trinidad } = preparaGeometria();

  // Línies de Tordesillas: la de l'Atlàntic (a les dues còpies del món que recorre la ruta) i el seu antimeridià.
  const linia = (lng, esquerra, dreta) => {
    L.polyline([[-78, lng], [82, lng]], { className: 'tordesillas', interactive: false }).addTo(map);
    L.marker([52, lng], {
      interactive: false,
      icon: L.divIcon({
        className: 'etiqueta-tordesillas',
        html: `<span class="t-esq">◂ ${esquerra}</span><span class="t-nom">Tordesillas</span><span class="t-dre">${dreta} ▸</span>`,
        iconSize: [0, 0],
      }),
    }).addTo(map);
  };
  linia(TORDESILLAS, 'Castella', 'Portugal');
  linia(TORDESILLAS - 360, 'Castella', 'Portugal');
  linia(ANTIMERIDIA - 360, 'Portugal', 'Castella');

  const etiquetaMar = (latlng, text) => L.marker(latlng, {
    interactive: false,
    icon: L.divIcon({ className: 'etiqueta-mar', html: `<span>${text}</span>`, iconSize: [0, 0] }),
  }).addTo(map);
  etiquetaMar([-38, -22], 'Mar Oceà');
  etiquetaMar([-14, -390], 'Mar Oceà');
  etiquetaMar([16, -140], 'Mar Pacífic');
  etiquetaMar([-12, -296], 'Oceà Índic');

  const totaRuta = trams.flat();
  L.polyline(totaRuta, { className: 'ruta-futura', interactive: false }).addTo(map);
  const rutaTrinidad = L.polyline(trinidad, { className: 'ruta-trinidad', interactive: false });
  const vora = L.polyline([], { className: 'ruta-vora', interactive: false }).addTo(map);
  const feta = L.polyline([], { className: 'ruta-feta', interactive: false }).addTo(map);

  const marcadors = ETAPES.map((e, i) => {
    if (e.epileg) return null;
    const m = L.marker(pos[i], {
      title: `${i + 1}. ${e.lloc}`,
      keyboard: false,
      icon: L.divIcon({
        className: 'marca-etapa',
        html: `<span>${i + 1}</span>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
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
    icon: L.divIcon({ className: 'vaixell', html: `<div class="vaixell-cos">${VAIXELL_SVG}</div>`, iconSize: [56, 50], iconAnchor: [28, 66] }),
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
      el.classList.toggle('visitada', i < index);
      el.classList.toggle('actual', i === index);
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
      limits = L.latLngBounds(totaRuta.concat(trinidad));
    } else if (trams[index].length > 1) {
      limits = L.latLngBounds(trams[index]);
    } else {
      const [lat, lng] = pos[index];
      limits = L.latLngBounds([[lat - 4, lng - 6], [lat + 4, lng + 6]]);
    }
    const opcions = { ...opcionsPadding(), maxZoom: e.epileg ? 3 : 7 };
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
    if (ETAPES[index].epileg) rutaTrinidad.addTo(map);
    else rutaTrinidad.remove();
    return enquadra(index, animat);
  }

  /** Anima el viatge de l'etapa index-1 a index. onProgres rep la fracció recorreguda. */
  async function viatja(index, onProgres = () => {}) {
    const tram = trams[index];
    if (tram.length < 2 || redueixMoviment()) {
      onProgres(1);
      return mostra(index);
    }
    const base = rutaFins(index - 1);
    rutaTrinidad.remove();
    marcaEstat(index - 1);
    await enquadra(index);

    const acc = acumulades(tram);
    const durada = Math.min(6500, Math.max(1400, 900 + acc[acc.length - 1] * 45));
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
  }

  return { map, mostra, viatja, enquadra };
}
