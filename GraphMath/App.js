import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Graph } from "./components/Graph.js";
import { SidePanel } from "./components/SidePanel.js";
import { EquationEditorModal } from "./components/EquationEditorModal.js";
import { Header } from "./components/Header.js";
import { InfoModal } from "./components/InfoModal.js";
import { THEMES, COLORS } from "./constants.js";
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
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [editingFunction, setEditingFunction] = useState(null);
  const [theme, setTheme] = useState("light");
  const [viewConfig, setViewConfig] = useState({
    grid: true,
    labels: true,
    points: true
  });
  const graphRef = useRef(null);
  useEffect(() => {
    try {
      localStorage.setItem("grapher-functions", JSON.stringify(functions));
    } catch (error) {
      console.error("Failed to save functions to localStorage", error);
    }
  }, [functions]);
  const handleAddFunction = (func) => {
    const nextColor = COLORS[functions.length % COLORS.length];
    setFunctions((prev) => [...prev, { ...func, id: Date.now(), color: nextColor, isVisible: true }]);
  };
  const handleUpdateFunction = (id, updatedFunc) => {
    setFunctions((prev) => prev.map((f) => f.id === id ? { ...f, ...updatedFunc } : f));
  };
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
  const handleUpdateColor = useCallback((id, color) => {
    setFunctions((prev) => prev.map((f) => f.id === id ? { ...f, color } : f));
  }, []);
  const handleDownloadGraph = () => {
    graphRef.current?.downloadImage();
  };
  const themeClasses = useMemo(() => THEMES[theme], [theme]);
  return /* @__PURE__ */ jsxs("div", { className: `flex h-screen font-sans ${themeClasses.bg} ${themeClasses.text}`, children: [
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
          onDownloadClick: handleDownloadGraph
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex-1 relative", children: /* @__PURE__ */ jsx(Graph, { ref: graphRef, functions: functions.filter((f) => f.isVisible), theme, viewConfig }) })
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
        theme
      }
    ),
    /* @__PURE__ */ jsx(
      InfoModal,
      {
        isOpen: isInfoModalOpen,
        onClose: () => setIsInfoModalOpen(false),
        theme
      }
    )
  ] });
};
var stdin_default = App;
export {
  stdin_default as default
};
