import { useState } from "react";

export default function StopTimeline({ stops, color }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <div style={{ padding:"4px 0 8px" }}>
      {stops.map((stop, idx) => (
        <div key={stop.id} style={{ display:"flex", gap:0 }}>
          {/* Left axis */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:36, flexShrink:0 }}>
            {stop.walkFromPrev ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", paddingTop:4, paddingBottom:4 }}>
                <div style={{ width:1, height:10, background:`${color}30` }} />
                <span style={{ fontSize:10, color:"#8A7E72", whiteSpace:"nowrap", lineHeight:1.4, marginTop:2, marginBottom:2 }}>
                  {stop.walkFromPrev}
                </span>
                <div style={{ width:1, height:10, background:`${color}30` }} />
              </div>
            ) : (
              <div style={{ flex:1, width:1, background:`${color}30` }} />
            )}
            <div
              onClick={() => setExpanded(expanded === stop.id ? null : stop.id)}
              style={{
                width:22, height:22, borderRadius:"50%", background:color,
                display:"flex", alignItems:"center", justifyContent:"center",
                cursor:"pointer", flexShrink:0, zIndex:1,
                transition:"transform 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.2)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <span style={{ color:"#fff", fontSize:10, fontWeight:700, fontFamily:"sans-serif" }}>{idx + 1}</span>
            </div>
            {idx < stops.length - 1 && <div style={{ flex:1, width:1, background:`${color}30` }} />}
          </div>

          {/* Content */}
          <div style={{ flex:1, minWidth:0, paddingLeft:10, paddingBottom: idx < stops.length - 1 ? 0 : 0 }}>
            <div
              onClick={() => setExpanded(expanded === stop.id ? null : stop.id)}
              style={{ cursor:"pointer", padding:"6px 0", borderRadius:3, display:"flex", alignItems:"baseline", gap:8 }}
            >
              <div style={{ flex:1, minWidth:0 }}>
                <span style={{ fontSize:14, fontWeight:600, display:"block" }}>{stop.name}</span>
                <span style={{ fontSize:11, color:"#8A7E72" }}>{stop.typeIcon} {stop.type}</span>
              </div>
              <span style={{ fontSize:14, color:"#8A7E72", flexShrink:0 }}>
                {expanded === stop.id ? "−" : "+"}
              </span>
            </div>

            {expanded === stop.id && (
              <div style={{ animation:"slideDown 0.2s ease", paddingBottom:8 }}>
                <div style={{ fontSize:12, color:"#8A7E72", marginBottom:4 }}>📍 {stop.address}</div>
                <p style={{ fontSize:13, lineHeight:1.8, margin:0, color:"#1A1208" }}>{stop.description}</p>
                <div style={{
                  marginTop:6, padding:"4px 10px", background:`${color}10`,
                  borderLeft:`3px solid ${color}`, fontSize:12, fontWeight:600,
                  color, borderRadius:"0 3px 3px 0",
                }}>
                  ✦ {stop.highlight}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
