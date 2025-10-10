document.addEventListener('DOMContentLoaded', () => {
    // Variables globals
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    const functionInput = document.getElementById('functionInput');
    const functionsList = document.getElementById('functionsList');

    let functions = [];
    let colors = ['#667eea', '#f093fb', '#4ecdc4', '#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'];
    let colorIndex = 0;

    // Configuració de Chart.js amb les correccions
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
                    grid: {
                        color: '#f0f0f0',
                        borderColor: '#666', // Color de la línia de l'eix X
                        borderWidth: 2      // Gruix de la línia de l'eix X
                    }
                },
                y: {
                    type: 'linear', // Aquesta línia faltava i era la causa probable de l'error
                    position: 'left',
                    grid: {
                        color: '#f0f0f0',
                        borderColor: '#666', // Color de la línia de l'eix Y
                        borderWidth: 2      // Gruix de la línia de l'eix Y
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
                    radius: 0
                }
            }
        }
    };

    const graphChart = new Chart(ctx, chartConfig);

    function generateDataForExpression(expression, range) {
        const compiled = math.compile(expression);
        const data = [];
        const { min, max } = range;
        const step = (max - min) / 200;

        for (let x = min; x <= max; x += step) {
            try {
                const y = compiled.evaluate({ x: x });
                if (isFinite(y)) {
                    data.push({ x: x, y: y });
                } else {
                    data.push({ x: x, y: null });
                }
            } catch (e) {
                data.push({ x: x, y: null });
            }
        }
        return data;
    }

    window.addFunction = function() {
        const expression = functionInput.value.trim();
        if (!expression) {
            alert('Si us plau, introdueix una funció!');
            return;
        }

        try {
            math.compile(expression).evaluate({ x: 1 });

            const isFirstFunction = functions.length === 0;
            let range;

            if (isFirstFunction) {
                range = { min: -10, max: 10 };
            } else {
                range = { min: graphChart.scales.x.min, max: graphChart.scales.x.max };
            }

            const newColor = colors[colorIndex % colors.length];
            const newFunctionDataset = {
                label: `y = ${expression}`,
                data: generateDataForExpression(expression, range),
                borderColor: newColor,
                borderWidth: 2.5,
                tension: 0.1
            };

            functions.push({ expression: expression, color: newColor });
            graphChart.data.datasets.push(newFunctionDataset);
            
            if (isFirstFunction) {
                graphChart.update();
            } else {
                graphChart.update('none');
            }

            colorIndex++;
            updateFunctionsList();
            functionInput.value = '';

        } catch (e) {
            alert('Error en la funció! Comprova la sintaxis.\n\nExemples vàlids:\n- x^2\n- sin(x)\n- 2*x + 3');
        }
    }

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

    window.deleteFunction = function(index) {
        functions.splice(index, 1);
        graphChart.data.datasets.splice(index, 1);
        graphChart.update('none');
        updateFunctionsList();
    }

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

    window.setExample = function(expression) {
        functionInput.value = expression;
        functionInput.focus();
    }

    functionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addFunction();
        }
    });

    function regenerateAllDatasets() {
        const range = { min: graphChart.scales.x.min, max: graphChart.scales.x.max };
        graphChart.data.datasets.forEach((dataset, index) => {
            const expression = functions[index].expression;
            dataset.data = generateDataForExpression(expression, range);
        });
        graphChart.update('none');
    }

    let debounceTimeout;
    const onZoomPanComplete = () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(regenerateAllDatasets, 250);
    };

    graphChart.options.plugins.zoom.zoom.onZoomComplete = onZoomPanComplete;
    graphChart.options.plugins.zoom.pan.onPanComplete = onZoomPanComplete;
});