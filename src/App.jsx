import { useState, useEffect } from "react";
import "./data/storage";
import ExploreTab from "./components/ExploreTab";
import MyRoutesTab from "./components/MyRoutesTab";
import "./App.css";

export default function App() {
  const [tab, setTab] = useState("explore");
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const list = window.storage?.list("route:") || [];
    setSavedCount(list.length);
  }, [tab]);

  function handleSave(route) {
    const key = `route:${Date.now()}`;
    window.storage?.set(key, {
      route,
      source: "ai",
      savedAt: Date.now(),
    });
    setSavedCount((c) => c + 1);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">广州徒步</h1>
        <p className="app-subtitle">用脚步丈量两千年</p>
      </header>

      <nav className="tabs">
        <button
          className={`tab ${tab === "explore" ? "tab--active" : ""}`}
          onClick={() => setTab("explore")}
        >
          探索线路
        </button>
        <button
          className={`tab ${tab === "mine" ? "tab--active" : ""}`}
          onClick={() => setTab("mine")}
        >
          我的线路
          {savedCount > 0 && <span className="tab__badge">{savedCount}</span>}
        </button>
      </nav>

      <main className="app-main">
        {tab === "explore" ? (
          <ExploreTab onSave={handleSave} />
        ) : (
          <MyRoutesTab onTabChange={setTab} />
        )}
      </main>

      <footer className="app-footer">
        <a href="https://github.com/daitree42/hiking" target="_blank" rel="noopener">GitHub</a>
      </footer>
    </div>
  );
}
