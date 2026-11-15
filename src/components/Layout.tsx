import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const onSignOut =
    location.pathname === "/login" ? undefined : () => navigate("/login");
  return (
    <div className={onSignOut ? "site-layout" : "site-layout auth-layout"}>
      <a className="skip-link" href="#main-content" tabIndex={0}>
        Перейти до вмісту
      </a>
      {onSignOut && <Navbar onSignOut={onSignOut} />}
      <div className="workspace-surface">
        <main id="main-content" className="site-main" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
