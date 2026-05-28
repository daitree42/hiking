import { useState, useEffect } from "react";
import "./data/storage";
import ExploreTab from "./components/ExploreTab";
import MyRoutesTab from "./components/MyRoutesTab";
import "./App.css";

export default function App() {
  const [tab, setTab] = useState("explore");
  const [savedCount, setSavedCount] = useState(0);

  async function refreshCount() {
    try {
      const { keys } = await window.storage.list("route:");
      setSavedCount(keys.length);
    } catch { setSavedCount(0); }
  }

  useEffect(() => { refreshCount(); }, [tab]);

  async function handleSave(route) {
    const entry = { route, source: "ai", savedAt: new Date().toISOString() };
    await window.storage.set(`route:${Date.now()}`, JSON.stringify(entry));
    setSavedCount(c => c + 1);
  }

  const activeTabStyle = { color:"#8B2020", borderBottomColor:"#8B2020" };

  return (
    <div className="app">
      <header style={{ textAlign:"center", padding:"36px 0 6px", borderBottom:"1px solid rgba(26,18,8,0.1)", marginBottom:0 }}>
        <h1 style={{ fontSize:22, fontWeight:700, letterSpacing:"0.06em", margin:0 }}>广州徒步</h1>
        <p style={{ fontSize:12, color:"#8A7E72", marginTop:1 }}>用脚步丈量两千年</p>
      </header>

      <nav style={{ display:"flex", borderBottom:"1px solid rgba(26,18,8,0.1)", marginBottom:24 }}>
        {["explore","mine"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex:1, padding:"13px 0 11px", background:"transparent", border:"none",
            borderBottom:`2px solid ${tab === t ? "#8B2020" : "transparent"}`,
            fontSize:13, fontFamily:"inherit", cursor:"pointer", transition:"all 0.25s",
            color: tab === t ? "#8B2020" : "#8A7E72",
            display:"flex", alignItems:"center", justifyContent:"center", gap:5,
          }}>
            {t === "explore" ? "探索线路" : "我的线路"}
            {t === "mine" && savedCount > 0 && (
              <span style={{
                display:"inline-flex", alignItems:"center", justifyContent:"center",
                minWidth:17, height:17, padding:"0 5px", borderRadius:9,
                background:"#8B2020", color:"#fff", fontSize:10, fontFamily:"sans-serif", fontWeight:600,
              }}>{savedCount}</span>
            )}
          </button>
        ))}
      </nav>

      <main>
        {tab === "explore" ? <ExploreTab onSave={handleSave} /> : <MyRoutesTab />}
      </main>

      <footer style={{ textAlign:"center", padding:"40px 0 0" }}>
        <a href="https://github.com/daitree42/hiking" target="_blank" rel="noopener"
          style={{ fontSize:11, color:"#8A7E72", textDecoration:"none" }}>
          GitHub
        </a>
      </footer>
    </div>
  );
}
