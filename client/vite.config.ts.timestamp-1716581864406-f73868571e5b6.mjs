// vite.config.ts
import { defineConfig } from "file:///D:/Projects/Todo/client/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Projects/Todo/client/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tailwind from "file:///D:/Projects/Todo/client/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///D:/Projects/Todo/client/node_modules/autoprefixer/lib/autoprefixer.js";
import { createHtmlPlugin } from "file:///D:/Projects/Todo/client/node_modules/vite-plugin-html/dist/index.mjs";

// config.ts
var CONFIG = {
  appName: "Todo",
  helpLink: "https://github.com/arifszn/reforge",
  enablePWA: true,
  theme: {
    accentColor: "#818cf8",
    sidebarLayout: "mix" /* MIX */,
    showBreadcrumb: true
  },
  metaTags: {
    title: "Todo",
    description: "An out-of-box UI solution for enterprise applications as a React boilerplate.",
    imageURL: "logo.svg"
  }
};
var config_default = CONFIG;

// tailwind.config.mjs
var tailwind_config_default = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: config_default.theme.accentColor
      }
    }
  },
  plugins: []
};

// vite.config.ts
import { VitePWA } from "file:///D:/Projects/Todo/client/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      inject: {
        data: {
          title: config_default.appName,
          metaTitle: config_default.metaTags.title,
          metaDescription: config_default.metaTags.description,
          metaImageURL: config_default.metaTags.imageURL
        }
      }
    }),
    ...config_default.enablePWA ? [
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["icon.png"],
        manifest: {
          name: config_default.appName,
          short_name: config_default.appName,
          description: config_default.metaTags.description,
          theme_color: config_default.theme.accentColor,
          icons: [
            {
              src: "icon.png",
              sizes: "64x64 32x32 24x24 16x16 192x192 512x512",
              type: "image/png"
            }
          ]
        }
      })
    ] : []
  ],
  css: {
    postcss: {
      plugins: [tailwind(tailwind_config_default), autoprefixer]
    }
  },
  define: {
    CONFIG: config_default
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiY29uZmlnLnRzIiwgInRhaWx3aW5kLmNvbmZpZy5tanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxsYW1pbmFyXFxcXGNsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcUHJvamVjdHNcXFxcbGFtaW5hclxcXFxjbGllbnRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1Byb2plY3RzL2xhbWluYXIvY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCB0YWlsd2luZCBmcm9tICd0YWlsd2luZGNzcyc7XHJcbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJztcclxuaW1wb3J0IHsgY3JlYXRlSHRtbFBsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLWh0bWwnO1xyXG5pbXBvcnQgdGFpbHdpbmRDb25maWcgZnJvbSAnLi90YWlsd2luZC5jb25maWcubWpzJztcclxuaW1wb3J0IENPTkZJRyBmcm9tICcuL2NvbmZpZyc7XHJcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgY3JlYXRlSHRtbFBsdWdpbih7XHJcbiAgICAgIGluamVjdDoge1xyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHRpdGxlOiBDT05GSUcuYXBwTmFtZSxcclxuICAgICAgICAgIG1ldGFUaXRsZTogQ09ORklHLm1ldGFUYWdzLnRpdGxlLFxyXG4gICAgICAgICAgbWV0YURlc2NyaXB0aW9uOiBDT05GSUcubWV0YVRhZ3MuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICBtZXRhSW1hZ2VVUkw6IENPTkZJRy5tZXRhVGFncy5pbWFnZVVSTCxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgICAuLi4oQ09ORklHLmVuYWJsZVBXQVxyXG4gICAgICA/IFtcclxuICAgICAgICAgIFZpdGVQV0Eoe1xyXG4gICAgICAgICAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcclxuICAgICAgICAgICAgaW5jbHVkZUFzc2V0czogWydpY29uLnBuZyddLFxyXG4gICAgICAgICAgICBtYW5pZmVzdDoge1xyXG4gICAgICAgICAgICAgIG5hbWU6IENPTkZJRy5hcHBOYW1lLFxyXG4gICAgICAgICAgICAgIHNob3J0X25hbWU6IENPTkZJRy5hcHBOYW1lLFxyXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBDT05GSUcubWV0YVRhZ3MuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgICAgdGhlbWVfY29sb3I6IENPTkZJRy50aGVtZS5hY2NlbnRDb2xvcixcclxuICAgICAgICAgICAgICBpY29uczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICBzcmM6ICdpY29uLnBuZycsXHJcbiAgICAgICAgICAgICAgICAgIHNpemVzOiAnNjR4NjQgMzJ4MzIgMjR4MjQgMTZ4MTYgMTkyeDE5MiA1MTJ4NTEyJyxcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICBdXHJcbiAgICAgIDogW10pLFxyXG4gIF0sXHJcbiAgY3NzOiB7XHJcbiAgICBwb3N0Y3NzOiB7XHJcbiAgICAgIHBsdWdpbnM6IFt0YWlsd2luZCh0YWlsd2luZENvbmZpZyksIGF1dG9wcmVmaXhlcl0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgZGVmaW5lOiB7XHJcbiAgICBDT05GSUc6IENPTkZJRyxcclxuICB9LFxyXG59KTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxsYW1pbmFyXFxcXGNsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcUHJvamVjdHNcXFxcbGFtaW5hclxcXFxjbGllbnRcXFxcY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Qcm9qZWN0cy9sYW1pbmFyL2NsaWVudC9jb25maWcudHNcIjsvL2NvbmZpZy50c1xyXG5cclxuZW51bSBMYXlvdXRUeXBlIHtcclxuICBNSVggPSAnbWl4JyxcclxuICBUT1AgPSAndG9wJyxcclxuICBTSURFID0gJ3NpZGUnLFxyXG59XHJcblxyXG5jb25zdCBDT05GSUcgPSB7XHJcbiAgYXBwTmFtZTogJ0xhbWluYXInLFxyXG4gIGhlbHBMaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL2FyaWZzem4vcmVmb3JnZScsXHJcbiAgZW5hYmxlUFdBOiB0cnVlLFxyXG4gIHRoZW1lOiB7XHJcbiAgICBhY2NlbnRDb2xvcjogJyM4MThjZjgnLFxyXG4gICAgc2lkZWJhckxheW91dDogTGF5b3V0VHlwZS5NSVgsXHJcbiAgICBzaG93QnJlYWRjcnVtYjogdHJ1ZSxcclxuICB9LFxyXG4gIG1ldGFUYWdzOiB7XHJcbiAgICB0aXRsZTogJ0xhbWluYXInLFxyXG4gICAgZGVzY3JpcHRpb246XHJcbiAgICAgICdBbiBvdXQtb2YtYm94IFVJIHNvbHV0aW9uIGZvciBlbnRlcnByaXNlIGFwcGxpY2F0aW9ucyBhcyBhIFJlYWN0IGJvaWxlcnBsYXRlLicsXHJcbiAgICBpbWFnZVVSTDogJ2xvZ28uc3ZnJyxcclxuICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ09ORklHO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFByb2plY3RzXFxcXGxhbWluYXJcXFxcY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxsYW1pbmFyXFxcXGNsaWVudFxcXFx0YWlsd2luZC5jb25maWcubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Qcm9qZWN0cy9sYW1pbmFyL2NsaWVudC90YWlsd2luZC5jb25maWcubWpzXCI7aW1wb3J0IENPTkZJRyBmcm9tICcuL2NvbmZpZyc7XHJcblxyXG4vKiogQHR5cGUge2ltcG9ydCgndGFpbHdpbmRjc3MnKS5Db25maWd9ICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBjb250ZW50OiBbJy4vaW5kZXguaHRtbCcsICcuL3NyYy8qKi8qLntqcyx0cyxqc3gsdHN4fSddLFxyXG4gIHRoZW1lOiB7XHJcbiAgICBleHRlbmQ6IHtcclxuICAgICAgY29sb3JzOiB7XHJcbiAgICAgICAgcHJpbWFyeTogQ09ORklHLnRoZW1lLmFjY2VudENvbG9yLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtdLFxyXG59O1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdRLFNBQVMsb0JBQW9CO0FBQ3JTLE9BQU8sV0FBVztBQUNsQixPQUFPLGNBQWM7QUFDckIsT0FBTyxrQkFBa0I7QUFDekIsU0FBUyx3QkFBd0I7OztBQ0lqQyxJQUFNLFNBQVM7QUFBQSxFQUNiLFNBQVM7QUFBQSxFQUNULFVBQVU7QUFBQSxFQUNWLFdBQVc7QUFBQSxFQUNYLE9BQU87QUFBQSxJQUNMLGFBQWE7QUFBQSxJQUNiLGVBQWU7QUFBQSxJQUNmLGdCQUFnQjtBQUFBLEVBQ2xCO0FBQUEsRUFDQSxVQUFVO0FBQUEsSUFDUixPQUFPO0FBQUEsSUFDUCxhQUNFO0FBQUEsSUFDRixVQUFVO0FBQUEsRUFDWjtBQUNGO0FBRUEsSUFBTyxpQkFBUTs7O0FDdEJmLElBQU8sMEJBQVE7QUFBQSxFQUNiLFNBQVMsQ0FBQyxnQkFBZ0IsNEJBQTRCO0FBQUEsRUFDdEQsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ04sUUFBUTtBQUFBLFFBQ04sU0FBUyxlQUFPLE1BQU07QUFBQSxNQUN4QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTLENBQUM7QUFDWjs7O0FGTkEsU0FBUyxlQUFlO0FBR3hCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLGlCQUFpQjtBQUFBLE1BQ2YsUUFBUTtBQUFBLFFBQ04sTUFBTTtBQUFBLFVBQ0osT0FBTyxlQUFPO0FBQUEsVUFDZCxXQUFXLGVBQU8sU0FBUztBQUFBLFVBQzNCLGlCQUFpQixlQUFPLFNBQVM7QUFBQSxVQUNqQyxjQUFjLGVBQU8sU0FBUztBQUFBLFFBQ2hDO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsR0FBSSxlQUFPLFlBQ1A7QUFBQSxNQUNFLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxRQUNkLGVBQWUsQ0FBQyxVQUFVO0FBQUEsUUFDMUIsVUFBVTtBQUFBLFVBQ1IsTUFBTSxlQUFPO0FBQUEsVUFDYixZQUFZLGVBQU87QUFBQSxVQUNuQixhQUFhLGVBQU8sU0FBUztBQUFBLFVBQzdCLGFBQWEsZUFBTyxNQUFNO0FBQUEsVUFDMUIsT0FBTztBQUFBLFlBQ0w7QUFBQSxjQUNFLEtBQUs7QUFBQSxjQUNMLE9BQU87QUFBQSxjQUNQLE1BQU07QUFBQSxZQUNSO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGLENBQUM7QUFBQSxJQUNILElBQ0EsQ0FBQztBQUFBLEVBQ1A7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNQLFNBQVMsQ0FBQyxTQUFTLHVCQUFjLEdBQUcsWUFBWTtBQUFBLElBQ2xEO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sUUFBUTtBQUFBLEVBQ1Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
