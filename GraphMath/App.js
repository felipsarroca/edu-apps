import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Graph } from "./components/Graph.js";
import { SidePanel } from "./components/SidePanel.js";
import { EquationEditorModal } from "./components/EquationEditorModal.js";
import { Header } from "./components/Header.js";
import { InfoModal } from "./components/InfoModal.js";
import { THEMES, COLORS, getExpressionColor, isMarkOn } from "./constants.js";
import { getParameters, setParamValues } from "./services/parser.js";
const loadJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return { ...fallback, ...JSON.parse(raw) };
  } catch (error) {
    console.error(`No s'ha pogut llegir ${key}`, error);
  }
  return fallback;
};
const saveJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`No s'ha pogut desar ${key}`, error);
  }
};
const DEFAULT_PARAM = { value: 1, min: -5, max: 5, step: 0.1 };
const App = () => {
  const [functions, setFunctions] = useState(() => {
    try {
      const savedFunctions = localStorage.getItem("grapher-functions");
      if (savedFunctions) {
        const parsed = JSON.parse(savedFunctions);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Failed to load functions from localStorage", error);
    }
    return [];
  });
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(() => typeof window === "undefined" || window.innerWidth >= 768);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [editingFunction, setEditingFunction] = useState(null);
  const [theme, setTheme] = useState("light");
  const [viewConfig, setViewConfig] = useState(() => loadJson("grapher-view", { grid: true, labels: true, points: true, yScale: 1 }));
  const [params, setParams] = useState(() => loadJson("grapher-params", {}));
  const [animating, setAnimating] = useState(null);
  const graphRef = useRef(null);
  useEffect(() => saveJson("grapher-view", viewConfig), [viewConfig]);
  useEffect(() => saveJson("grapher-params", params), [params]);
  const handleViewConfigChange = useCallback((changes) => setViewConfig((prev) => ({ ...prev, ...changes })), []);
  // Paràmetres (a, b, c...) que apareixen a les funcions
  const paramNames = useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    functions.forEach((f) => f.expressions.forEach((e) => getParameters(e).forEach((n) => set.add(n))));
    return [...set].sort();
  }, [functions]);
  const paramConfigs = useMemo(() => Object.fromEntries(paramNames.map((n) => [n, { ...DEFAULT_PARAM, ...params[n] }])), [paramNames, params]);
  const paramValues = useMemo(() => Object.fromEntries(paramNames.map((n) => [n, paramConfigs[n].value])), [paramNames, paramConfigs]);
  setParamValues(paramValues);
  const paramsKey = JSON.stringify(paramValues);
  const handleParamChange = useCallback((name, changes) => {
    setParams((prev) => {
      const next = { ...DEFAULT_PARAM, ...prev[name], ...changes };
      if (next.min > next.max) [next.min, next.max] = [next.max, next.min];
      if (!(next.step > 0)) next.step = 0.1;
      next.value = Math.min(next.max, Math.max(next.min, next.value));
      return { ...prev, [name]: next };
    });
  }, []);
  // Animació d'un paràmetre: va i ve entre el mínim i el màxim
  useEffect(() => {
    if (!animating || !paramConfigs[animating]) return;
    let frame;
    let last = performance.now();
    let direction = 1;
    const tick = (now) => {
      const dt = now - last;
      if (dt >= 40) {
        last = now;
        setParams((prev) => {
          const cfg = { ...DEFAULT_PARAM, ...prev[animating] };
          const span = cfg.max - cfg.min;
          let value = cfg.value + direction * span * dt / 4e3;
          if (value >= cfg.max) {
            value = cfg.max;
            direction = -1;
          } else if (value <= cfg.min) {
            value = cfg.min;
            direction = 1;
          }
          return { ...prev, [animating]: { ...cfg, value: Number(value.toFixed(4)) } };
        });
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animating, Boolean(paramConfigs[animating])]);
  const handleToggleAnimation = useCallback((name) => setAnimating((cur) => cur === name ? null : name), []);
  const visibleFunctions = useMemo(() => functions.filter((f) => f.isVisible), [functions]);
  useEffect(() => {
    try {
      localStorage.setItem("grapher-functions", JSON.stringify(functions));
    } catch (error) {
      console.error("Failed to save functions to localStorage", error);
    }
  }, [functions]);
  // Color per a la propera funció: el primer de la paleta que encara no s'ha fet servir
  const nextColor = useMemo(() => {
    const used = new Set(functions.flatMap((f) => f.expressions.map((_, i) => getExpressionColor(f, i))));
    return COLORS.find((c) => !used.has(c)) || COLORS[functions.length % COLORS.length];
  }, [functions]);
  // En un sistema, cada equació té el seu propi color
  const withColors = (func, base) => func.type === "system" ? { ...func, colors: func.expressions.map((_, i) => getExpressionColor(base, i)) } : { ...func, colors: void 0 };
  // Després d'afegir o editar, s'ajusta la vista perquè se'n vegin els punts importants
  const fitAfterSave = (func) => setTimeout(() => graphRef.current?.fitView([func]), 60);
  const handleAddFunction = (func) => {
    const newFunc = { ...withColors(func, { color: nextColor }), id: Date.now(), color: nextColor, isVisible: true };
    setFunctions((prev) => [...prev, newFunc]);
    fitAfterSave(newFunc);
  };
  const handleUpdateFunction = (id, updatedFunc) => {
    setFunctions((prev) => prev.map((f) => f.id === id ? { ...f, ...withColors(updatedFunc, f) } : f));
    fitAfterSave({ ...editingFunction, ...updatedFunc });
  };
  const handleToggleMark = useCallback((id, key) => {
    setFunctions((prev) => prev.map((f) => f.id === id ? { ...f, marks: { ...f.marks, [key]: !isMarkOn(f, key) } } : f));
  }, []);
  const handleSaveFunction = (funcData) => {
    if (editingFunction) {
      handleUpdateFunction(editingFunction.id, funcData);
    } else {
      handleAddFunction(funcData);
    }
    setIsModalOpen(false);
    setEditingFunction(null);
  };
  const openAddModal = () => {
    setEditingFunction(null);
    setIsModalOpen(true);
  };
  const openEditModal = (func) => {
    setEditingFunction(func);
    setIsModalOpen(true);
  };
  const handleDeleteFunction = useCallback((id) => {
    setFunctions((prev) => prev.filter((f) => f.id !== id));
  }, []);
  const handleToggleVisibility = useCallback((id) => {
    setFunctions((prev) => prev.map((f) => f.id === id ? { ...f, isVisible: !f.isVisible } : f));
  }, []);
  const handleUpdateColor = useCallback((id, color, index = 0) => {
    setFunctions((prev) => prev.map((f) => {
      if (f.id !== id) return f;
      if (f.type !== "system") return { ...f, color };
      const colors = f.expressions.map((_, i) => i === index ? color : getExpressionColor(f, i));
      return { ...f, colors, color: colors[0] };
    }));
  }, []);
  const handleDownloadGraph = () => {
    graphRef.current?.downloadImage();
  };
  const themeClasses = useMemo(() => THEMES[theme], [theme]);
  return /* @__PURE__ */ jsxs("div", { className: `relative flex h-screen overflow-hidden font-sans ${themeClasses.bg} ${themeClasses.text}`, children: [
    /* @__PURE__ */ jsxs("main", { className: "flex-1 flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        Header,
        {
          theme,
          setTheme,
          onAddClick: openAddModal,
          onToggleSidePanel: () => setIsSidePanelOpen(!isSidePanelOpen),
          isSidePanelOpen,
          onInfoClick: () => setIsInfoModalOpen(true),
          onDownloadClick: handleDownloadGraph,
          viewConfig,
          onViewConfigChange: handleViewConfigChange
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex-1 relative", children: /* @__PURE__ */ jsx(Graph, { ref: graphRef, functions: visibleFunctions, theme, viewConfig, paramsKey, onViewConfigChange: handleViewConfigChange }) })
    ] }),
    /* @__PURE__ */ jsx(
      SidePanel,
      {
        isOpen: isSidePanelOpen,
        functions,
        onEdit: openEditModal,
        onDelete: handleDeleteFunction,
        onToggleVisibility: handleToggleVisibility,
        onUpdateColor: handleUpdateColor,
        onToggleMark: handleToggleMark,
        onClose: () => setIsSidePanelOpen(false),
        paramNames,
        params: paramConfigs,
        onParamChange: handleParamChange,
        animating,
        onToggleAnimation: handleToggleAnimation,
        paramsKey,
        theme
      }
    ),
    isModalOpen && /* @__PURE__ */ jsx(
      EquationEditorModal,
      {
        isOpen: isModalOpen,
        onClose: () => {
          setIsModalOpen(false);
          setEditingFunction(null);
        },
        onSave: handleSaveFunction,
        existingFunction: editingFunction,
        nextColor,
        theme
      }
    ),
    /* @__PURE__ */ jsx(
      InfoModal,
      {
        isOpen: isInfoModalOpen,
        onClose: () => setIsInfoModalOpen(false),
        onAddExample: handleAddFunction,
        theme
      }
    )
  ] });
};
var stdin_default = App;
export {
  stdin_default as default
};
