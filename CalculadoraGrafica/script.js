// Variables globals
        const canvas = document.getElementById('graphCanvas');
        const ctx = canvas.getContext('2d');
        const functionInput = document.getElementById('functionInput');
        const functionsList = document.getElementById('functionsList');
        const coordinatesDisplay = document.getElementById('coordinates');

        let functions = [];
        let colors = ['#667eea', '#f093fb', '#4ecdc4', '#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'];
        let colorIndex = 0;

        // Paràmetres del gràfic
        let scale = 40; // píxels per unitat
        let offsetX = 0;
        let offsetY = 0;
        let isDragging = false;
        let lastMouseX = 0;
        let lastMouseY = 0;

        // Inicialitzar canvas
        function initCanvas() {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            drawGraph();
        }

        // Dibuixar el gràfic complet
        function drawGraph() {
            const width = canvas.width / window.devicePixelRatio;
            const height = canvas.height / window.devicePixelRatio;

            // Fons
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);

            // Dibuixar quadrícula
            drawGrid(width, height);

            // Dibuixar eixos
            drawAxes(width, height);

            // Dibuixar funcions
            functions.forEach(func => {
                drawFunction(func, width, height);
            });
        }

        // Dibuixar quadrícula
        function drawGrid(width, height) {
            ctx.strokeStyle = '#f0f0f0';
            ctx.lineWidth = 1;

            const centerX = width / 2 + offsetX;
            const centerY = height / 2 + offsetY;

            // Línies verticals
            for (let x = centerX % scale; x < width; x += scale) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // Línies horitzontals
            for (let y = centerY % scale; y < height; y += scale) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
        }

        // Dibuixar eixos
        function drawAxes(width, height) {
            const centerX = width / 2 + offsetX;
            const centerY = height / 2 + offsetY;

            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;

            // Eix X
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(width, centerY);
            ctx.stroke();

            // Eix Y
            ctx.beginPath();
            ctx.moveTo(centerX, 0);
            ctx.lineTo(centerX, height);
            ctx.stroke();

            // Etiquetes
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';

            // Etiquetes eix X
            for (let i = -20; i <= 20; i++) {
                if (i === 0) continue;
                const x = centerX + i * scale;
                if (x >= 0 && x <= width) {
                    ctx.fillText(i.toString(), x, centerY + 15);
                    ctx.fillRect(x - 1, centerY - 5, 2, 10);
                }
            }

            // Etiquetes eix Y
            ctx.textAlign = 'right';
            for (let i = -20; i <= 20; i++) {
                if (i === 0) continue;
                const y = centerY - i * scale;
                if (y >= 0 && y <= height) {
                    ctx.fillText(i.toString(), centerX - 10, y + 4);
                    ctx.fillRect(centerX - 5, y - 1, 10, 2);
                }
            }

            // Origen
            ctx.textAlign = 'right';
            ctx.fillText('0', centerX - 10, centerY + 15);
        }

        // Dibuixar una funció
        function drawFunction(func, width, height) {
            const centerX = width / 2 + offsetX;
            const centerY = height / 2 + offsetY;

            ctx.strokeStyle = func.color;
            ctx.lineWidth = 3;
            ctx.beginPath();

            let firstPoint = true;
            const step = 1; // píxels

            for (let px = 0; px < width; px += step) {
                const x = (px - centerX) / scale;
                
                try {
                    const y = func.evaluate(x);
                    
                    if (isFinite(y)) {
                        const py = centerY - y * scale;
                        
                        if (firstPoint) {
                            ctx.moveTo(px, py);
                            firstPoint = false;
                        } else {
                            ctx.lineTo(px, py);
                        }
                    } else {
                        firstPoint = true;
                    }
                } catch (e) {
                    firstPoint = true;
                }
            }

            ctx.stroke();
        }

        // Afegir una funció
        function addFunction() {
            const expression = functionInput.value.trim();
            
            if (!expression) {
                alert('Si us plau, introdueix una funció!');
                return;
            }

            try {
                // Compilar l'expressió amb math.js
                const compiled = math.compile(expression);
                
                // Provar l'avaluació
                const testValue = compiled.evaluate({ x: 1 });
                
                const func = {
                    expression: expression,
                    color: colors[colorIndex % colors.length],
                    evaluate: (x) => compiled.evaluate({ x: x })
                };

                functions.push(func);
                colorIndex++;

                updateFunctionsList();
                drawGraph();
                functionInput.value = '';
                
            } catch (e) {
                alert('Error en la funció! Comprova la sintaxis.\n\nExemples vàlids:\n- x^2\n- sin(x)\n- 2*x + 3\n- log(x)');
            }
        }

        // Actualitzar la llista de funcions
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
        function deleteFunction(index) {
            functions.splice(index, 1);
            updateFunctionsList();
            drawGraph();
        }

        // Netejar tot
        function clearAll() {
            if (functions.length === 0) return;
            
            if (confirm('Segur que vols eliminar totes les funcions?')) {
                functions = [];
                updateFunctionsList();
                drawGraph();
            }
        }

        // Establir exemple
        function setExample(expression) {
            functionInput.value = expression;
            functionInput.focus();
        }

        // Zoom amb roda del ratolí
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            const newScale = scale * zoomFactor;
            
            if (newScale >= 5 && newScale <= 200) {
                scale = newScale;
                drawGraph();
            }
        });

        // Panoràmica amb arrossegar
        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            canvas.style.cursor = 'grabbing';
        });

        canvas.addEventListener('mousemove', (e) => {
            // Mostrar coordenades
            const rect = canvas.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            const centerX = width / 2 + offsetX;
            const centerY = height / 2 + offsetY;
            
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const x = (mouseX - centerX) / scale;
            const y = -(mouseY - centerY) / scale;
            
            coordinatesDisplay.textContent = `x: ${x.toFixed(2)}, y: ${y.toFixed(2)}`;

            // Arrossegar
            if (isDragging) {
                const dx = e.clientX - lastMouseX;
                const dy = e.clientY - lastMouseY;
                
                offsetX += dx;
                offsetY += dy;
                
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
                
                drawGraph();
            }
        });

        canvas.addEventListener('mouseup', () => {
            isDragging = false;
            canvas.style.cursor = 'crosshair';
        });

        canvas.addEventListener('mouseleave', () => {
            isDragging = false;
            canvas.style.cursor = 'crosshair';
        });

        // Enter per afegir funció
        functionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addFunction();
            }
        });

        // Redimensionar canvas
        window.addEventListener('resize', () => {
            initCanvas();
        });

        // Inicialitzar
        initCanvas();
