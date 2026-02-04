import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home.tsx";
import UserPage from "./pages/UserPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import AppLayout from "./pages/AppLayout.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/user/:steamid" element={<UserPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);
