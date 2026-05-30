# OrtoCast G/J

Aplicación web estática para estudiar, practicar y reforzar el uso de la **G** y la **J** en castellano.

La app conserva el formato y las funciones de OrtoCast B/V: estudio guiado, práctica por norma, práctica aleatoria adaptativa, repaso de errores, frases contextualizadas y seguimiento del progreso.

## Cómo abrirla en local

Desde esta carpeta, ejecuta:

```powershell
python -m http.server 8018
```

Después abre:

```text
http://localhost:8018
```

No conviene abrir directamente `index.html` con doble clic, porque la app carga datos desde archivos JSON y necesita un pequeño servidor local.

## Qué incluye

- Estudio guiado de normas de uso de la G y la J.
- Ejemplos con la parte normativa resaltada.
- Práctica por norma.
- Botón `Nuevas palabras`, evitando repetir la misma tanda.
- Botón `Siguiente norma`.
- Corrección inmediata con explicación.
- Práctica aleatoria adaptativa.
- Repaso de errores con palabras falladas anteriormente.
- Frases contextualizadas para contrastes G/J.
- Registro de aciertos, errores y errores frecuentes.
- Banco de datos con 12 normas, más de 120 palabras y 16 frases de contraste.

## Estructura del proyecto

```text
OrtoCast-GJ/
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

La práctica aleatoria mantiene la estimación de nivel `Inicial`, `Intermedio` o `Avanzado` mediante el mismo modelo bayesiano de la app original. Como hay dos opciones de respuesta, la probabilidad base por azar sigue siendo `c = 0.5`: G o J.

## Autoría y licencia

Aplicación creada por Felip Sarroca con asistencia de la IA.

Obra bajo licencia `CC BY-NC-SA 4.0`.
