// Graficadora+ Application
class Graficadora {
    constructor() {
        this.canvas = document.getElementById('graphCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.equations = [];
        this.colors = ['#FF5252', '#448AFF', '#69F0AE', '#FFD740', '#FF4081', '#7C4DFF', '#18FFFF', '#FF6E40'];
        this.colorIndex = 0;
        
        // View settings
        this.scale = 50; // pixels per unit
        this.offsetX = 0; // offset in pixels
        this.offsetY = 0; // offset in pixels
        
        // Interaction state
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        this.tooltip = null;
        
        // Initialize the application
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.resizeCanvas();
        this.drawGraph();
        
        // Add sample equations
        this.addEquation('y = x^2 - 2x + 1');
        this.addEquation('y = 2x + 3');
        
        // Add tooltip
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tooltip';
        document.body.appendChild(this.tooltip);
        
        this.canvas.addEventListener('mousemove', (e) => this.showTooltip(e));
        this.canvas.addEventListener('mouseout', () => {
            this.tooltip.style.display = 'none';
        });
    }
    
    setupEventListeners() {
        // Modal functionality
        const modal = document.getElementById('addEquationModal');
        const btn = document.getElementById('addEquationBtn');
        const span = document.getElementsByClassName('close')[0];
        const submitBtn = document.getElementById('addEquationSubmit');
        
        btn.onclick = () => modal.style.display = 'block';
        span.onclick = () => modal.style.display = 'none';
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
        
        // Equation input preview
        const equationInput = document.getElementById('equationInput');
        equationInput.addEventListener('input', () => {
            const preview = document.getElementById('equationPreview');
            preview.textContent = equationInput.value;
        });
        
        // Submit equation
        submitBtn.onclick = () => {
            const equationText = equationInput.value.trim();
            const equationType = document.querySelector('input[name="equationType"]:checked').value;
            
            if (equationText) {
                this.addEquation(equationText, equationType);
                equationInput.value = '';
                document.getElementById('equationPreview').textContent = '';
                modal.style.display = 'none';
            }
        };
        
        // Zoom buttons
        document.getElementById('zoomInBtn').onclick = () => this.zoom(1.2);
        document.getElementById('zoomOutBtn').onclick = () => this.zoom(0.8);
        document.getElementById('resetViewBtn').onclick = () => this.resetView();
        
        // Theme toggle
        document.getElementById('themeToggle').onclick = () => this.toggleTheme();
        
        // Canvas interaction for panning
        this.canvas.addEventListener('mousedown', (e) => this.startDrag(e));
        this.canvas.addEventListener('mousemove', (e) => this.drag(e));
        this.canvas.addEventListener('mouseup', () => this.endDrag());
        this.canvas.addEventListener('mouseleave', () => this.endDrag());
        
        // Zoom with mouse wheel
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            if (e.deltaY < 0) {
                this.zoom(1.1, mouseX, mouseY);
            } else {
                this.zoom(0.9, mouseX, mouseY);
            }
        });
        
        // Math keyboard
        this.setupMathKeyboard();
        
        // Window resize
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    setupMathKeyboard() {
        const mathButtons = document.querySelectorAll('.math-btn');
        const equationInput = document.getElementById('equationInput');
        
        mathButtons.forEach(button => {
            button.addEventListener('click', () => {
                const value = button.getAttribute('data-value');
                
                switch(value) {
                    case '⌫': // Backspace
                        equationInput.value = equationInput.value.slice(0, -1);
                        break;
                    case 'C': // Clear
                        equationInput.value = '';
                        break;
                    case '×': // Multiply symbol
                        equationInput.value += '*';
                        break;
                    case ' ': // Space
                        equationInput.value += ' ';
                        break;
                    case '()': // Parentheses
                        equationInput.value += '()';
                        equationInput.selectionStart = equationInput.selectionEnd - 1;
                        break;
                    case '√': // Square root
                        equationInput.value += 'sqrt(';
                        break;
                    default:
                        equationInput.value += value;
                        break;
                }
                
                // Update preview
                document.getElementById('equationPreview').textContent = equationInput.value;
            });
        });
    }
    
    resizeCanvas() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.drawGraph();
    }
    
    drawGraph() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw axes
        this.drawAxes();
        
        // Draw inequalities first (they go under equations)
        this.equations.forEach((eq, index) => {
            if (eq.type === 'inequality' && eq.visible) {
                this.drawInequality(eq, this.colors[index % this.colors.length]);
            }
        });
        
        // Draw equations
        this.equations.forEach((eq, index) => {
            if (eq.type === 'equation' && eq.visible) {
                this.drawEquation(eq, this.colors[index % this.colors.length]);
            }
        });
        
        // Draw systems of equations
        this.equations.forEach((eq, index) => {
            if (eq.type === 'system' && eq.visible) {
                this.drawSystem(eq, this.colors[index % this.colors.length]);
            }
        });
    }
    
    drawGrid() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        this.ctx.strokeStyle = document.body.classList.contains('dark-mode') ? 'rgba(68, 68, 68, 0.5)' : 'rgba(221, 221, 221, 0.5)';
        this.ctx.lineWidth = 1;
        
        // Vertical grid lines
        const step = this.scale;
        const startX = Math.floor(-this.offsetX / step) * step + this.offsetX;
        for (let x = startX; x < width; x += step) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }
        
        // Horizontal grid lines
        const startY = Math.floor(-this.offsetY / step) * step + this.offsetY;
        for (let y = startY; y < height; y += step) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }
    }
    
    drawAxes() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = -this.offsetX;
        const centerY = height - this.offsetY;
        
        // Draw x and y axes
        this.ctx.strokeStyle = document.body.classList.contains('dark-mode') ? '#f0f0f0' : '#333';
        this.ctx.lineWidth = 2;
        
        // X-axis
        this.ctx.beginPath();
        this.ctx.moveTo(0, centerY);
        this.ctx.lineTo(width, centerY);
        this.ctx.stroke();
        
        // Y-axis
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, 0);
        this.ctx.lineTo(centerX, height);
        this.ctx.stroke();
        
        // Draw axis labels
        this.ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#f0f0f0' : '#333';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        
        // X-axis labels
        for (let x = Math.floor(-this.offsetX / this.scale) * this.scale + this.scale; x < width; x += this.scale) {
            if (x !== centerX) {
                const label = ((x - centerX) / this.scale).toFixed(1);
                if (label !== '0.0') {
                    this.ctx.fillText(label, x, centerY + 15);
                }
            }
        }
        
        // Y-axis labels
        this.ctx.textAlign = 'right';
        for (let y = Math.floor((height - this.offsetY) / this.scale) * this.scale - this.scale; y > 0; y -= this.scale) {
            if (y !== centerY) {
                const label = ((centerY - y) / this.scale).toFixed(1);
                if (label !== '0.0') {
                    this.ctx.fillText(label, centerX - 10, y);
                }
            }
        }
    }
    
    parseEquation(expression) {
        // Basic parsing for different types of equations
        const lowerExpr = expression.toLowerCase();
        
        if (lowerExpr.includes('<') || lowerExpr.includes('≤') || lowerExpr.includes('>') || lowerExpr.includes('≥')) {
            return { type: 'inequality', expression: expression };
        } else if (expression.includes('{') || expression.toLowerCase().includes('system')) {
            return { type: 'system', expression: expression };
        } else {
            return { type: 'equation', expression: expression };
        }
    }
    
    evaluateExpression(expression, x) {
        try {
            // Replace 'x' with the actual value
            let expr = expression.replace(/x/g, `(${x})`);
            
            // Replace math functions
            expr = expr.replace(/sin\(/g, 'Math.sin(');
            expr = expr.replace(/cos\(/g, 'Math.cos(');
            expr = expr.replace(/tan\(/g, 'Math.tan(');
            expr = expr.replace(/log\(/g, 'Math.log10(');
            expr = expr.replace(/ln\(/g, 'Math.log(');
            expr = expr.replace(/sqrt\(/g, 'Math.sqrt(');
            expr = expr.replace(/\^/g, '**');
            expr = expr.replace(/π/g, 'Math.PI');
            expr = expr.replace(/e/g, 'Math.E');
            
            // Evaluate the expression
            return eval(expr);
        } catch (error) {
            return NaN;
        }
    }
    
    evaluateInequality(leftExpr, rightExpr, x, operator) {
        try {
            const leftVal = this.evaluateExpression(leftExpr, x);
            const rightVal = this.evaluateExpression(rightExpr, x);
            
            if (isNaN(leftVal) || isNaN(rightVal)) return false;
            
            switch(operator) {
                case '<': return leftVal < rightVal;
                case '≤': return leftVal <= rightVal;
                case '>': return leftVal > rightVal;
                case '≥': return leftVal >= rightVal;
                default: return false;
            }
        } catch (error) {
            return false;
        }
    }
    
    drawEquation(eq, color) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = -this.offsetX;
        const centerY = height - this.offsetY;
        
        // Handle both object and string equations
        const exprString = typeof eq === 'object' ? eq.expression : eq;
        
        // Parse equation - simple parser for "y = expression" form
        let expr = exprString;
        if (expr.includes('=')) {
            expr = expr.split('=')[1].trim();
        }
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        
        let firstPoint = true;
        const step = 1; // Step in pixels
        
        for (let px = 0; px < width; px += step) {
            const x = (px - centerX) / this.scale;
            const yVal = this.evaluateExpression(expr, x);
            
            if (!isNaN(yVal) && isFinite(yVal)) {
                const py = centerY - yVal * this.scale;
                
                if (firstPoint) {
                    this.ctx.moveTo(px, py);
                    firstPoint = false;
                } else {
                    this.ctx.lineTo(px, py);
                }
            } else {
                firstPoint = true; // Start a new segment after undefined values
            }
        }
        
        this.ctx.stroke();
    }
    
    drawInequality(eq, color) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = -this.offsetX;
        const centerY = height - this.offsetY;
        
        // Parse the inequality - handle various formats like 'y < 2x + 1', 'x + y ≤ 5', etc.
        let leftExpr, rightExpr, operator;
        let expr = eq.expression;
        
        // Handle different inequality operators
        if (expr.includes('<=')) {
            [leftExpr, rightExpr] = expr.split('<=');
            operator = '≤';
        } else if (expr.includes('>=')) {
            [leftExpr, rightExpr] = expr.split('>=');
            operator = '≥';
        } else if (expr.includes('≤')) {
            [leftExpr, rightExpr] = expr.split('≤');
            operator = '≤';
        } else if (expr.includes('≥')) {
            [leftExpr, rightExpr] = expr.split('≥');
            operator = '≥';
        } else if (expr.includes('<')) {
            [leftExpr, rightExpr] = expr.split('<');
            operator = '<';
        } else if (expr.includes('>')) {
            [leftExpr, rightExpr] = expr.split('>');
            operator = '>';
        } else {
            return; // Not a valid inequality
        }
        
        // Trim whitespace
        leftExpr = leftExpr.trim();
        rightExpr = rightExpr.trim();
        
        // For inequalities like 'y < f(x)' or 'f(x) < y', we shade the area
        // Create a temporary canvas to draw the shaded area
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Draw the shaded area using a more efficient method
        tempCtx.fillStyle = `${color}40`; // 40 is for 25% opacity
        
        // Sample the plane to determine which pixels should be shaded
        const step = Math.max(1, 50 / this.scale); // Adjust sampling based on zoom level
        
        for (let px = 0; px < width; px += step) {
            for (let py = 0; py < height; py += step) {
                const x = (px - centerX) / this.scale;
                const y = (centerY - py) / this.scale;
                
                try {
                    // For 'y < f(x)' type inequalities
                    if (leftExpr === 'y' || leftExpr === 'y ') {
                        const rightValue = this.evaluateExpression(rightExpr, x);
                        if (this.checkInequality(y, rightValue, operator)) {
                            tempCtx.fillRect(px, py, step, step);
                        }
                    } 
                    // For 'f(x) < y' type inequalities
                    else if (rightExpr === 'y' || rightExpr === 'y ') {
                        const leftValue = this.evaluateExpression(leftExpr, x);
                        if (this.checkInequality(leftValue, y, operator)) {
                            tempCtx.fillRect(px, py, step, step);
                        }
                    } 
                    // For more complex inequalities like 'f(x,y) < g(x,y)'
                    else {
                        const leftValue = this.evaluateExpression(leftExpr.replace(/y/g, `(${y})`), x);
                        const rightValue = this.evaluateExpression(rightExpr.replace(/y/g, `(${y})`), x);
                        
                        if (this.checkInequality(leftValue, rightValue, operator)) {
                            tempCtx.fillRect(px, py, step, step);
                        }
                    }
                } catch (e) {
                    // Skip if evaluation fails
                }
            }
        }
        
        // Draw the temporary canvas onto the main canvas
        this.ctx.drawImage(tempCanvas, 0, 0);
        
        // Draw the boundary line (the equality part)
        this.drawEquation({expression: `${leftExpr} = ${rightExpr}`}, color);
    }
    
    checkInequality(left, right, operator) {
        switch(operator) {
            case '<': return left < right;
            case '≤': return left <= right;
            case '>': return left > right;
            case '≥': return left >= right;
            default: return false;
        }
    }
    
    drawSystem(eq, color) {
        // For now, just draw each equation in the system with a different shade
        // This is a simplified implementation
        this.drawEquation(eq, color);
    }
    
    addEquation(equation, type = 'equation') {
        // Determine the type if not provided
        if (!type) {
            if (equation.includes('<') || equation.includes('≤') || equation.includes('>') || equation.includes('≥')) {
                type = 'inequality';
            } else if (equation.includes('{') || equation.toLowerCase().includes('system')) {
                type = 'system';
            } else {
                type = 'equation';
            }
        }
        
        const eq = {
            id: Date.now(),
            expression: equation,
            type: type,
            color: this.colors[this.colorIndex % this.colors.length],
            visible: true
        };
        
        this.equations.push(eq);
        this.colorIndex++;
        this.updateEquationList();
        this.drawGraph();
    }
    
    updateEquationList() {
        const list = document.getElementById('equationList');
        list.innerHTML = '';
        
        this.equations.forEach((eq, index) => {
            const li = document.createElement('li');
            li.className = 'equation-item';
            
            // Add visual indicator for inequality or system
            let typeIndicator = '';
            if (eq.type === 'inequality') {
                typeIndicator = ' [≤≥]';
            } else if (eq.type === 'system') {
                typeIndicator = ' {S}';
            }
            
            li.innerHTML = `
                <div>
                    <span class="equation-color" style="background-color: ${eq.color}"></span>
                    <span class="equation-text">${eq.expression}${typeIndicator}</span>
                </div>
                <div class="equation-actions">
                    <button class="action-btn hide-btn" title="Amaga">${eq.visible ? '👁️' : '👁️‍🗨️'}</button>
                    <button class="action-btn delete-btn" title="Esborra">🗑️</button>
                </div>
            `;
            
            const hideBtn = li.querySelector('.hide-btn');
            const deleteBtn = li.querySelector('.delete-btn');
            
            hideBtn.addEventListener('click', () => {
                eq.visible = !eq.visible;
                this.drawGraph();
                this.updateEquationList();
            });
            
            deleteBtn.addEventListener('click', () => {
                this.equations = this.equations.filter(e => e.id !== eq.id);
                this.colorIndex--;
                this.updateEquationList();
                this.drawGraph();
            });
            
            list.appendChild(li);
        });
    }
    
    startDrag(e) {
        this.isDragging = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.canvas.style.cursor = 'grabbing';
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        const dx = e.clientX - this.lastX;
        const dy = e.clientY - this.lastY;
        
        this.offsetX += dx;
        this.offsetY += dy;
        
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        
        this.drawGraph();
    }
    
    endDrag() {
        this.isDragging = false;
        this.canvas.style.cursor = 'grab';
    }
    
    zoom(factor, centerX, centerY) {
        if (centerX === undefined || centerY === undefined) {
            centerX = this.canvas.width / 2;
            centerY = this.canvas.height / 2;
        }
        
        // Calculate world coordinates of the center point before zoom
        const worldCenterX = (centerX + this.offsetX) / this.scale;
        const worldCenterY = (this.canvas.height - centerY + this.offsetY) / this.scale;
        
        // Apply zoom
        this.scale *= factor;
        
        // Recalculate offset to keep the world center point at the same screen position
        const newOffsetX = worldCenterX * this.scale - centerX;
        const newOffsetY = this.canvas.height - worldCenterY * this.scale - centerY;
        
        this.offsetX = newOffsetX;
        this.offsetY = newOffsetY;
        
        this.drawGraph();
    }
    
    resetView() {
        this.scale = 50;
        this.offsetX = 0;
        this.offsetY = 0;
        this.drawGraph();
    }
    
    showTooltip(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Convert to graph coordinates
        const graphX = (x + this.offsetX) / this.scale;
        const graphY = (this.canvas.height - y + this.offsetY) / this.scale;
        
        // Update tooltip
        this.tooltip.textContent = `(${graphX.toFixed(2)}, ${graphY.toFixed(2)})`;
        this.tooltip.style.left = e.pageX + 10 + 'px';
        this.tooltip.style.top = e.pageY - 10 + 'px';
        this.tooltip.style.display = 'block';
    }
    
    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const themeBtn = document.getElementById('themeToggle');
        themeBtn.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
        this.drawGraph();
    }
}
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const graficadora = new Graficadora();
    
    // Add export functionality
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Exportar Gràfica';
    exportBtn.className = 'btn-primary';
    exportBtn.style.position = 'absolute';
    exportBtn.style.top = '20px';
    exportBtn.style.right = '20px';
    exportBtn.onclick = () => {
        const canvas = document.getElementById('graphCanvas');
        const link = document.createElement('a');
        link.download = 'grafica.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
    
    document.querySelector('.graph-container').appendChild(exportBtn);
    
    // Add grid toggle functionality
    const gridToggle = document.createElement('button');
    gridToggle.textContent = '✗';
    gridToggle.className = 'btn-icon';
    gridToggle.title = 'Mostrar/Ocultar Graella';
    gridToggle.style.position = 'absolute';
    gridToggle.style.top = '70px';
    gridToggle.style.right = '20px';
    
    let gridVisible = true;
    gridToggle.onclick = () => {
        gridVisible = !gridVisible;
        gridToggle.textContent = gridVisible ? '✗' : '⊞';
        graficadora.drawGraph();
    };
    
    document.querySelector('.graph-container').appendChild(gridToggle);
    
    // Add history functionality
    const history = [];
    const originalAddEquation = graficadora.addEquation;
    graficadora.addEquation = function(expression, type) {
        history.push([...this.equations]);
        if (history.length > 20) history.shift(); // Keep only last 20 states
        originalAddEquation.call(this, expression, type);
    };
    
    // Add undo button
    const undoBtn = document.createElement('button');
    undoBtn.textContent = '↶';
    undoBtn.className = 'btn-icon';
    undoBtn.title = 'Desfer (Ctrl+Z)';
    undoBtn.style.position = 'absolute';
    undoBtn.style.top = '120px';
    undoBtn.style.right = '20px';
    undoBtn.onclick = () => {
        if (history.length > 0) {
            graficadora.equations = [...history.pop()];
            graficadora.updateEquationList();
            graficadora.drawGraph();
        }
    };
    
    document.querySelector('.graph-container').appendChild(undoBtn);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+Z for undo
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            if (history.length > 0) {
                graficadora.equations = [...history.pop()];
                graficadora.updateEquationList();
                graficadora.drawGraph();
            }
        }
    });
});