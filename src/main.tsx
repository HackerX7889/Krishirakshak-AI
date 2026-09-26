import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { HashRouter } from "react-router-dom"
import "./index.css"
import App from "./App.tsx"
import { LanguageProvider } from "./contexts/LanguageContext"
import { AuthProvider } from "./contexts/AuthContext"
import { ToastProvider } from "./contexts/ToastContext"

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {})
  })
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  </StrictMode>,
)
