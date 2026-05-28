import { useState } from "react";

export default function AiGenerator({ onRouteGenerated }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");

    const systemPrompt = `你是广州徒步路线设计专家，熟悉广州所有历史景点、寺庙、宗祠、地标建筑。
根据用户偏好，设计一条广州徒步线路，要求：
- 总距离不超过10公里
- 4到8个途经点
- 以有文化价值的景点为主：寺庙、宗祠、历史建筑、考古遗址、历史街区等

只返回JSON，不要任何其他文字，格式如下：
{
  "name": "路线名称（10字以内）",
  "subtitle": "副标题（一句话描述特色）",
  "distance": "X.X km",
  "duration": "约 X 小时",
  "difficulty": "轻松/中等/较难",
  "color": "#十六进制颜色",
  "startArea": "起点区域",
  "stops": [
    {
      "id": 1,
      "name": "景点名称",
      "type": "景点类型（4字以内）",
      "typeIcon": "一个emoji",
      "address": "详细地址",
      "description": "景点历史文化介绍（80-120字）",
      "highlight": "核心亮点（10字以内）",
      "walk": "↑ 步行 X 分钟（第一个点留空字符串）",
      "lat": 纬度数字,
      "lng": 经度数字
    }
  ]
}`;

    try {
      const response = await fetch("https://lingering-dream-748d.fuyrenoiu.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: systemPrompt,
          messages: [{ role: "user", content: `用户偏好：${prompt}` }],
        }),
      });

      if (!response.ok) {
        throw new Error(`请求失败 (${response.status})`);
      }

      const data = await response.json();
      const text = data.content?.[0]?.text || "";

      // Parse JSON from response (handle potential markdown code blocks)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("无法解析 AI 返回结果");

      const route = JSON.parse(jsonMatch[0]);
      onRouteGenerated(route);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-generator">
      <div className="ai-generator__header">
        <h3 className="ai-generator__title">AI 定制路线</h3>
        <p className="ai-generator__desc">告诉我你的偏好，自动生成一条个性化徒步路线</p>
      </div>
      <div className="ai-generator__input-row">
        <input
          className="ai-generator__input"
          type="text"
          placeholder="例如：我想看广州的寺庙和古建筑，从荔湾出发…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          disabled={loading}
        />
        <button
          className="ai-generator__btn"
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
        >
          {loading ? "生成中…" : "生成"}
        </button>
      </div>
      {error && <p className="ai-generator__error">⚠ {error}</p>}
    </div>
  );
}
