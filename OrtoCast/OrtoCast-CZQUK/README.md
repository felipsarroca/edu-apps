# OrtoCast C/Z/QU/K

Aplicación web estática para estudiar, practicar y reforzar el uso de **C**, **Z**, **QU** y **K** en la ortografía castellana.

Mantiene el formato y las funciones de OrtoCast B/V: estudio guiado, práctica por norma, práctica aleatoria adaptativa, repaso de errores, frases contextualizadas y seguimiento del progreso.

## Ejecutar en local

```powershell
cd OrtoCast-CZQUK
python -m http.server 8021
```

Abrir después `http://localhost:8021/`.

## Contenido

- 10 normas de uso de C, Z, QU y K.
- 100 palabras para práctica por norma, aleatoria y repaso de errores.
- Frases contextualizadas para contrastes de significado.
- Instalación como PWA cuando el navegador lo permita.

## Estructura

```text
OrtoCast-CZQUK/
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
   └─ CC_BY-NC-SA.png
```

La práctica aleatoria mantiene la estimación de nivel `Inicial`, `Intermedio` o `Avanzado` mediante el mismo modelo bayesiano de las otras apps.

## Licencia

Obra bajo licencia `CC BY-NC-SA 4.0`.
