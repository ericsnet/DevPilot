import { useEffect, useState } from "react";
import { Activity, Bot, Boxes, CheckCircle2, ChevronDown, Code2, GitBranch, LayoutDashboard, ListTodo, Moon, Search, Settings2, ShieldCheck, Sun, Workflow } from "lucide-react";

type Theme = "dark" | "light";
type Language = "en" | "es";

const labels = {
  en: { overview:"Overview", workspace:"Workspace", repos:"Repositories", projects:"Projects & tasks", analytics:"Analytics", security:"Security", assistant:"AI assistant", automation:"Automation", settings:"Settings", welcome:"Your development workspace", subtitle:"One place to understand, manage and improve your software projects.", build:"Foundation workspace", buildText:"Your DevPilot workspace is ready for the next implementation phase.", tasks:"Open tasks", audits:"Security findings", activity:"Recent activity", quick:"Quick actions", connect:"Connect a repository", plan:"Create a project", ask:"Ask the AI assistant", search:"Search DevPilot…", online:"API online", offline:"API unavailable", checking:"Checking API…", ready:"Infrastructure status", coming:"Coming in a future phase" },
  es: { overview:"Resumen", workspace:"Espacio de trabajo", repos:"Repositorios", projects:"Proyectos y tareas", analytics:"Analíticas", security:"Seguridad", assistant:"Asistente IA", automation:"Automatización", settings:"Configuración", welcome:"Tu espacio de desarrollo", subtitle:"Un único lugar para comprender, gestionar y mejorar tus proyectos de software.", build:"Espacio Foundation", buildText:"Tu espacio DevPilot está preparado para la siguiente fase de implementación.", tasks:"Tareas abiertas", audits:"Hallazgos de seguridad", activity:"Actividad reciente", quick:"Acciones rápidas", connect:"Conectar repositorio", plan:"Crear proyecto", ask:"Preguntar al asistente IA", search:"Buscar en DevPilot…", online:"API disponible", offline:"API no disponible", checking:"Comprobando API…", ready:"Estado de infraestructura", coming:"Disponible en una fase futura" }
};

export default function App() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [language, setLanguage] = useState<Language>("en");
  const [api, setApi] = useState<"checking"|"online"|"offline">("checking");
  const t = labels[language];
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => {
    fetch((import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000") + "/health/live")
      .then(r => { if (!r.ok) throw new Error(); setApi("online"); })
      .catch(() => setApi("offline"));
  }, []);
  const nav = [[t.overview, LayoutDashboard], [t.repos, Code2], [t.projects, ListTodo], [t.analytics, Activity], [t.security, ShieldCheck], [t.assistant, Bot], [t.automation, Workflow]] as const;
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-icon"><Boxes size={19}/></span><b>devpilot<span>.</span></b><small>FOUNDATION</small></div>
      <div className="workspace"><span className="workspace-icon">D</span><div><b>DevPilot Workspace</b><small>Personal workspace</small></div><ChevronDown size={15}/></div>
      <p className="nav-label">{t.workspace}</p>
      <nav>{nav.map(([label, Icon], i) => <button className={"nav-item " + (i===0?"active":"")} key={label}><Icon size={17}/><span>{label}</span></button>)}</nav>
      <div className="sidebar-bottom">
        <button className="nav-item"><Settings2 size={17}/><span>{t.settings}</span></button>
        <div className="user"><span className="avatar">E</span><div><b>DevPilot User</b><small>Workspace administrator</small></div></div>
      </div>
    </aside>
    <main className="main">
      <header className="topbar">
        <div className="crumb">Workspace <span>/</span> <b>{t.overview}</b></div>
        <div className="top-actions">
          <label className="search"><Search size={15}/><input placeholder={t.search}/></label>
          <button className="control" onClick={()=>setTheme(theme==="dark"?"light":"dark")} aria-label="Toggle theme">{theme==="dark"?<Sun size={16}/>:<Moon size={16}/>}</button>
          <button className="control lang" onClick={()=>setLanguage(language==="en"?"es":"en")}>{language.toUpperCase()}</button>
          <span className="avatar">E</span>
        </div>
      </header>
      <div className="content">
        <div className="welcome">
          <div><div className="eyebrow"><i/> DEVPILOT / WORKSPACE</div><h1>{t.welcome}</h1><p>{t.subtitle}</p></div>
          <span className="version"><GitBranch size={14}/> Foundation · v0.1.0</span>
        </div>
        <section className="banner"><span className="banner-icon"><CheckCircle2 size={20}/></span><div><b>{t.build}</b><p>{t.buildText}</p></div><small>IN PROGRESS</small></section>
        <section className="metrics">
          {[[t.repos,"—",t.coming,Code2],[t.tasks,"—",t.coming,ListTodo],[t.audits,"—",t.coming,ShieldCheck],[t.ready,api==="checking"?"…":api==="online"?"Online":"Offline",api==="checking"?t.checking:api==="online"?t.online:t.offline,Activity]].map(([name,value,note,Icon]) => {
            const I = Icon as typeof Activity;
            return <article className="metric" key={name as string}><div><span>{name as string}</span><I size={17}/></div><strong>{value as string}</strong><small>{note as string}</small></article>;
          })}
        </section>
        <section className="columns">
          <article className="panel"><div className="panel-head"><div><h2>{t.activity}</h2><p>Workspace events and system updates</p></div></div><div className="empty"><span><Activity size={22}/></span><b>No activity yet</b><small>Connect a repository to start seeing development activity here.</small></div></article>
          <article className="panel"><div className="panel-head"><div><h2>{t.quick}</h2><p>Get started with DevPilot</p></div></div>
            {[[t.connect,"GitHub integration",GitBranch],[t.plan,"Project management",ListTodo],[t.ask,"AI Gateway",Bot]].map(([title,sub,Icon])=>{const I=Icon as typeof Bot;return <div className="quick" key={title as string}><span><I size={17}/></span><div><b>{title as string}</b><small>{sub as string} · {t.coming}</small></div><em>↗</em></div>;})}
          </article>
        </section>
        <footer><span>DEVPILOT · Foundation scaffold</span><span className={"api " + api}><i/>{api==="checking"?t.checking:api==="online"?t.online:t.offline}</span></footer>
      </div>
    </main>
  </div>;
}
