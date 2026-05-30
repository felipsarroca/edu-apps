# OrtoCast LL/Y

Aplicación web estática para estudiar, practicar y reforzar la diferencia entre **LL** e **Y** en la ortografía castellana.

La app conserva el formato y las funciones de OrtoCast B/V: estudio guiado, práctica por norma, práctica aleatoria adaptativa, repaso de errores, frases contextualizadas y seguimiento del progreso.

## Cómo abrirla en local

Desde esta carpeta, ejecuta:

```powershell
python -m http.server 8019
```

Después abre:

```text
http://localhost:8019
```

No conviene abrir directamente `index.html` con doble clic, porque la app carga datos desde archivos JSON y necesita un pequeño servidor local.

## Qué incluye

- Estudio guiado de normas de uso de LL e Y.
- Ejemplos con la parte normativa resaltada.
- Práctica por norma.
- Botón `Nuevas palabras`, evitando repetir la misma tanda.
- Botón `Siguiente norma`.
- Corrección inmediata con explicación.
- Práctica aleatoria adaptativa.
- Repaso de errores con palabras falladas anteriormente.
- Frases contextualizadas con pares de yeísmo como `haya/halla`, `vaya/valla`, `cayó/calló`, `rallar/rayar`.
- Registro de aciertos, errores y errores frecuentes.
- Banco de datos con 10 normas, 98 palabras y 18 frases de contraste.

## Estructura del proyecto

```text
OrtoCast-LLY/
├─ index.html
├─ styles.css
├─ app.js
├─ manifest.webmanifest
├─ sw.js
├─ data/
│  ├─ rules.json
│  ├─ words.json
│  └─ homophones.json
└─ assets/
   ├─ icon-192.png
   ├─ icon-512.png
   ├─ CC_BY-NC-SA.png
   └─ screenshots/
```

## Modelo adaptativo

La práctica aleatoria mantiene la estimación de nivel `Inicial`, `Intermedio` o `Avanzado` mediante el mismo modelo bayesiano de la app original. Como hay dos opciones de respuesta, la probabilidad base por azar sigue siendo `c = 0.5`: LL o Y.

## Autoría y licencia

Aplicación creada por Felip Sarroca con asistencia de la IA.

Obra bajo licencia `CC BY-NC-SA 4.0`.
