/**
 * main.tsx
 * 애플리케이션 진입점
 * React 앱을 DOM에 렌더링하는 역할
 */

import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

/**
 * root 엘리먼트에 React 앱 마운트
 */
createRoot(document.getElementById("root")!).render(<App />);
