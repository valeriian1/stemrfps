import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import AnalyzePage from "./pages/AnalyzePage";
import DiseasePage from "./pages/DiseasePage";
import DiseasesPage from "./pages/DiseasesPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="analyze" element={<AnalyzePage />} />
          <Route path="history" element={<Navigate to="/analyze" replace />} />
          <Route path="diseases" element={<DiseasesPage />} />
          <Route path="diseases/:diseaseId" element={<DiseasePage />} />
          <Route
            path="*"
            element={
              <div className="empty">
                <h1>Сторінку не знайдено</h1>
                <Link to="/analyze">Перейти до аналізу</Link>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
