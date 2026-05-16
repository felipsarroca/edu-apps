/* ============================================
   DADES DEL JOC
   Cada pregunta té: transport, imatge, tema CSS,
   pregunta, opcions i índex de la resposta correcta.
   ============================================ */
const preguntes = [
    {
        transport: "TREN",
        imatge: "img/tren.png",
        tema: "tema-tren",
        pregunta: "QUANT TEMPS TRIGARÍEM A ARRIBAR A EGIPTE EN TREN? 🚂",
        opcions: ["2 HORES", "10 HORES", "3 DIES", "1 MES"],
        correcta: 2 // 3 DIES
    },
    {
        transport: "AVIÓ",
        imatge: "img/avio.png",
        tema: "tema-avio",
        pregunta: "QUANT TEMPS TRIGARÍEM A ARRIBAR A EGIPTE EN AVIÓ? ✈️",
        opcions: ["30 MINUTS", "4 HORES", "2 DIES", "1 SETMANA"],
        correcta: 1 // 4 HORES
    },
    {
        transport: "COTXE",
        imatge: "img/cotxe.png",
        tema: "tema-cotxe",
        pregunta: "QUANT TEMPS TRIGARÍEM A ARRIBAR A EGIPTE EN COTXE? 🚗",
        opcions: ["3 HORES", "1 DIA", "3 DIES", "2 SETMANES"],
        correcta: 2 // 3 DIES
    },
    {
        transport: "VAIXELL",
        imatge: "img/vaixell.png",
        tema: "tema-vaixell",
        pregunta: "QUANT TEMPS TRIGARÍEM A ARRIBAR A EGIPTE EN VAIXELL? 🚢",
        opcions: ["2 HORES", "1 DIA", "5 DIES", "1 ANY"],
        correcta: 2 // 5 DIES
    }
];

let preguntaActual = 0;

/* ============================================
   FUNCIONS PRINCIPALS
   ============================================ */

/**
 * Inicia el joc des de la primera pregunta
 */
function comencarJoc() {
    preguntaActual = 0;
    canviarPantalla('pantalla-inici', 'pantalla-pregunta');
    mostrarPregunta();
}

/**
 * Reinicia el joc (torna a la pantalla d'inici)
 */
function reiniciar() {
    preguntaActual = 0;
    aturaConfeti();
    canviarPantalla('pantalla-final', 'pantalla-inici');
}

/**
 * Mostra la pregunta actual a la pantalla
 */
function mostrarPregunta() {
    const p = preguntes[preguntaActual];
    const pantallaPreg = document.getElementById('pantalla-pregunta');

    // Canvia el tema de colors
    pantallaPreg.className = 'pantalla activa entrant ' + p.tema;

    // Actualitza pregunta i imatge
    document.getElementById('pregunta-text').textContent = p.pregunta;
    const img = document.getElementById('imatge-transport');
    img.src = p.imatge;
    img.alt = p.transport;

    // Genera els botons d'opcions
    const container = document.getElementById('opcions-container');
    container.innerHTML = '';

    p.opcions.forEach((opcio, index) => {
        const boto = document.createElement('button');
        boto.className = 'boto-opcio';
        boto.textContent = opcio;
        boto.setAttribute('id', 'opcio-' + index);
        boto.addEventListener('click', () => comprovarResposta(index));
        // Evitar doble toc
        boto.addEventListener('touchend', (e) => {
            e.preventDefault();
            comprovarResposta(index);
        });
        container.appendChild(boto);
    });

    // Amaga feedback i botó següent
    const feedback = document.getElementById('missatge-feedback');
    feedback.textContent = '';
    feedback.className = 'missatge-feedback';

    document.getElementById('btn-seguent').classList.add('amagat');
}

/**
 * Comprova si la resposta seleccionada és correcta
 */
function comprovarResposta(index) {
    const p = preguntes[preguntaActual];
    const feedback = document.getElementById('missatge-feedback');
    const botoSeleccionat = document.getElementById('opcio-' + index);

    // Si ja està marcat (correcta o incorrecta), no fer res
    if (botoSeleccionat.classList.contains('correcta') ||
        botoSeleccionat.classList.contains('incorrecta')) {
        return;
    }

    if (index === p.correcta) {
        // ✅ RESPOSTA CORRECTA
        botoSeleccionat.classList.add('correcta');
        feedback.textContent = 'MOLT BÉ! 👏';
        feedback.className = 'missatge-feedback correcte';

        // Desactiva tots els botons
        desactivarBotons();

        // Mostra el botó "SEGÜENT"
        document.getElementById('btn-seguent').classList.remove('amagat');

    } else {
        // ❌ RESPOSTA INCORRECTA
        botoSeleccionat.classList.add('incorrecta');
        feedback.textContent = 'UI! TORNA-HO A INTENTAR 😊';
        feedback.className = 'missatge-feedback incorrecte';

        // Treu l'estil vermell després d'1 segon
        setTimeout(() => {
            botoSeleccionat.classList.remove('incorrecta');
            botoSeleccionat.classList.add('desactivat');
        }, 900);
    }
}

/**
 * Desactiva tots els botons d'opcions
 */
function desactivarBotons() {
    const botons = document.querySelectorAll('.boto-opcio');
    botons.forEach(b => {
        b.style.pointerEvents = 'none';
    });
}

/**
 * Passa a la següent pregunta o a la pantalla de resum
 */
function seguent() {
    preguntaActual++;

    if (preguntaActual < preguntes.length) {
        mostrarPregunta();
    } else {
        // Totes les preguntes fetes → pantalla de resum
        mostrarResum();
        canviarPantalla('pantalla-pregunta', 'pantalla-resum');
    }
}

/**
 * Mostra la pantalla de resum amb els 4 transports i temps
 */
function mostrarResum() {
    const container = document.getElementById('resum-container');
    container.innerHTML = '';

    preguntes.forEach(p => {
        const targeta = document.createElement('div');
        targeta.className = 'targeta-resum';

        const img = document.createElement('img');
        img.src = p.imatge;
        img.alt = p.transport;

        const info = document.createElement('div');
        info.className = 'targeta-resum-info';

        const nom = document.createElement('span');
        nom.className = 'targeta-resum-nom';
        nom.textContent = p.transport;

        const temps = document.createElement('span');
        temps.className = 'targeta-resum-temps';
        temps.textContent = p.opcions[p.correcta];

        info.appendChild(nom);
        info.appendChild(temps);
        targeta.appendChild(img);
        targeta.appendChild(info);
        container.appendChild(targeta);
    });
}

/**
 * Passa de la pantalla de resum a la pantalla final
 */
function anarFinal() {
    canviarPantalla('pantalla-resum', 'pantalla-final');
    iniciarConfeti();
}

/* ============================================
   CANVI DE PANTALLA
   ============================================ */
function canviarPantalla(deId, aId) {
    const de = document.getElementById(deId);
    const a = document.getElementById(aId);

    de.classList.remove('activa', 'entrant');
    de.style.display = 'none';

    a.style.display = 'flex';
    // Força reflow per reiniciar animació
    void a.offsetWidth;
    a.classList.add('activa', 'entrant');
}

/* ============================================
   CONFETI 🎊
   Sistema senzill de confeti amb canvas
   ============================================ */
let confetiAnimId = null;
let confetiParticules = [];

function iniciarConfeti() {
    const canvas = document.getElementById('confeti-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = [
        '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF',
        '#FF8AE2', '#A66CFF', '#FF9F45', '#00D2FF'
    ];

    // Crea partícules
    confetiParticules = [];
    for (let i = 0; i < 120; i++) {
        confetiParticules.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 12 + 6,
            h: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            velocitat: Math.random() * 3 + 1.5,
            oscilacio: Math.random() * 2 - 1,
            rotacio: Math.random() * 360,
            velRotacio: Math.random() * 6 - 3
        });
    }

    function dibuixar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confetiParticules.forEach(p => {
            ctx.save();
            ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
            ctx.rotate((p.rotacio * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();

            // Mou la partícula
            p.y += p.velocitat;
            p.x += p.oscilacio;
            p.rotacio += p.velRotacio;

            // Si surt per baix, reapareix a dalt
            if (p.y > canvas.height + 20) {
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }
        });

        confetiAnimId = requestAnimationFrame(dibuixar);
    }

    dibuixar();
}

function aturaConfeti() {
    if (confetiAnimId) {
        cancelAnimationFrame(confetiAnimId);
        confetiAnimId = null;
    }
    const canvas = document.getElementById('confeti-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Redimensionar canvas del confeti si canvia la mida de la finestra
window.addEventListener('resize', () => {
    const canvas = document.getElementById('confeti-canvas');
    if (canvas && confetiAnimId) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
