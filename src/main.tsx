import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

if (import.meta.env.PROD) {
  import("./registerServiceWorker").then(mod => {
    mod.registerServiceWorker();
  });
}
