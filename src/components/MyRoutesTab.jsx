import { useState, useEffect } from "react";
import SectionLabel from "./SectionLabel";
import StopTimeline from "./Timeline";

export default function MyRoutesTab() {
  const [items, setItems] = useState(null); // null = loading, [] = empty

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { keys } = await window.storage.list("route:");
        const result = [];
        for (const k of keys) {
          try {
            const r = await window.storage.get(k);
            if (r && r.value) result.push({ storageKey: k, ...r.value });
          } catch {}
        }
        result.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
        if (!cancelled) setItems(result);
      } catch {
        if (!cancelled) setItems([]);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (items === null) {
    return (
      <div style={{ textAlign:"center", padding:"80px 20px", color:"#8A7E72" }}>
        <p style={{ fontSize:15 }}>加载中…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ textAlign:"center", padding:"80px 20px", color:"#8A7E72" }}>
        <p style={{ fontSize:15, margin:"0 0 4px" }}>还没有保存的线路</p>
        <span style={{ fontSize:13 }}>去探索一条吧</span>
      </div>
    );
  }

  async function handleDelete(key) {
    await window.storage.delete(key);
    setItems(prev => prev.filter(i => i.storageKey !== key));
  }

  function handleExport(route) {
    const blob = new Blob([JSON.stringify(route, null, 2)], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${route.name || "route"}.json`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <SectionLabel>我的线路</SectionLabel>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {items.map(item => {
          const route = item.route || item;
          const savedAt = item.savedAt ? new Date(item.savedAt).toLocaleDateString("zh-CN") : "";
          const source = item.source || "ai";
          const c = route.color || "#8B2020";
          return (
            <div key={item.storageKey} style={{ background:"#FAF7F2", border:"1px solid rgba(26,18,8,0.1)", borderRadius:6, overflow:"hidden" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px 0" }}>
                <h3 style={{ fontSize:15, fontWeight:700, margin:0 }}>{route.name}</h3>
                <span style={{
                  fontSize:10, padding:"2px 7px", borderRadius:3, fontWeight:600, fontFamily:"sans-serif",
                  ...(source === "ai" ? { background:`${c}12`, color:c } : { background:"rgba(26,18,8,0.06)", color:"#8A7E72" }),
                }}>
                  {source === "ai" ? "AI生成" : "精选"}
                </span>
              </div>
              <div style={{ display:"flex", gap:4, fontSize:11, color:"#8A7E72", padding:"4px 16px 0" }}>
                <span>{route.distance}</span><span style={{ opacity:0.3 }}>·</span><span>{savedAt}</span>
              </div>
              <div style={{ padding:"2px 16px 8px", marginTop:4 }}>
                <StopTimeline stops={route.stops || []} color={c} />
              </div>
              <div style={{ display:"flex", gap:8, justifyContent:"flex-end", padding:"0 16px 14px" }}>
                <button onClick={() => handleExport(route)} style={{
                  padding:"5px 12px", background:"transparent", border:"1px solid rgba(26,18,8,0.12)",
                  borderRadius:4, fontSize:12, fontFamily:"inherit", cursor:"pointer", color:"#1A1208",
                }}>导出 JSON</button>
                <button onClick={() => handleDelete(item.storageKey)} style={{
                  padding:"5px 12px", background:"transparent", border:"1px solid rgba(26,18,8,0.12)",
                  borderRadius:4, fontSize:12, fontFamily:"inherit", cursor:"pointer", color:"#c62828",
                }}>删除</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
