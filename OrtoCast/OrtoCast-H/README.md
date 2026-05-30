# OrtoCast H

Aplicación web estática para estudiar, practicar y reforzar el uso de la **H** en castellano.

La app conserva el formato y las funciones de OrtoCast B/V: estudio guiado, práctica por norma, práctica aleatoria adaptativa, repaso de errores, frases contextualizadas y seguimiento del progreso.

## Cómo abrirla en local

Desde esta carpeta, ejecuta:

```powershell
python -m http.server 8020
```

Después abre:

```text
http://localhost:8020
```

No conviene abrir directamente `index.html` con doble clic, porque la app carga datos desde archivos JSON y necesita un pequeño servidor local.

## Qué incluye

- Estudio guiado de normas de uso de la H.
- Contraste entre `H` y `sin H`.
- Ejemplos con la parte normativa resaltada.
- Práctica por norma.
- Botón `Nuevas palabras`, evitando repetir la misma tanda.
- Botón `Siguiente norma`.
- Corrección inmediata con explicación.
- Práctica aleatoria adaptativa.
- Repaso de errores con palabras falladas anteriormente.
- Frases contextualizadas con contrastes como `a/ha`, `e/he`, `ay/hay`, `echo/hecho`, `asta/hasta`.
- Registro de aciertos, errores y errores frecuentes.
- Banco de datos con 10 normas, 90 palabras y 18 frases de contraste.

## Estructura del proyecto

```text
OrtoCast-H/
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

La práctica aleatoria mantiene la estimación de nivel `Inicial`, `Intermedio` o `Avanzado` mediante el mismo modelo bayesiano de la app original. Como hay dos opciones de respuesta, la probabilidad base por azar sigue siendo `c = 0.5`: H o sin H.

## Nota técnica

La opción `sin H` se guarda internamente como un espacio en blanco, tal como se pidió. Al mostrar la palabra corregida, la app elimina ese espacio para que la solución quede escrita de forma natural.

## Autoría y licencia

Aplicación creada por Felip Sarroca con asistencia de la IA.

Obra bajo licencia `CC BY-NC-SA 4.0`.
