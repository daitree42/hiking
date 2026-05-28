import { useState } from "react";

export default function Timeline({ stops, color }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="timeline" style={{ "--tl-color": color || "#8B2020" }}>
      {stops.map((stop, idx) => (
        <div key={stop.id} className="tl-item">
          {/* 前一个站点到此站点的步行时间，显示在竖线中间 */}
          {idx > 0 && stop.walk && (
            <div className="tl-walk">
              <span className="tl-walk__text">步行 {stop.walk.replace(/.*?(\d+).*/, "$1")} 分钟</span>
            </div>
          )}

          <div className="tl-node">
            <div className="tl-marker" onClick={() => setExpanded(expanded === stop.id ? null : stop.id)}>
              <span className="tl-num">{idx + 1}</span>
            </div>

            <div className="tl-content">
              <div className="tl-header" onClick={() => setExpanded(expanded === stop.id ? null : stop.id)}>
                <div className="tl-name">{stop.name}</div>
                <div className="tl-type">{stop.typeIcon} {stop.type}</div>
                <span className="tl-toggle">{expanded === stop.id ? "−" : "+"}</span>
              </div>

              {expanded === stop.id && (
                <div className="tl-body">
                  <div className="tl-address">📍 {stop.address}</div>
                  <p className="tl-desc">{stop.description}</p>
                  <div className="tl-highlight">✦ {stop.highlight}</div>
                </div>
              )}
            </div>
          </div>

          {idx === stops.length - 1 && <div className="tl-tail" />}
        </div>
      ))}
    </div>
  );
}
