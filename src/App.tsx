import { useState } from "react";
import {
  AudioLines, BookOpen, CalendarDays, Camera, ChevronDown, Clock3, Copy,
  FileText, LayoutDashboard, Mic2, Moon, Plus, Settings, Sparkles,
  Subtitles, WandSparkles, Image as ImageIcon, PencilLine, Trash2,
  PanelLeftClose, Menu, Check
} from "lucide-react";

type NavItem = { label: string; icon: typeof LayoutDashboard };

const navigation: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Script Writer", icon: WandSparkles },
  { label: "Voice Generator", icon: Mic2 },
  { label: "Title & SEO Box", icon: PencilLine },
  { label: "Thumbnail", icon: ImageIcon },
  { label: "Scenes", icon: CalendarDays },
  { label: "Settings", icon: Settings },
];

const sampleScript = `[HOOK]
(Upbeat background music starts. The host, a lively educator, appears on screen with a fun animation of a moon behind them.)

Host: "Hey there, little adventurers! Are you ready for a magical journey to dreamland?"

[MAIN CONTENT]
(Animation of a spaceship lands on the moon, and the host starts to tell the story.)

Host: "Once upon a time, in a world far, far away, there was a magical moon that glowed with a soft, silvery light. The moon loved to tell stories to the stars and planets, and tonight, it had a special tale to share with you!"

(The animation shows the moon speaking to the stars and planets, who gather around to listen.)

Host: "The moon told the story of the moonflowers that bloomed only on the quietest nights..."`;

export default function App() {
  const [active, setActive] = useState("Script Writer");
  const [prompt, setPrompt] = useState("Silly Sleepytime Songs for Crazy Kids\nI want a kids lullaby story");
  const [scriptType, setScriptType] = useState("Standard Video (5–8 min)");
  const [tone, setTone] = useState("Educational");
  const [script, setScript] = useState(sampleScript);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>(["Sleepytime songs for kids"]);
  const [mobileNav, setMobileNav] = useState(false);

  async function copyScript() {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  function generateScript() {
    const topic = prompt.trim() || "your video topic";
    setScript(`[HOOK]\n\n(Opening shot: a warm, inviting scene. Music fades in.)\n\nHost: "Have you ever wondered about ${topic.replace(/\n/g, " ")}? Today, we're breaking it down in a simple, practical way—and by the end, you'll know exactly where to start."\n\n[MAIN CONTENT]\n\nHost: "Let's begin with the basics. First, understand the idea and why it matters. Then, take one small step you can put into practice today. Remember, progress comes from trying, learning, and improving—not from getting everything perfect on the first attempt."\n\nHost: "Here is a simple way to put this into action: choose one thing from today's lesson, test it for yourself, and notice what works. Keep it realistic, keep it consistent, and build from there."\n\n[OUTRO]\n\nHost: "Thanks for spending these few minutes with me! If this helped you, share it with someone who might need it. I'll see you in the next video."`);
    setHistory((items) => [topic.replace(/\n/g, " ").slice(0, 42), ...items].slice(0, 8));
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Subtitles size={21} strokeWidth={2.6} /></div>
          <div><strong>FACELESS AI STUDIO</strong><span>AI Video Creation</span></div>
        </div>
        <button className="new-chat" onClick={() => { setPrompt(""); setScript(""); }}><Plus size={15} /> New Chat</button>
        <nav className="nav-list">
          {navigation.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${active === label ? "active" : ""}`} onClick={() => { setActive(label); setMobileNav(false); }}>
              <Icon size={16} strokeWidth={1.8} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="history">
          <div className="history-label">CHAT HISTORY</div>
          <div className="history-day">TODAY</div>
          {history.map((item, i) => <button className="history-item" key={i} title={item}><span className="history-dot" />{item}</button>)}
        </div>
        <div className="account-card">
          <div className="account-top"><div className="avatar"><Moon size={17} /></div><div><strong>Nova AI Pro</strong><span className="active-pill">ACTIVE</span></div></div>
          <button className="manage-plan">Manage Plan</button>
        </div>
      </aside>

      <main className="main-area">
        <header className="mobile-header"><button onClick={() => setMobileNav(!mobileNav)}><Menu size={20}/></button><span>FACELESS AI STUDIO</span></header>
        <div className="workspace">
          <div className="page-heading"><div className="heading-icon"><AudioLines size={20}/></div><h1>AI Script Writer</h1></div>
          <div className="script-layout">
            <section className="settings-panel">
              <label className="field-label" htmlFor="video-prompt">1. ENTER VIDEO PROMPT / IDEA (CHAT AI)</label>
              <div className="prompt-wrap">
                <textarea id="video-prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the video you want to create..." />
                <Sparkles className="prompt-sparkle" size={17}/>
              </div>
              <label className="field-label select-label" htmlFor="script-type">2. WHICH TYPE OF SCRIPT?</label>
              <div className="select-wrap"><select id="script-type" value={scriptType} onChange={(e) => setScriptType(e.target.value)}><option>Short Video (30–60 sec)</option><option>Standard Video (5–8 min)</option><option>Long Video (10–15 min)</option><option>Custom Length</option></select><ChevronDown size={16}/></div>
              <label className="field-label tone-label">3. WHICH STYLE TONE?</label>
              <div className="tone-grid">
                {["Educational", "Cinematic", "Humorous", "Creepy"].map((item) => <button key={item} className={`tone-button ${tone === item ? "selected" : ""}`} onClick={() => setTone(item)}>{item}</button>)}
              </div>
              <button className="generate-button" onClick={generateScript}><Sparkles size={16}/> Generate Script</button>
            </section>

            <section className="editor-panel">
              <div className="editor-toolbar"><label htmlFor="generated-script">Generated Script (Editable)</label><div className="editor-actions"><button className="clear-button" onClick={() => setScript("")}><Trash2 size={12}/> Clear</button><button className="copy-button" onClick={copyScript}>{copied ? <Check size={12}/> : <Copy size={12}/>} {copied ? "Copied!" : "Copy Script"}</button></div></div>
              <textarea id="generated-script" className="script-editor" value={script} onChange={(e) => setScript(e.target.value)} placeholder="Your generated script will appear here. You can edit it freely..." spellCheck/>
              <div className="editor-footer"><span><FileText size={12}/> {script.trim() ? script.trim().split(/\s+/).length : 0} words</span><span><Clock3 size={12}/> ~{Math.max(1, Math.ceil((script.trim() ? script.trim().split(/\s+/).length : 0) / 130))} min read</span></div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}