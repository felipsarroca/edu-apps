const COLORS = [
  "#3b82f6",
  // blue-500
  "#ef4444",
  // red-500
  "#22c55e",
  // green-500
  "#f97316",
  // orange-500
  "#8b5cf6",
  // violet-500
  "#ec4899",
  // pink-500
  "#14b8a6"
  // teal-500
];
const THEMES = {
  light: {
    bg: "bg-slate-100",
    text: "text-slate-800",
    secondaryText: "text-slate-500",
    border: "border-slate-200",
    grid: "#d1d5db",
    // gray-300
    accent: "#3b82f6",
    // blue-500
    panelBg: "bg-white/80 backdrop-blur-sm",
    sidePanelBg: "bg-amber-50",
    headerBg: "bg-sky-100",
    buttonBg: "bg-white",
    buttonHover: "hover:bg-slate-50",
    accentButtonClasses: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white",
    textColorValue: "#1e293b",
    // slate-800
    secondaryTextColorValue: "#64748b",
    // slate-500
    headerGradient: "from-blue-500 to-indigo-600",
    bgColorValue: "#f1f5f9"
    // slate-100
  },
  dark: {
    bg: "bg-gray-900",
    text: "text-gray-100",
    secondaryText: "text-gray-400",
    border: "border-gray-700",
    grid: "#4b5563",
    // gray-600
    accent: "#60a5fa",
    // blue-400
    panelBg: "bg-gray-800/80 backdrop-blur-sm",
    sidePanelBg: "bg-gray-800",
    headerBg: "bg-slate-800",
    buttonBg: "bg-gray-700",
    buttonHover: "hover:bg-gray-600",
    accentButtonClasses: "bg-gradient-to-br from-blue-500 to-blue-700 text-white",
    textColorValue: "#f3f4f6",
    // gray-100
    secondaryTextColorValue: "#9ca3af",
    // gray-400
    headerGradient: "from-sky-400 to-cyan-300",
    bgColorValue: "#11182c"
    // gray-900
  },
  chalkboard: {
    bg: "bg-[#2a3c2e]",
    text: "text-gray-100",
    secondaryText: "text-gray-300",
    border: "border-gray-500",
    grid: "#5a6c5f",
    accent: "#f5d38a",
    panelBg: "bg-[#3a4c3f]/80 backdrop-blur-sm",
    sidePanelBg: "bg-[#4a5c4f]",
    headerBg: "bg-[#3a4c3f]",
    buttonBg: "bg-[#4a5c4f]",
    buttonHover: "hover:bg-[#5a6c5f]",
    accentButtonClasses: "bg-gradient-to-br from-amber-300 to-yellow-500 text-slate-800",
    textColorValue: "#f3f4f6",
    // gray-100
    secondaryTextColorValue: "#d1d5db",
    // gray-300
    headerGradient: "from-amber-200 to-yellow-300",
    bgColorValue: "#2a3c2e"
  },
  "high-contrast": {
    bg: "bg-black",
    text: "text-white",
    secondaryText: "text-gray-200",
    border: "border-white",
    grid: "#666",
    accent: "#FFFF00",
    // Yellow
    panelBg: "bg-black/80 backdrop-blur-sm border-2 border-white",
    sidePanelBg: "bg-black",
    headerBg: "bg-black",
    buttonBg: "bg-black border-2 border-white",
    buttonHover: "hover:bg-gray-800",
    accentButtonClasses: "bg-gradient-to-br from-yellow-300 to-yellow-500 text-black",
    textColorValue: "#ffffff",
    // white
    secondaryTextColorValue: "#e5e7eb",
    // gray-200
    headerGradient: "from-yellow-300 to-yellow-400",
    bgColorValue: "#000000"
  }
};
export {
  COLORS,
  THEMES
};
