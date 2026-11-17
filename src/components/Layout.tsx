import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useState } from "react";
import type { AnalysisDraft } from "./analysisDraft";
export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<AnalysisDraft | null>(null);
  const onSignOut =
    location.pathname === "/login" ? undefined : () => {
      setDraft(null);
      navigate("/login");
    };
  return (
    <div className={onSignOut ? "site-layout" : "site-layout auth-layout"}>
      <a className="skip-link" href="#main-content" tabIndex={0}>
        Перейти до вмісту
      </a>
      {onSignOut && <Navbar onSignOut={onSignOut} />}
      <div className="workspace-surface">
        <main id="main-content" className="site-main" tabIndex={-1}>
          <Outlet context={{ draft, setDraft }} />
        </main>
      </div>
    </div>
  );
}
