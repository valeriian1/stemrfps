import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
export default function Navbar({ onSignOut }: { onSignOut?: () => void }) {
  const mobileMenu = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    mobileMenu.current?.hidePopover();
  }, [pathname]);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 600px)");
    const close = () => {
      mobileMenu.current?.hidePopover();
      document.getElementById("account-panel")?.hidePopover();
    };
    query.addEventListener("change", close);
    return () => query.removeEventListener("change", close);
  }, []);
  const links = [
    {
      to: "/analyze",
      label: "Аналіз",
      path: "M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3M7 12h10m-5-5v10",
    },
    {
      to: "/diseases",
      label: "Довідник",
      path: "M12 5v16M12 5C9 3 5 3 3 4v15c3-1 6-1 9 2 3-3 6-3 9-2V4c-2-1-6-1-9 1Z",
    },
  ];
  return (
    <>
      <header className="mobile-header">
        <NavLink
          className="brand"
          to="/analyze"
          aria-label="Coursework — на головну"
        />
        <button
          className="mobile-menu-trigger"
          type="button"
          popoverTarget="mobile-menu"
          aria-label="Меню"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path
              d={menuOpen ? "M6 6l12 12M6 18 18 6" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </header>
      <div
        id="mobile-menu"
        ref={mobileMenu}
        className="mobile-menu-popover"
        popover="auto"
        onToggle={(event) => setMenuOpen(event.newState === "open")}
      >
        <nav aria-label="Мобільна навігація">
          {links.map(({ to, label, path }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => mobileMenu.current?.hidePopover()}
              className={({ isActive }) =>
                isActive ? "mobile-menu-item active" : "mobile-menu-item"
              }
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d={path} />
              </svg>
              {label}
            </NavLink>
          ))}
          <button className="mobile-menu-item" type="button">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M3 11a9 9 0 1 1 2.6 7.4M3 4v7h7m2-4v5l3 2" />
            </svg>
            Історія
          </button>
          <button
            className="mobile-menu-item"
            type="button"
            popoverTarget="account-panel"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
            </svg>
            Акаунт
          </button>
        </nav>
      </div>

      <aside className="site-header" aria-label="Бічна панель">
        <div className="header-inner">
          <NavLink
            className="brand"
            to={onSignOut ? "/analyze" : "/login"}
            aria-label="Coursework — на головну"
          />
          {onSignOut && (
            <>
              <nav aria-label="Основна навігація">
                {links.map(({ to, label, path }) => (
                  <NavLink
                    key={to}
                    to={to}
                    aria-label={label}
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d={path} />
                    </svg>
                    <span className="nav-tooltip">{label}</span>
                  </NavLink>
                ))}
                <button
                  className="nav-link history-trigger"
                  type="button"
                  aria-label="Історія"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 11a9 9 0 1 1 2.6 7.4M3 4v7h7m2-4v5l3 2" />
                  </svg>
                  <span className="nav-tooltip">Історія</span>
                </button>
              </nav>
              <button
                className="nav-link account-trigger"
                type="button"
                popoverTarget="account-panel"
                aria-label="Акаунт"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                </svg>
                <span className="nav-tooltip">Акаунт</span>
              </button>
            </>
          )}
        </div>
      </aside>
      <div
        id="account-panel"
        className="account-popover"
        popover="auto"
        role="dialog"
        aria-label="Акаунт"
      >
        <h2>Акаунт</h2>
        <button className="account-exit" type="button" onClick={onSignOut}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 4H4v16h5m5-12 4 4-4 4m-6-4h12" />
          </svg>
          Вийти
        </button>
      </div>
    </>
  );
}
