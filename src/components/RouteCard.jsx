import { useState } from "react";
import StopTimeline from "./Timeline";
import RouteMap from "./RouteMap";

export default function RouteCard({ route }) {
  const [expanded, setExpanded] = useState(false);
  const c = route.color || "#8B2020";

  return (
    <div style={{
      background: route.colorLight || "#FAF7F2",
      border: `1px solid ${c}20`,
      borderRadius: 6, overflow: "hidden",
      transition: "border-color 0.2s",
    }}
      onMouseEnter={e => { if (!expanded) e.currentTarget.style.borderColor = `${c}50`; }}
      onMouseLeave={e => { if (!expanded) e.currentTarget.style.borderColor = `${c}20`; }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        style={{ cursor:"pointer", padding:"16px 18px", display:"flex", gap:14, alignItems:"flex-start" }}
      >
        {/* Left color bar */}
        <div style={{ width:4, height:48, background:c, borderRadius:2, flexShrink:0, marginTop:2 }} />

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:15, fontWeight:700, marginBottom:1 }}>{route.name}</div>
          <div style={{ fontSize:12, color:"#8A7E72", marginBottom:4 }}>{route.subtitle}</div>
          <div style={{ display:"flex", gap:4, fontSize:11, color:"#8A7E72", marginBottom:6 }}>
            <span>{route.distance}</span><span style={{ opacity:0.3 }}>·</span>
            <span>{route.duration}</span><span style={{ opacity:0.3 }}>·</span>
            <span>{route.difficulty}</span>
          </div>
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            <span style={{ padding:"1px 7px", border:`1px solid ${c}30`, borderRadius:3, fontSize:11, color:"#8A7E72" }}>
              {route.startArea}
            </span>
            <span style={{ marginLeft:"auto", fontSize:11, color:"#8A7E72" }}>
              {route.previewIcons?.join(" ")}
            </span>
          </div>
        </div>

        <span style={{ fontSize:16, color:"#8A7E72", flexShrink:0, marginTop:4 }}>
          {expanded ? "−" : "+"}
        </span>
      </div>

      {expanded && (
        <div style={{ borderTop:`1px solid ${c}15`, padding:"0 0 16px" }}>
          <div style={{ margin:"0 0 12px" }}>
            <RouteMap stops={route.stops} color={c} />
          </div>
          <div style={{ padding:"0 18px" }}>
            <StopTimeline stops={route.stops} color={c} />
          </div>
        </div>
      )}
    </div>
  );
}
