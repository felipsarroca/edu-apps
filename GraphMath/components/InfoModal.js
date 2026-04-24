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
                " Utilitza el teclat a l'editor per introduir expressions complexes f\xE0cilment."
              ] })
            ] })
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
