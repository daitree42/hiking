import { useState } from "react";

const SYSTEM_PROMPT = `你是广州徒步路线设计专家，熟悉广州所有历史景点、寺庙、宗祠、地标建筑。
根据用户偏好，设计一条广州徒步线路，要求：
- 总距离不超过10公里
- 4到8个途经点
- 以有文化价值的景点为主：寺庙、宗祠、历史建筑、考古遗址、历史街区等

只返回JSON，不要任何其他文字，格式如下：
{
  "name": "路线名（10字内）",
  "subtitle": "一句话描述",
  "distance": "X.X km",
  "duration": "约X小时",
  "difficulty": "轻松/中等",
  "color": "#十六进制",
  "stops": [
    {
      "id": 1,
      "name": "景点名",
      "type": "类型标签",
      "typeIcon": "一个emoji",
      "address": "地址",
      "description": "80-120字历史介绍",
      "highlight": "核心亮点",
      "walkFromPrev": "步行X分钟（第一站为空）",
      "lat": 23.1234,
      "lng": 113.1234
    }
  ]
}
坐标要使用真实地点的经纬度，lat 纬度（广州约23.1），lng 经度（广州约113.2）。`;

function parseRoute(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  return JSON.parse(jsonMatch[0]);
}

export default function AiGenerator({ onSave }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setPreview(null);
    try {
      const res = await fetch("https://lingering-dream-748d.fuyrenoiu.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `用户偏好：${prompt}` }],
        }),
      });
      if (!res.ok) throw new Error(`请求失败 (${res.status})`);
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      const route = parseRoute(text);
      if (!route) throw new Error("无法解析返回结果");
      setPreview(route);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!preview) return;
    await onSave(preview);
    setPreview(null);
    setPrompt("");
  }

  return (
    <div style={{ background:"#FAF7F2", border:"1px solid rgba(26,18,8,0.1)", borderRadius:6, padding:18 }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:"#8B2020", marginBottom:2 }}>AI 定制路线</div>
      <p style={{ fontSize:12, color:"#8A7E72", margin:"0 0 10px" }}>描述你的偏好，自动生成一条专属路线</p>

      <div style={{ display:"flex", gap:8 }}>
        <input
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleGenerate()}
          disabled={loading}
          placeholder="例如：我想看寺庙和古建筑，从荔湾出发"
          style={{
            flex:1, padding:"9px 12px", border:"1px solid rgba(26,18,8,0.12)", borderRadius:4,
            fontSize:13, fontFamily:"inherit", background:"#F5F0E8", color:"#1A1208", outline:"none",
          }}
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          style={{
            padding:"9px 20px", background:"#8B2020", color:"#fff", border:"none", borderRadius:4,
            fontSize:13, fontFamily:"inherit", fontWeight:600, cursor:"pointer", whiteSpace:"nowrap",
            opacity: (loading || !prompt.trim()) ? 0.35 : 1,
          }}
        >
          {loading ? "生成中…" : "生成"}
        </button>
      </div>

      {error && <p style={{ color:"#c62828", fontSize:12, marginTop:8 }}>⚠ {error}</p>}

      {preview && (
        <div style={{ marginTop:14, padding:14, background:"#F5F0E8", border:"1px solid rgba(26,18,8,0.1)", borderRadius:6 }}>
          <div style={{ fontSize:15, fontWeight:700 }}>{preview.name}</div>
          <div style={{ fontSize:12, color:"#8A7E72", marginTop:1 }}>{preview.subtitle}</div>
          <div style={{ display:"flex", gap:4, fontSize:11, color:"#8A7E72", marginTop:4 }}>
            <span>{preview.distance}</span><span style={{ opacity:0.3 }}>·</span>
            <span>{preview.duration}</span><span style={{ opacity:0.3 }}>·</span>
            <span>{preview.difficulty}</span>
          </div>
          <ul style={{ listStyle:"none", display:"flex", flexWrap:"wrap", gap:5, marginTop:8, padding:0 }}>
            {preview.stops?.map(s => (
              <li key={s.id} style={{ fontSize:11, padding:"2px 7px", background:"#FAF7F2", border:"1px solid rgba(26,18,8,0.08)", borderRadius:3 }}>
                {s.typeIcon} {s.name}
              </li>
            ))}
          </ul>
          <button
            onClick={handleSave}
            style={{
              marginTop:12, padding:"9px", width:"100%", background:"#8B2020", color:"#fff",
              border:"none", borderRadius:4, fontSize:13, fontFamily:"inherit", fontWeight:600,
              cursor:"pointer",
            }}
          >
            保存到我的线路
          </button>
        </div>
      )}
    </div>
  );
}
