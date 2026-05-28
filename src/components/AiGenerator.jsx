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
      "walkFromPrev": "步行X分钟（第一站为空）"
    }
  ]
}`;

function parseRoute(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  const route = JSON.parse(jsonMatch[0]);
  // 兼容 walkFromPrev / walk 字段
  if (route.stops) {
    route.stops = route.stops.map((s, i) => ({
      ...s,
      walk: s.walk || s.walkFromPrev || (i === 0 ? "" : "步行 15 分钟"),
    }));
  }
  return route;
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

  function handleSave() {
    if (!preview) return;
    onSave(preview);
    setPreview(null);
    setPrompt("");
  }

  return (
    <div className="ai-gen">
      <div className="ai-gen__header">
        <h3 className="ai-gen__title">AI 定制路线</h3>
        <p className="ai-gen__desc">描述你的偏好，自动生成一条专属徒步路线</p>
      </div>

      <div className="ai-gen__row">
        <input
          className="ai-gen__input"
          type="text"
          placeholder="例如：想看广州的寺庙和古建筑，从荔湾出发"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          disabled={loading}
        />
        <button className="ai-gen__btn" onClick={handleGenerate} disabled={loading || !prompt.trim()}>
          {loading ? "生成中…" : "生成"}
        </button>
      </div>

      {error && <p className="ai-gen__error">⚠ {error}</p>}

      {preview && (
        <div className="ai-preview">
          <div className="ai-preview__header">
            <h4 className="ai-preview__name">{preview.name}</h4>
            <p className="ai-preview__sub">{preview.subtitle}</p>
            <div className="ai-preview__meta">
              <span>{preview.distance}</span>
              <span className="dot">·</span>
              <span>{preview.duration}</span>
              <span className="dot">·</span>
              <span>{preview.difficulty}</span>
            </div>
          </div>
          <ul className="ai-preview__stops">
            {preview.stops?.map((s) => (
              <li key={s.id}>
                {s.typeIcon} {s.name}
              </li>
            ))}
          </ul>
          <button className="ai-preview__save" onClick={handleSave}>
            保存到我的线路
          </button>
        </div>
      )}
    </div>
  );
}
