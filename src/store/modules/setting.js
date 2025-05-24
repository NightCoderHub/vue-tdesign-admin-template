import { defineStore } from "pinia";
import { Color } from "tvision-color";

import { DARK_CHART_COLORS, LIGHT_CHART_COLORS } from "@/config/color";
import STYLE_CONFIG from "@/config/style";
import { store } from "@/store";
import { generateColorMap, insertThemeStylesheet } from "@/utils/color";

const state = {
  ...STYLE_CONFIG,
  showSettingPanel: false,
  chartColors: LIGHT_CHART_COLORS,
  colorList: {},
};

export const useSettingStore = defineStore("setting", {
  state: () => state,
  getters: {
    showSidebar: (state) => state.layout !== "top",
    showSidebarLogo: (state) => state.layout === "side",
    showHeaderLogo: (state) => state.layout !== "side",
    displayMode: (state) => {
      if (state.mode === "auto") {
        const media = window.matchMedia("(prefers-color-scheme:dark)");
        if (media.matches) {
          return "dark";
        }
        return "light";
      }
      return state.mode;
    },
  },
  actions: {
    async changeMode(mode) {
      let theme = mode;

      if (mode === "auto") {
        const media = window.matchMedia("(prefers-color-scheme:dark)");
        if (media.matches) {
          theme = "dark";
        } else {
          theme = "light";
        }
      }
      const isDarkMode = theme === "dark";

      document.documentElement.setAttribute("theme-mode", isDarkMode ? "dark" : "");

      this.chartColors = isDarkMode ? DARK_CHART_COLORS : LIGHT_CHART_COLORS;
    },
    changeBrandTheme(brandTheme) {
      if (document.querySelector("td-theme-generator")) return;

      const mode = this.displayMode;
      const colorKey = `${brandTheme}[${mode}]`;
      let colorMap = this.colorList[colorKey];

      if (colorMap === undefined) {
        const [{ colors: newPalette, primary: brandColorIndex }] = Color.getColorGradations({
          colors: [brandTheme],
          step: 10,
          remainInput: false,
        });
        colorMap = generateColorMap(brandTheme, newPalette, mode, brandColorIndex);
        this.colorList[colorKey] = colorMap;
      }

      insertThemeStylesheet(brandTheme, colorMap, mode);
      document.documentElement.setAttribute("theme-color", brandTheme);
    },
    updateConfig(payload) {
      for (const key in payload) {
        if (payload[key] !== undefined) {
          this[key] = payload[key];
        }
        if (key === "mode") {
          this.changeMode(payload[key]);
        }
        if (key === "brandTheme") {
          this.changeBrandTheme(payload[key]);
        }
      }
    },
  },
  persist: {
    omit: ["showSettingPanel"],
  },
});

export function getSettingStore() {
  return useSettingStore(store);
}
