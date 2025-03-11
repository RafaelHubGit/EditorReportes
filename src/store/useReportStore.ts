import { StateCreator, create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ReporteState {
  html: string;
  css: string;
  jsonData: string;
  setHtml: (html: string) => void;
  setCss: (css: string) => void;
  setJsonData: (json: string) => void;
}

const storeReportes: StateCreator<ReporteState> = ((set) => ({
  html: "<h1>Reporte de Ventas</h1><p>Total: ${total}</p>",
  css: "h1 { color: blue; } p { font-size: 16px; }",
  jsonData: JSON.stringify({ total: "$500" }, null, 2),

  setHtml: (html) => set((state) => {
    localStorage.setItem("html", JSON.stringify(html));
    return { html };
  }),

  setCss: (css) => set((state) => {
    localStorage.setItem("css", JSON.stringify(css));
    return { css };
  }),

  setJsonData: (json) => set((state) => {
    localStorage.setItem("jsonData", JSON.stringify(json));
    return { jsonData: json };
  }),
}));

export const useReporteStore = create<ReporteState>()(
  persist(
    devtools((set, get, api) => {
      const wrappedSet = (fn: any) => {
        const nextState = fn(get());
        Object.keys(nextState).forEach((key) => {
          localStorage.setItem(key, JSON.stringify(nextState[key]));
        });
        set(nextState);
      };
      return storeReportes(wrappedSet, get, api);
    }),
    {
      name: "reporte-store",
      storage: {
      getItem: (name) => {
        const item = localStorage.getItem(name);
        return item ? JSON.parse(item) : null;
      },
      setItem: (name, value) => {
        localStorage.setItem(name, JSON.stringify(value));
      },
      removeItem: (name) => {
        localStorage.removeItem(name);
      }
    }
    }
  )
);

// Sincronización con otras pestañas
window.addEventListener("storage", (event) => {
  if (["html", "css", "jsonData"].includes(event.key!)) {
    useReporteStore.setState((state) => ({
      ...state,
      [event.key!]: event.newValue ? JSON.parse(event.newValue) : ""
    }));
  }
});
