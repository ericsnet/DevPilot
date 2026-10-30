import { useEffect, useState } from "react";
import { Github, ExternalLink, LoaderCircle, LockKeyhole, RefreshCw, Unplug } from "lucide-react";

type Props = { apiBase: string; language: "en" | "es" };
type Account = { login: string; name?: string | null; avatar_url?: string | null; html_url?: string | null };
type Repository = { id: number; name: string; full_name: string; description?: string | null; html_url: string; private: boolean; language?: string | null; stargazers_count: number; updated_at?: string; default_branch?: string };

const copy = {
  en: { title:"GitHub connection", desc:"Authorize DevPilot to read your public repositories.", connect:"Connect GitHub", connected:"Connected", disconnected:"Not connected", unavailable:"Backend not configured", retry:"Retry", disconnect:"Disconnect", loading:"Loading repositories…", empty:"No public repositories found.", repos:"Your public repositories", error:"Could not load GitHub data.", setup:"The GitHub OAuth app and backend URL must be configured by the server administrator.", private:"Private", public:"Public", updated:"Updated", stars:"stars", denied:"GitHub authorization was cancelled.", failed:"GitHub authorization failed. Check the server configuration.", invalid:"The OAuth response could not be validated." },
  es: { title:"Conexión con GitHub", desc:"Autoriza a DevPilot a consultar tus repositorios públicos.", connect:"Conectar GitHub", connected:"Conectado", disconnected:"Sin conectar", unavailable:"Backend sin configurar", retry:"Reintentar", disconnect:"Desconectar", loading:"Cargando repositorios…", empty:"No se han encontrado repositorios públicos.", repos:"Tus repositorios públicos", error:"No se han podido cargar los datos de GitHub.", setup:"El administrador debe configurar la aplicación OAuth de GitHub y la URL del backend.", private:"Privado", public:"Público", updated:"Actualizado", stars:"estrellas", denied:"Has cancelado la autorización de GitHub.", failed:"La autorización de GitHub ha fallado. Revisa la configuración del servidor.", invalid:"No se ha podido validar la respuesta OAuth." }
};

export default function GitHubIntegration({ apiBase, language }: Props) {
  const t = copy[language];
  const [account, setAccount] = useState<Account | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [configured, setConfigured] = useState(Boolean(apiBase));

  const base = apiBase.replace(/\/$/, "");
  const request = (path: string, init?: RequestInit) => fetch(base + path, { ...init, credentials:"include", headers:{ "Content-Type":"application/json", ...init?.headers } });

  async function refresh() {
    if (!base) { setConfigured(false); setLoading(false); return; }
    setLoading(true); setError("");
    try {
      const status = await request("/api/v1/integrations/github/status");
      if (!status.ok) throw new Error();
      const data = await status.json();
      setAccount(data.connected ? data.account : null);
      if (data.connected) {
        const repos = await request("/api/v1/integrations/github/repositories");
        if (!repos.ok) throw new Error();
        setRepositories((await repos.json()).repositories ?? []);
      } else setRepositories([]);
    } catch { setError(t.error); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get("github");
    if (result) {
      const message = result === "denied" ? t.denied : result === "failed" ? t.failed : result === "invalid" ? t.invalid : "";
      if (message) setError(message);
      params.delete("github");
      const clean = window.location.pathname + (params.size ? "?" + params.toString() : "") + window.location.hash;
      window.history.replaceState({}, "", clean);
    }
    void refresh();
  }, [apiBase, language]);

  async function disconnect() {
    setBusy(true); setError("");
    try {
      const response = await request("/api/v1/integrations/github/disconnect", { method:"POST" });
      if (!response.ok) throw new Error();
      setAccount(null); setRepositories([]);
    } catch { setError(t.error); }
    finally { setBusy(false); }
  }

  return <section className="github-panel">
    <div className="github-panel-head"><div className="github-title-icon"><Github size={21}/></div><div><h2>{t.title}</h2><p>{t.desc}</p></div><span className={"connection-pill "+(account?"connected":"")}>{account?t.connected:t.disconnected}</span></div>
    {!configured && <div className="github-notice"><LockKeyhole size={17}/><span>{t.setup}</span></div>}
    {error && <div className="github-error" role="alert">{error}</div>}
    {loading ? <div className="github-loading"><LoaderCircle size={17}/>{t.loading}</div> : account ? <>
      <div className="github-account">
        {account.avatar_url ? <img src={account.avatar_url} alt="" /> : <span className="github-avatar">{account.login.slice(0,1).toUpperCase()}</span>}
        <div><b>{account.name || account.login}</b><small>@{account.login}</small></div>
        <button className="github-action secondary" onClick={()=>void disconnect()} disabled={busy}><Unplug size={14}/>{t.disconnect}</button>
      </div>
      <div className="repo-heading"><b>{t.repos}</b><span>{repositories.length}</span></div>
      {repositories.length===0 ? <p className="github-empty">{t.empty}</p> : <div className="repo-list">{repositories.map(repo=><a className="repo-row" href={repo.html_url} target="_blank" rel="noreferrer" key={repo.id}><div className="repo-main"><b>{repo.name}</b><small>{repo.description || repo.full_name}</small><span>{repo.language || "—"} · {repo.stargazers_count} {t.stars}</span></div><span className="repo-visibility">{repo.private?t.private:t.public}</span><ExternalLink size={14}/></a>)}</div>}
    </> : <div className="github-connect-row"><div><b>{t.disconnected}</b><small>{configured?t.setup:t.unavailable}</small></div><button className="github-action" onClick={()=>{window.location.href=base+"/api/v1/integrations/github/connect";}} disabled={!configured||busy}><Github size={15}/>{t.connect}</button><button className="github-refresh" onClick={()=>void refresh()} aria-label={t.retry}><RefreshCw size={15}/></button></div>}
  </section>;
}
