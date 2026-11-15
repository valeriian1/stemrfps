import { useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { ErrorNotice } from "../components/WheatUI";

export default function LoginPage() {
  const navigate = useNavigate();
  const [register, setRegister] = useState(false);
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const login = String(fields.get("login")).trim().toLowerCase();
    const password = String(fields.get("password"));
    setError("");
    if (login.length < 3 || login.length > 64) {
      setError("Логін має містити від 3 до 64 символів.");
      return;
    }
    if (register && password !== fields.get("confirmation")) {
      setError("Паролі не збігаються.");
      return;
    }
    navigate("/analyze");
  }

  return (
    <div className="page-stack login-page">
      <header className="page-heading">
        <h1>{register ? "Зареєструватися" : "Увійти"}</h1>
        <p>
          {register
            ? "Оберіть логін і пароль."
            : "Увійдіть, щоб перейти до аналізу фото пшениці."}
        </p>
      </header>
      <form className="panel form-stack" onSubmit={submit}>
        <label>
          Логін
          <input
            name="login"
            required
            minLength={3}
            maxLength={64}
            autoComplete="username"
            autoCapitalize="none"
          />
        </label>
        <label>
          Пароль
          <input
            name="password"
            type="password"
            required
            minLength={8}
            maxLength={128}
            autoComplete={register ? "new-password" : "current-password"}
          />
        </label>
        {register && (
          <>
            <p className="muted">Пароль має містити щонайменше 8 символів.</p>
            <label>
              Повторіть пароль
              <input
                name="confirmation"
                type="password"
                required
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
              />
            </label>
          </>
        )}
        {error && <ErrorNotice>{error}</ErrorNotice>}
        <div className="auth-actions">
          <button className="button primary" type="submit">
            {register ? "Зареєструватися" : "Увійти"}
          </button>
          <button
            className="button secondary"
            type="button"
            onClick={() => {
              setRegister(!register);
              setError("");
            }}
          >
            {register ? "Уже маю обліковий запис" : "Створити обліковий запис"}
          </button>
        </div>
      </form>
    </div>
  );
}
