import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { api, ApiError, refreshCsrf } from "./api";
import { Brand, Field, Icon } from "./components";
import { message } from "./format";
import { Workspace } from "./Workspace";
import "./App.css";

function App() {
  const [user, setUser] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const expire = useCallback(() => setUser(null), []);
  useEffect(() => {
    api<{ usuario: string }>("/sessao")
      .then((s) => setUser(s.usuario))
      .catch((e) => {
        if (!(e instanceof ApiError && e.status === 401)) setError(message(e));
      })
      .finally(() => setChecking(false));
  }, []);
  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      await refreshCsrf();
      await api("/login", {
        method: "POST",
        body: new URLSearchParams({
          username: String(form.get("usuario")),
          password: String(form.get("senha")),
        }),
      });
      await refreshCsrf();
      const session = await api<{ usuario: string }>("/sessao");
      setUser(session.usuario);
    } catch (err) {
      setError(message(err));
    } finally {
      setBusy(false);
    }
  }
  if (checking)
    return (
      <div className="loading" role="status">
        Conectando ao Financeiro…
      </div>
    );
  if (!user)
    return (
      <main className="login-page">
        <div className="login-story">
          <Brand />
          <div>
            <span className="eyebrow">CLAREZA PARA CADA ESCOLHA</span>
            <h1>
              Suas finanças,
              <br />
              em perspectiva.
            </h1>
            <p>
              Organize pessoas, acompanhe movimentos e tenha uma visão clara do
              seu dinheiro.
            </p>
          </div>
          <small>Sistema de gestão financeira · Projeto acadêmico</small>
        </div>
        <div className="login-panel">
          <form onSubmit={login}>
            <span className="eyebrow">BEM-VINDO AO SEU ESPAÇO</span>
            <h2>Acesse sua conta</h2>
            <p>Entre para gerenciar seus lançamentos.</p>
            {error && (
              <div className="alert error" role="alert">
                {error}
              </div>
            )}
            <Field label="Usuário">
              <input
                name="usuario"
                required
                autoComplete="username"
                autoFocus
              />
            </Field>
            <Field label="Senha">
              <input
                name="senha"
                type="password"
                required
                autoComplete="current-password"
              />
            </Field>
            <button className="primary" disabled={busy}>
              {busy ? "Entrando…" : "Entrar no sistema"} <Icon name="up" />
            </button>
            <small className="login-note">
              Credenciais da versão de teste no README do projeto.
            </small>
          </form>
        </div>
      </main>
    );
  return <Workspace user={user} expire={expire} />;
}
export default App;
