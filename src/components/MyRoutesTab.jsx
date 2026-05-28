import { useState, useEffect } from "react";
import Timeline from "./Timeline";

export default function MyRoutesTab() {
  const [savedRoutes, setSavedRoutes] = useState([]);

  function refresh() {
    const list = window.storage?.list("route:") || [];
    setSavedRoutes(list);
  }

  useEffect(() => { refresh(); }, []);

  function handleDelete(key) {
    window.storage?.remove(key);
    refresh();
  }

  function handleExport(route) {
    const blob = new Blob([JSON.stringify(route, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${route.name || "route"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (savedRoutes.length === 0) {
    return (
      <div className="tab-content my-routes-tab">
        <div className="empty-state">
          <p>还没有保存的线路</p>
          <span>去探索一条吧</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content my-routes-tab">
      <h2 className="section__title">我的线路</h2>
      <div className="saved-list">
        {savedRoutes.map(({ key, data }) => {
          const route = data.route;
          const savedAt = data.savedAt ? new Date(data.savedAt).toLocaleDateString("zh-CN") : "";
          return (
            <div key={key} className="saved-item">
              <div className="saved-item__header">
                <h3 className="saved-item__name">{route.name}</h3>
                <span className={`saved-item__tag ${data.source === "ai" ? "tag--ai" : "tag--preset"}`}>
                  {data.source === "ai" ? "AI生成" : "精选"}
                </span>
              </div>
              <div className="saved-item__meta">
                <span>{route.distance}</span>
                <span className="dot">·</span>
                <span>{savedAt}</span>
              </div>
              <div className="saved-item__stops">
                <Timeline stops={route.stops} color={route.color || "#8B2020"} />
              </div>
              <div className="saved-item__actions">
                <button className="saved-item__btn saved-item__btn--export" onClick={() => handleExport(route)}>
                  导出 JSON
                </button>
                <button className="saved-item__btn saved-item__btn--delete" onClick={() => handleDelete(key)}>
                  删除
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
