document.addEventListener('DOMContentLoaded', () => {
    // Variables globals
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    const functionInput = document.getElementById('functionInput');
    const functionsList = document.getElementById('functionsList');

    let functions = [];
    let colors = ['#667eea', '#f093fb', '#4ecdc4', '#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'];
    let colorIndex = 0;

    // Configuració inicial de Chart.js
    const chartConfig = {
        type: 'line',
        data: {
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'x'
                    },
                    grid: {
                        color: '#f0f0f0'
                    }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'y'
                    },
                    grid: {
                        color: '#f0f0f0'
                    }
                }
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    },
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                }
            },
            elements: {
                point: {
                    radius: 0 // No mostrar punts per a cada valor
                }
            }
        }
    };

    // Crear el gràfic
    const graphChart = new Chart(ctx, chartConfig);

    // Funció per generar dades per a una expressió
    function generateDataForExpression(expression) {
        const compiled = math.compile(expression);
        const data = [];
        // Obtenir el rang visible actual del gràfic
        const { min, max } = graphChart.scales.x;
        const step = (max - min) / 200; // 200 punts per a una línia suau

        for (let x = min; x <= max; x += step) {
            try {
                const y = compiled.evaluate({ x: x });
                if (isFinite(y)) {
                    data.push({ x: x, y: y });
                } else {
                    // Per a discontinuïtats, Chart.js pot gestionar 'null'
                    data.push({ x: x, y: null });
                }
            } catch (e) {
                data.push({ x: x, y: null });
            }
        }
        return data;
    }

    // Afegir una funció
    window.addFunction = function() {
        const expression = functionInput.value.trim();
        if (!expression) {
            alert('Si us plau, introdueix una funció!');
            return;
        }

        try {
            // Prova de compilació
            math.compile(expression).evaluate({ x: 1 });

            const newColor = colors[colorIndex % colors.length];
            const newFunction = {
                label: `y = ${expression}`,
                data: generateDataForExpression(expression),
                borderColor: newColor,
                borderWidth: 2.5,
                tension: 0.1
            };

            functions.push({ expression: expression, color: newColor });
            graphChart.data.datasets.push(newFunction);
            graphChart.update('none'); // 'none' per a una actualització sense animació

            colorIndex++;
            updateFunctionsList();
            functionInput.value = '';

        } catch (e) {
            alert('Error en la funció! Comprova la sintaxis.\n\nExemples vàlids:\n- x^2\n- sin(x)\n- 2*x + 3');
        }
    }

    // Actualitzar la llista de funcions a la UI
    function updateFunctionsList() {
        if (functions.length === 0) {
            functionsList.innerHTML = '<div class="empty-state">No hi ha funcions encara. Afegeix-ne una!</div>';
            return;
        }

        functionsList.innerHTML = functions.map((func, index) => `
            <div class="function-item">
                <div class="color-indicator" style="background: ${func.color};
"></div>
                <div class="function-text">y = ${func.expression}</div>
                <button class="delete-btn" onclick="deleteFunction(${index})">✕</button>
            </div>
        `).join('');
    }

    // Eliminar una funció
    window.deleteFunction = function(index) {
        functions.splice(index, 1);
        graphChart.data.datasets.splice(index, 1);
        graphChart.update('none');
        updateFunctionsList();
    }

    // Netejar tot
    window.clearAll = function() {
        if (functions.length === 0) return;
        if (confirm('Segur que vols eliminar totes les funcions?')) {
            functions = [];
            graphChart.data.datasets = [];
            graphChart.update('none');
            updateFunctionsList();
            colorIndex = 0;
        }
    }

    // Establir exemple
    window.setExample = function(expression) {
        functionInput.value = expression;
        functionInput.focus();
    }

    // Enter per afegir funció
    functionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addFunction();
        }
    });

    // Recalcular dades en fer zoom o pan
    let timeout;
    graphChart.options.plugins.zoom.zoom.onZoomComplete = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            graphChart.data.datasets.forEach((dataset, index) => {
                const expression = functions[index].expression;
                dataset.data = generateDataForExpression(expression);
            });
            graphChart.update('none');
        }, 250);
    };
    graphChart.options.plugins.zoom.pan.onPanComplete = graphChart.options.plugins.zoom.zoom.onZoomComplete;
});