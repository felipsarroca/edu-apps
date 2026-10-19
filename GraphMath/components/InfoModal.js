import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { THEMES } from "../constants.js";
const InfoModal = ({ isOpen, onClose, theme }) => {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const themeClasses = THEMES[theme];
  React.useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);
  const handleClose = React.useCallback(() => {
    setIsAnimating(false);
    setTimeout(onClose, 200);
  }, [onClose]);
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" || event.key === "Enter") {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { className: `fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${isAnimating ? "opacity-100" : "opacity-0"}`, onClick: handleClose, children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: `rounded-lg shadow-2xl w-full max-w-2xl ${themeClasses.panelBg} border ${themeClasses.border} transition-all duration-200 ${isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"} max-h-[90vh] flex flex-col`,
      onClick: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ jsxs("div", { className: `p-4 border-b ${themeClasses.border} flex justify-between items-center flex-shrink-0`, children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-rocket text-blue-500" }),
            "Benvingut/da a la graficadora de funcions"
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: handleClose, className: `p-2 rounded-full -mr-2 -mt-2 ${themeClasses.buttonHover}`, children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-times" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 overflow-y-auto space-y-4", children: [
          /* @__PURE__ */ jsx("p", { className: themeClasses.secondaryText, children: "Aquesta eina et permet visualitzar funcions matem\xE0tiques, inequacions i sistemes de manera interactiva." }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg mb-2", children: "Com comen\xE7ar" }),
            /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside space-y-1", children: [
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Afegir una funci\xF3:" }),
                " Fes clic al bot\xF3 ",
                /* @__PURE__ */ jsx("span", { className: "font-mono p-1 rounded bg-blue-500 text-white text-xs", children: "+ Afegir" }),
                " per obrir l'editor."
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Tipus:" }),
                " Pots graficar ",
                /* @__PURE__ */ jsx("code", { className: `${themeClasses.buttonBg} p-1 rounded`, children: "equacions" }),
                " (ex: ",
                /* @__PURE__ */ jsx("code", { className: "font-mono", children: "y = x^2" }),
                "), ",
                /* @__PURE__ */ jsx("code", { className: `${themeClasses.buttonBg} p-1 rounded`, children: "inequacions" }),
                " (ex: ",
                /* @__PURE__ */ jsx("code", { className: "font-mono", children: "y > sin(x)" }),
                "), ",
                /* @__PURE__ */ jsx("code", { className: `${themeClasses.buttonBg} p-1 rounded`, children: "intervals" }),
                " (ex: ",
                /* @__PURE__ */ jsx("code", { className: "font-mono", children: "-2 < x < 2" }),
                ") o ",
                /* @__PURE__ */ jsx("code", { className: `${themeClasses.buttonBg} p-1 rounded`, children: "sistemes" }),
                " d'equacions."
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Domini restringit:" }),
                " Per a les equacions, pots limitar el domini on es dibuixa la funci\xF3 (ex: ",
                /* @__PURE__ */ jsx("code", { className: "font-mono", children: "0 < x < 5" }),
                " o ",
                /* @__PURE__ */ jsx("code", { className: "font-mono", children: "x > 1" }),
                ")."
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Teclat virtual:" }),
                " Utilitza el teclat a l'editor per introduir expressions complexes f\xE0cilment. Les fletxes mouen el cursor i les tecles d'arrel, fracci\xF3 i funcions ja hi posen els par\xE8ntesis."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg mb-2", children: "Qu\xE8 pots escriure" }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsx("table", { className: "w-full text-sm", children: /* @__PURE__ */ jsx("tbody", { children: [
              ["Funci\xF3", "y = 2x + 1,  y = x^2 − 4", "Dibuixa la gr\xE0fica i en calcula el domini, els talls amb els eixos i, si \xE9s una par\xE0bola, el v\xE8rtex."],
              ["Equaci\xF3 amb una inc\xF2gnita", "x^2 − 5x + 6 = 0", "Marca les solucions sobre l'eix X (x₁ = 2, x₂ = 3)."],
              ["Inequaci\xF3 amb una inc\xF2gnita", "2x − 4 > 0", "Pinta l'interval soluci\xF3 sobre l'eix X."],
              ["Recta en forma general", "2x + 3y = 7", "La dibuixa sense haver d'a\xEFllar la y."],
              ["Corbes", "x^2 + y^2 = 9", "Circumfer\xE8ncies i altres corbes impl\xEDcites."],
              ["Inequaci\xF3 amb dues inc\xF2gnites", "y > x − 2", "Pinta la regi\xF3 del pla que la compleix."],
              ["Sistema", "{ 2x + 3y = 7 ;  x − y = 1 }", "Cada equaci\xF3 amb un color i el punt soluci\xF3 marcat."],
              ["Funci\xF3 amb nom", "f(x) = x^2 − 4", "Es pot escriure amb la notaci\xF3 f(x), g(x)..."],
              ["Domini restringit", "y = x^2, −2 < x < 2", "Dibuixa nom\xE9s el tros indicat."],
              ["Par\xE0metres", "y = a x^2 + b x + c", "Apareixen lliscadors per canviar a, b, c... i un bot\xF3 \u25B6 per animar-los."]
            ].map(([kind, example, desc], i) => /* @__PURE__ */ jsxs("tr", { className: `border-b ${themeClasses.border}`, children: [
              /* @__PURE__ */ jsx("td", { className: "py-1.5 pr-2 font-semibold align-top", children: kind }),
              /* @__PURE__ */ jsx("td", { className: "py-1.5 pr-2 font-mono align-top whitespace-nowrap", children: example }),
              /* @__PURE__ */ jsx("td", { className: `py-1.5 align-top ${themeClasses.secondaryText}`, children: desc })
            ] }, i)) }) }) }),
            /* @__PURE__ */ jsx("p", { className: `text-sm mt-2 ${themeClasses.secondaryText}`, children: "Notaci\xF3: x^2 o x\xB2 (pot\xE8ncia), 2x (producte), 1/2 (fracci\xF3), sqrt(x) o √(x), |x| (valor absolut), sin, cos, tan, ln, log, log(x, 2) (logaritme en base 2), π. La coma decimal es pot escriure amb coma o amb punt." }),
            /* @__PURE__ */ jsx("p", { className: `text-sm mt-2 ${themeClasses.secondaryText}`, children: "A la gr\xE0fica: passa el ratol\xED (o el dit) per sobre d'una corba per veure'n les coordenades. Al panell d'informaci\xF3, el bot\xF3 \xABMostra\xBB destaca el v\xE8rtex, els talls, els extrems o les as\xEDmptotes. El men\xFA de vista (icona de lliscadors) amaga la quadr\xEDcula o canvia l'escala de l'eix Y." })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg mb-2", children: "Interactuar amb la gr\xE0fica" }),
            /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside space-y-1", children: [
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Moure (Pan):" }),
                " Fes clic i arrossega per despla\xE7ar-te per la gr\xE0fica."
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Zoom:" }),
                " Fes servir la roda del ratol\xED o pessiga a la pantalla t\xE0ctil per apropar o allunyar."
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Controls de Zoom:" }),
                " Utilitza els botons ",
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus" }),
                " i ",
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-minus" }),
                " a la cantonada de la gr\xE0fica per un control prec\xEDs del zoom."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg mb-2", children: "Gestionar les funcions" }),
            /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside space-y-1", children: [
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Panell lateral:" }),
                " Totes les teves funcions apareixen al panell de la dreta. Pots obrir-lo o tancar-lo amb el bot\xF3 ",
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-bars" }),
                "."
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Visibilitat:" }),
                " Fes clic a la icona de l'ull (",
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-eye text-green-500" }),
                ") per mostrar o amagar una funci\xF3."
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Editar i Eliminar:" }),
                " Utilitza les icones del llapis (",
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pencil" }),
                ") i la paperera (",
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash text-red-500" }),
                ")."
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Color:" }),
                " Fes clic al cercle de color per personalitzar-lo."
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "An\xE0lisi:" }),
                " Fes clic a la icona d'informaci\xF3 (",
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-info text-blue-500" }),
                ") per veure'n el domini, arrels, solucions del sistema i m\xE9s."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg mb-2", children: "Eines Addicionals" }),
            /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside space-y-1", children: [
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Sessi\xF3 persistent:" }),
                " L'aplicaci\xF3 desa autom\xE0ticament les teves funcions al navegador. Quan tornis, trobar\xE0s la teva darrera sessi\xF3 de treball intacta!"
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Canviar Tema:" }),
                " Personalitza l'aparen\xE7a visual amb el bot\xF3 de temes (",
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-sun" }),
                " / ",
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-moon" }),
                ")."
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Descarregar Imatge:" }),
                " Fes clic al bot\xF3 del disquet (",
                /* @__PURE__ */ jsx("i", { className: "fa-solid fa-floppy-disk" }),
                ") per descarregar la gr\xE0fica actual com una imatge PNG d'alta qualitat, ideal per a documents i presentacions."
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: `p-4 border-t ${themeClasses.border} flex justify-end flex-shrink-0`, children: /* @__PURE__ */ jsx("button", { onClick: handleClose, className: `px-5 py-2 rounded-lg font-semibold transition-colors ${themeClasses.accentButtonClasses}`, children: "Entesos!" }) })
      ]
    }
  ) });
};
export {
  InfoModal
};
