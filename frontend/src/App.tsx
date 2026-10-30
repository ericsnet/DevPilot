import { useEffect, useMemo, useState } from "react";
import { Activity, Bot, Boxes, CheckCircle2, ChevronDown, Code2, ExternalLink, GitBranch, LayoutDashboard, ListTodo, Moon, Search, Settings2, ShieldCheck, Sun, Workflow } from "lucide-react";

type Theme = "dark" | "light";
type Language = "en" | "es";
type ApiState = "not-configured" | "checking" | "online" | "offline";

const labels = {
  en: {
    overview:"Overview", workspace:"Workspace", repos:"Repositories", projects:"Projects & tasks", analytics:"Analytics", security:"Security", assistant:"AI assistant", automation:"Automation", settings:"Settings",
    welcome:"Your development workspace", subtitle:"One place to understand, manage and improve your software projects.",
    build:"Foundation workspace", buildText:"The core interface is live. Connect the backend and integrations as they become available.",
    tasks:"Open tasks", audits:"Security findings", activity:"Recent activity", quick:"Get started", search:"Search sections…",
    apiConfigured:"API configured", apiNotConfigured:"API not connected", apiOnline:"API available", apiOffline:"API unreachable", checking:"Checking API…",
    coming:"Planned", noActivity:"No activity yet", noActivityText:"Repository events and project updates will appear here after the relevant integrations are enabled.",
    openRepo:"Explore the repository", openRepoText:"Review the source code and current implementation", docs:"API and project docs", docsText:"Documentation becomes available when the backend is running",
    status:"System status", frontend:"Frontend", deployed:"Published on GitHub Pages", backend:"Backend API", notConnected:"Not connected", version:"Foundation · v0.1.0",
    noResults:"No matching sections", noResultsText:"Try another search term.", overviewOnly:"This section is part of the roadmap and is not implemented yet."
  },
  es: {
    overview:"Resumen", workspace:"Espacio de trabajo", repos:"Repositorios", projects:"Proyectos y tareas", analytics:"Analíticas", security:"Seguridad", assistant:"Asistente IA", automation:"Automatización", settings:"Configuración",
    welcome:"Tu espacio de desarrollo", subtitle:"Un único lugar para comprender, gestionar y mejorar tus proyectos de software.",
    build:"Espacio Foundation", buildText:"La interfaz principal ya está publicada. El backend y las integraciones se conectarán a medida que se implementen.",
    tasks:"Tareas abiertas", audits:"Hallazgos de seguridad", activity:"Actividad reciente", quick:"Empieza por aquí", search:"Buscar secciones…",
    apiConfigured:"API configurada", apiNotConfigured:"API sin conectar", apiOnline:"API disponible", apiOffline:"API inaccesible", checking:"Comprobando API…",
    coming:"Previsto", noActivity:"Todavía no hay actividad", noActivityText:"Los eventos de repositorios y las actualizaciones de proyectos aparecerán aquí cuando se habiliten las integraciones.",
    openRepo:"Explorar el repositorio", openRepoText:"Consultar el código fuente y la implementación actual", docs:"API y documentación", docsText:"La documentación estará disponible cuando se ejecute el backend",
    status:"Estado del sistema", frontend:"Frontend", deployed:"Publicado en GitHub Pages", backend:"API del backend", notConnected:"Sin conectar", version:"Foundation · v0.1.0",
    noResults:"No hay secciones coincidentes", noResultsText:"Prueba con otro término.", overviewOnly:"Esta sección está prevista en la hoja de ruta, pero todavía no está implementada."
  }
};

export default function App() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [language, setLanguage] = useState<Language>("es");
  const [api, setApi] = useState<ApiState>("not-configured");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("overview");
  const t = labels[language];

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE_URL;
    if (!base) return;
    let cancelled = false;
    setApi("checking");
    fetch(base.replace(/\/$/, "") + "/health/live")
      .then(response => { if (!response.ok) throw new Error("API request failed"); if (!cancelled) setApi("online"); })
      .catch(() => { if (!cancelled) setApi("offline"); });
    return () => { cancelled = true; };
  }, []);

  const nav = useMemo(() => [
    { id:"overview", label:t.overview, Icon:LayoutDashboard },
    { id:"repos", label:t.repos, Icon:Code2 },
    { id:"projects", label:t.projects, Icon:ListTodo },
    { id:"analytics", label:t.analytics, Icon:Activity },
    { id:"security", label:t.security, Icon:ShieldCheck },
    { id:"assistant", label:t.assistant, Icon:Bot },
    { id:"automation", label:t.automation, Icon:Workflow }
  ], [t]);

  const filteredNav = nav.filter(item => item.label.toLowerCase().includes(query.toLowerCase()));
  const apiLabel = api === "checking" ? t.checking : api === "online" ? t.apiOnline : api === "offline" ? t.apiOffline : t.apiNotConfigured;

  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-icon"><Boxes size={19}/></span><b>devpilot<span>.</span></b><small>FOUNDATION</small></div>
      <div className="workspace"><span className="workspace-icon">D</span><div><b>DevPilot Workspace</b><small>Personal workspace</small></div><ChevronDown size={15}/></div>
      <p className="nav-label">{t.workspace}</p>
      <nav>{filteredNav.map(({id,label,Icon}) => <button key={id} title={id === "overview" ? label : t.overviewOnly} className={"nav-item " + (active===id?"active":"") + (id!=="overview"?" nav-disabled":"")} onClick={() => id==="overview" && setActive(id)}><Icon size={17}/><span>{label}</span>{id!=="overview" && <small className="nav-soon">{t.coming}</small>}</button>)}
        {filteredNav.length===0 && <div className="nav-empty">{t.noResults}</div>}
      </nav>
      <div className="sidebar-bottom">
        <button className="nav-item nav-disabled" title={t.overviewOnly}><Settings2 size={17}/><span>{t.settings}</span></button>
        <div className="user"><span className="avatar">E</span><div><b>DevPilot User</b><small>Workspace administrator</small></div></div>
      </div>
    </aside>
    <main className="main">
      <header className="topbar">
        <div className="crumb">{t.workspace} <span>/</span> <b>{t.overview}</b></div>
        <div className="top-actions">
          <label className="search"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search} aria-label={t.search}/>{query && <button className="clear-search" onClick={()=>setQuery("")} aria-label="Clear search">×</button>}</label>
          <button className="control" onClick={()=>setTheme(theme==="dark"?"light":"dark")} aria-label="Toggle theme">{theme==="dark"?<Sun size={16}/>:<Moon size={16}/>}</button>
          <button className="control lang" onClick={()=>setLanguage(language==="en"?"es":"en")} aria-label="Change language">{language.toUpperCase()}</button>
          <span className="avatar">E</span>
        </div>
      </header>
      <div className="content">
        <div className="welcome">
          <div><div className="eyebrow"><i/> DEVPILOT / WORKSPACE</div><h1>{t.welcome}</h1><p>{t.subtitle}</p></div>
          <span className="version"><GitBranch size={14}/> {t.version}</span>
        </div>
        <section className="banner"><span className="banner-icon"><CheckCircle2 size={20}/></span><div><b>{t.build}</b><p>{t.buildText}</p></div><small>V0.1.0</small></section>
        <section className="metrics">
          <article className="metric"><div><span>{t.repos}</span><Code2 size={17}/></div><strong>0</strong><small>{t.coming}</small></article>
          <article className="metric"><div><span>{t.tasks}</span><ListTodo size={17}/></div><strong>0</strong><small>{t.coming}</small></article>
          <article className="metric"><div><span>{t.audits}</span><ShieldCheck size={17}/></div><strong>0</strong><small>{t.coming}</small></article>
          <article className="metric"><div><span>{t.status}</span><Activity size={17}/></div><strong className="status-value">{api==="online"?"OK":api==="checking"?"…":"—"}</strong><small>{apiLabel}</small></article>
        </section>
        <section className="columns">
          <article className="panel"><div className="panel-head"><div><h2>{t.activity}</h2><p>Workspace events and system updates</p></div></div><div className="empty"><span><Activity size={22}/></span><b>{t.noActivity}</b><small>{t.noActivityText}</small></div></article>
          <article className="panel"><div className="panel-head"><div><h2>{t.quick}</h2><p>Useful project links</p></div></div>
            <a className="quick quick-link" href="https://github.com/ericsnet/DevPilot" target="_blank" rel="noreferrer"><span><GitBranch size={17}/></span><div><b>{t.openRepo}</b><small>{t.openRepoText}</small></div><ExternalLink size={15}/></a>
            <a className="quick quick-link" href="https://github.com/ericsnet/DevPilot/tree/main/docs" target="_blank" rel="noreferrer"><span><Code2 size={17}/></span><div><b>{t.docs}</b><small>{t.docsText}</small></div><ExternalLink size={15}/></a>
            <div className="quick"><span><Activity size={17}/></span><div><b>{t.backend}</b><small>{apiLabel}</small></div><em className={"api-dot "+api}/></div>
          </article>
        </section>
        <footer><span>DEVPILOT · FOUNDATION SCAFFOLD</span><span className={"api "+api}><i/>{apiLabel}</span></footer>
      </div>
    </main>
  </div>;
}
