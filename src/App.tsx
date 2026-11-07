import { useState } from "react";
import { AudioLines, CalendarDays, ChevronDown, Clock3, Copy, FileText, LayoutDashboard, Mic2, Moon, Plus, Settings, Sparkles, Subtitles, WandSparkles, Image as ImageIcon, PencilLine, Trash2, Menu, Check } from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Script Writer", icon: WandSparkles },
  { label: "Voice Generator", icon: Mic2 },
  { label: "Title & SEO Box", icon: PencilLine },
  { label: "Thumbnail", icon: ImageIcon },
  { label: "Scenes", icon: CalendarDays },
  { label: "Settings", icon: Settings },
];

export default function App() {
  const [active, setActive] = useState("Script Writer");
  const [prompt, setPrompt] = useState("");
  const [scriptType, setScriptType] = useState("Standard Video (5–8 min)");
  const [tone, setTone] = useState("Educational");
  const [script, setScript] = useState("");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [mobileNav, setMobileNav] = useState(false);

  async function copyScript() {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Clipboard access was blocked. Select the script and copy it manually.");
    }
  }

  async function generateScript() {
    if (!prompt.trim()) {
      setError("Enter a video topic or idea before generating.");
      return;
    }
    setGenerating(true);
    setError("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: prompt, scriptType, tone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Script generation failed.");
      if (typeof data.script !== "string" || !data.script.trim()) throw new Error("The AI returned an empty script. Please try again.");
      setScript(data.script);
      setHistory((items) => [prompt.replace(/\n/g, " ").slice(0, 42), ...items].slice(0, 8));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand"><div className="brand-mark"><Subtitles size={21} strokeWidth={2.6} /></div><div><strong>FACELESS AI STUDIO</strong><span>AI Video Creation</span></div></div>
        <button className="new-chat" onClick={() => { setPrompt(""); setScript(""); setError(""); }}><Plus size={15} /> New Chat</button>
        <nav className="nav-list">{navigation.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${active === label ? "active" : ""}`} onClick={() => { setActive(label); setMobileNav(false); }}><Icon size={16} strokeWidth={1.8}/><span>{label}</span></button>)}</nav>
        <div className="history"><div className="history-label">CHAT HISTORY</div><div className="history-day">TODAY</div>{history.map((item,i)=><button className="history-item" key={i} title={item}><span className="history-dot"/>{item}</button>)}</div>
        <div className="account-card"><div className="account-top"><div className="avatar"><Moon size={17}/></div><div><strong>Nova AI Pro</strong><span className="active-pill">ACTIVE</span></div></div><button className="manage-plan">Manage Plan</button></div>
      </aside>
      <main className="main-area">
        <header className="mobile-header"><button onClick={()=>setMobileNav(!mobileNav)}><Menu size={20}/></button><span>FACELESS AI STUDIO</span></header>
        <div className="workspace">
          <div className="page-heading"><div className="heading-icon"><AudioLines size={20}/></div><h1>AI Script Writer</h1></div>
          <div className="script-layout">
            <section className="settings-panel">
              <label className="field-label" htmlFor="video-prompt">1. ENTER VIDEO PROMPT / IDEA (CHAT AI)</label>
              <div className="prompt-wrap"><textarea id="video-prompt" value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Describe the video you want to create..."/><Sparkles className="prompt-sparkle" size={17}/></div>
              <label className="field-label select-label" htmlFor="script-type">2. WHICH TYPE OF SCRIPT?</label>
              <div className="select-wrap"><select id="script-type" value={scriptType} onChange={e=>setScriptType(e.target.value)}><option>Short Video (30–60 sec)</option><option>Standard Video (5–8 min)</option><option>Long Video (10–15 min)</option><option>Custom Length</option></select><ChevronDown size={16}/></div>
              <label className="field-label tone-label">3. WHICH STYLE TONE?</label>
              <div className="tone-grid">{["Educational","Cinematic","Humorous","Creepy"].map(item=><button key={item} className={`tone-button ${tone===item?"selected":""}`} onClick={()=>setTone(item)}>{item}</button>)}</div>
              <button className="generate-button" onClick={generateScript} disabled={generating}><Sparkles size={16}/>{generating?"Writing your script…":"Generate Script"}</button>
              {error&&<div className="generation-error" role="alert">{error}</div>}
            </section>
            <section className="editor-panel">
              <div className="editor-toolbar"><label htmlFor="generated-script">Generated Script (Editable)</label><div className="editor-actions"><button className="clear-button" onClick={()=>setScript("")}><Trash2 size={12}/> Clear</button><button className="copy-button" onClick={copyScript}>{copied?<Check size={12}/>:<Copy size={12}/>} {copied?"Copied!":"Copy Script"}</button></div></div>
              <textarea id="generated-script" className="script-editor" value={script} onChange={e=>setScript(e.target.value)} placeholder="Your AI-generated script will appear here. You can edit it freely..." spellCheck/>
              <div className="editor-footer"><span><FileText size={12}/> {script.trim()?script.trim().split(/\s+/).length:0} words</span><span><Clock3 size={12}/> ~{Math.max(1,Math.ceil((script.trim()?script.trim().split(/\s+/).length:0)/130)} min read</span></div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}