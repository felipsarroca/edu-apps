document.addEventListener('DOMContentLoaded', () => {
    const apps = [
        // Història
        { 
            name: "La Conquesta d'Amèrica", 
            path: 'ConquestaAmerica/', 
            category: 'Història', 
            description: "Un recorregut interactiu per les expedicions dels conqueridors." 
        },
        { 
            name: "Els Viatges de Colom", 
            path: 'ViatgesColom/', 
            category: 'Història', 
            description: "Explora els quatre viatges de Cristòfor Colom al Nou Món." 
        },
        { 
            name: "El Viatge d'Ulisses", 
            path: 'Ulisses/', 
            category: 'Història', 
            description: "Una adaptació senzilla de l'Odissea d'Homer." 
        },
        { 
            name: "La Volta al Món", 
            path: 'voltaalmon/', 
            category: 'Història', 
            description: "Segueix la primera circumnavegació de la història." 
        },

        // Química
        { 
            name: "Configuració Electrònica", 
            path: 'ConfiguracioElectronica/', 
            category: 'Química', 
            description: "Aprèn a distribuir els electrons en els orbitals atòmics." 
        },
        { 
            name: "Configuració Electrònica 2", 
            path: 'ConfiguracioElectronica2/', 
            category: 'Química', 
            description: "Versió millorada per practicar la configuració electrònica." 
        },
        { 
            name: "Quiz de la Taula Periòdica", 
            path: 'QuizTaulaPeriodica/', 
            category: 'Química', 
            description: "Posa a prova els teus coneixements sobre els elements." 
        },
        { 
            name: "Taula Periòdica Dinàmica", 
            path: 'TaulaPeriodicaDinamica/', 
            category: 'Química', 
            description: "Una taula periòdica interactiva amb múltiples visualitzacions." 
        },
        { 
            name: "Igualació d'Equacions Químiques", 
            path: 'IgualacioQuimica/', 
            category: 'Química', 
            description: "Una eina per igualar equacions químiques pas a pas." 
        },

        // Matemàtiques
        { 
            name: "GraphMath", 
            path: 'GraphMath/', 
            category: 'Matemàtiques', 
            description: "Eina per a representar gràficament funcions matemàtiques." 
        },
        { 
            name: "CombinApp", 
            path: 'CombinApp/', 
            category: 'Matemàtiques', 
            description: "Calculadora guiada de permutacions, variacions i combinacions amb problemes resolts pas a pas.", 
            icon: 'CombinApp/favicon.svg'
        },
        { 
            name: "Calculadora de MCD i mcm", 
            path: 'MCD-mcm/', 
            category: 'Matemàtiques', 
            description: "Calcula el MCD i mcm de forma guiada, amb exercicis i problemes.",
            icon: 'MCD-mcm/assets/logo.svg'
        },

        // Física
        {
            name: "KineGraphIA",
            path: 'https://ja.cat/kinegraphia',
            category: 'Física',
            description: "Analitza amb IA l'enunciat d'un problema de cinemàtica i genera gràfiques, dades i resultats de manera automàtica",
            icon: 'KineGraphIA/favicon.svg'
        },
        {
            name: "KineGraph",
            path: 'KineGraph/',
            category: 'Física',
            description: "Simulador interactiu per graficar funcions de cinemàtica. També té un repositori de problemes-mostra.",
            icon: 'KineGraph/favicon.svg'
        },

        // Economia i Emprenedoria
        { 
            name: "Joc de Cooperatives", 
            path: 'Joc-Cooperatives/', 
            category: 'Economia i Emprenedoria', 
            description: "Un joc per entendre el funcionament de les cooperatives." 
        },

        // Altres
        { 
            name: "Joc 4x15 amb IA", 
            path: '4x15-Joc-IA/', 
            category: 'Altres', 
            description: "Joc de preguntes i respostes amb un component d'IA." 
        },
        { 
            name: "Joc dels Marcs d'integració de la IA a l'aula", 
            path: 'Joc-Marc-IA/', 
            category: 'Altres', 
            description: "Joc amb situacions per esbrinar el grau d'ús que es fa de la IA en diferents activitats escolars" 
        },
        { 
            name: "Scape Room a l'ermita de Ca n'Anglada", 
            path: 'ScapeRoomErmita/', 
            category: 'Altres', 
            description: "Resol els enigmes per trobar la relíquia amagada." 
        }
    ];

    const mainContainer = document.getElementById('apps-container');
    if (!mainContainer) return;

    // Agrupa les aplicacions per categoria
    const appsByCategory = apps.reduce((acc, app) => {
        if (!acc[app.category]) {
            acc[app.category] = [];
        }
        acc[app.category].push(app);
        return acc;
    }, {});

    // Ordena les categories alfabèticament, però posa "Altres" al final
    const sortedCategories = Object.keys(appsByCategory).sort((a, b) => {
        if (a === 'Altres') return 1;
        if (b === 'Altres') return -1;
        return a.localeCompare(b);
    });

    // Genera l'HTML per a cada categoria
    sortedCategories.forEach(category => {
        const section = document.createElement('section');
        section.className = 'category-section mb-5';

        const categoryTitle = document.createElement('h2');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = category;
        section.appendChild(categoryTitle);

        const grid = document.createElement('div');
        grid.className = 'row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4';

        appsByCategory[category].forEach(app => {
            const col = document.createElement('div');
            col.className = 'col d-flex';
            
            // Intenta trobar un favicon, si no, mostra una inicial
            const faviconSrc = app.icon || `${app.path}favicon.svg`;
            const fallbackIcon = `https://via.placeholder.com/64/3498db/ffffff?text=${app.name.charAt(0)}`;

            col.innerHTML = `
                <a href="${app.path}" class="card-link" target="_blank" rel="noopener noreferrer">
                    <div class="card h-100">
                        <img src="${faviconSrc}" class="card-img-top" alt="Icona de ${app.name}" onerror="this.onerror=null;this.src='${fallbackIcon}';">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${app.name}</h5>
                            <p class="card-text flex-grow-1">${app.description}</p>
                        </div>
                    </div>
                </a>
            `;
            grid.appendChild(col);
        });

        section.appendChild(grid);
        mainContainer.appendChild(section);
    });
});
