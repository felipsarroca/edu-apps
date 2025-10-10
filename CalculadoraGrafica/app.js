document.addEventListener('DOMContentLoaded', () => {
    // --- ESTATS I CONSTANTS ---
    const dom = {
        equationsList: document.getElementById('equations-list'),
        addEquationBtn: document.getElementById('add-equation-btn'),
        graphContainer: document.getElementById('graph-container'),
        mathKeyboard: document.getElementById('math-keyboard'),
        interpretationPanel: document.getElementById('interpretation-panel'),
    };

    let equations = [];
    let activeInput = null;
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c', '#e67e22'];

    // --- INICIALITZACIÓ ---
    function init() {
        setupGraph();
        addNewEquationRow('y = x');
        addNewEquationRow('y < x^2 - 2');
        
        dom.addEquationBtn.addEventListener('click', () => addNewEquationRow(''));
        dom.mathKeyboard.addEventListener('click', handleKeyboardClick);
        dom.equationsList.addEventListener('focusin', (e) => {
            if (e.target.classList.contains('equation-input')) {
                activeInput = e.target;
            }
        });
    }

    function setupGraph() {
        const layout = {
            margin: { t: 20, r: 20, b: 30, l: 40 },
            xaxis: { title: 'x', gridcolor: '#eee' },
            yaxis: { title: 'y', gridcolor: '#eee' },
            showlegend: false,
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: '#fff',
        };
        Plotly.newPlot(dom.graphContainer, [], layout, {responsive: true});
    }

    // --- GESTIÓ D'EQUACIONS ---
    function addNewEquationRow(initialValue = '') {
        const equationId = Date.now();
        const color = colors[equations.length % colors.length];

        const row = document.createElement('div');
        row.className = 'equation-row';
        row.dataset.id = equationId;
        row.innerHTML = `
            <div class="color-indicator" style="background-color: ${color};"></div>
            <input type="text" class="equation-input" placeholder="y = x^2 + 1">
            <button class="delete-btn">
                <svg viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>
            </button>
        `;

        const input = row.querySelector('.equation-input');
        input.value = initialValue;

        const equationData = { id: equationId, value: initialValue, color: color };
        equations.push(equationData);

        input.addEventListener('input', () => {
            equationData.value = input.value;
            updateGraph();
        });

        row.querySelector('.delete-btn').addEventListener('click', () => {
            equations = equations.filter(eq => eq.id !== equationId);
            row.remove();
            updateGraph();
        });

        dom.equationsList.appendChild(row);
        updateGraph();
    }

    // --- LÒGICA DEL GRÀFIC ---
    function updateGraph() {
        const traces = [];
        equations.forEach(eq => {
            const trace = parseEquation(eq.value, eq.color);
            if (trace) traces.push(trace);
        });
        Plotly.react(dom.graphContainer, traces);
    }

    function parseEquation(eqString, color) {
        if (!eqString.trim()) return null;

        try {
            const parts = eqString.split(/(=|<|>|<=|>=)/).map(s => s.trim());
            if (parts.length !== 3) return null; // Ha de ser [expr, op, expr]

            let [lhs, op, rhs] = parts;
            if (lhs !== 'y') return null; // De moment, només suportem 'y' a l'esquerra

            const node = math.parse(rhs);
            const compiled = node.compile();

            const xValues = [];
            const yValues = [];
            for (let x = -10; x <= 10; x += 0.2) {
                xValues.push(x);
                yValues.push(compiled.evaluate({ x: x }));
            }

            const trace = {
                x: xValues,
                y: yValues,
                mode: 'lines',
                line: { color: color, width: 2.5 },
                type: 'scatter'
            };

            if (op === '<' || op === '>') {
                trace.line.dash = 'dash';
            }

            if (op.includes('<')) {
                trace.fill = 'tozeroy'; // Omple cap avall (y=0)
            } else if (op.includes('>')) {
                trace.fill = 'tonexty'; // Omple cap amunt
            }

            return trace;

        } catch (error) {
            console.error('Error parsing equation:', error);
            return null;
        }
    }

    // --- GESTIÓ DEL TECLAT ---
    function handleKeyboardClick(e) {
        if (!e.target.classList.contains('key')) return;
        if (!activeInput) return;

        const symbol = e.target.dataset.symbol;
        const start = activeInput.selectionStart;
        const end = activeInput.selectionEnd;
        const currentValue = activeInput.value;

        const newValue = currentValue.substring(0, start) + symbol + currentValue.substring(end);
        activeInput.value = newValue;
        activeInput.focus();
        activeInput.selectionStart = activeInput.selectionEnd = start + symbol.length;
        
        // Dispara l'event 'input' per actualitzar el gràfic
        const event = new Event('input', { bubbles: true });
        activeInput.dispatchEvent(event);
    }

    // --- INICIAR L'APLICACIÓ ---
    init();
});