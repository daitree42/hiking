import { useState } from "react";

// 备用本地路线生成器：当 API 不可用时，从预设景点组合路线
const LOCAL_POOL = [
  { name:"光孝寺", type:"古寺庙宇", typeIcon:"⛩", address:"光孝路109号", description:"广州最古老佛寺，始建于东晋，距今1600余年。六祖慧能在此剃度受戒。", highlight:"千年菩提树·东西铁塔", lat:23.1312, lng:113.2515 },
  { name:"六榕寺", type:"古寺庙宇", typeIcon:"⛩", address:"六榕路87号", description:"始建于南朝梁大同三年（537年），花塔高57米，宋代楼阁式砖塔。", highlight:"宋代花塔·苏轼题字", lat:23.1305, lng:113.2543 },
  { name:"陈家祠", type:"宗祠建筑", typeIcon:"🏠", address:"中山七路恩龙里34号", description:"清光绪年间建造，集岭南砖雕木雕石雕灰塑之大成。", highlight:"百粤冠祠·岭南雕刻巅峰", lat:23.1292, lng:113.2424 },
  { name:"南越王墓博物馆", type:"帝王陵寝", typeIcon:"🏛", address:"解放北路867号", description:"西汉南越国第二代王赵眜之墓，距今超2100年。", highlight:"玉衣·丝缕国宝", lat:23.1372, lng:113.2650 },
  { name:"中山纪念堂", type:"近代建筑", typeIcon:"🏛", address:"东风中路259号", description:"建于1931年，吕彦直设计，融合中国传统与现代技术。", highlight:"八角穹顶·民国风华", lat:23.1352, lng:113.2609 },
  { name:"越秀公园镇海楼", type:"历史地标", typeIcon:"🏯", address:"越秀公园内", description:"明洪武十三年建造的五层红砂岩城楼，俗称五层楼。", highlight:"明代城楼·全城视野", lat:23.1408, lng:113.2653 },
  { name:"大佛古寺", type:"佛教圣地", typeIcon:"🪔", address:"惠新中街21号", description:"始建于南汉，紧邻北京路，夜晚灯光辉煌。", highlight:"三宝大佛·夜景绝美", lat:23.1253, lng:113.2602 },
  { name:"北京路千年古道", type:"考古遗址", typeIcon:"🧱", address:"北京路步行街", description:"叠压自汉代至明清各朝代路面共11层，可见2000年历史断层。", highlight:"11层古路面·免费参观", lat:23.1216, lng:113.2650 },
  { name:"上下九步行街", type:"历史街区", typeIcon:"🏙", address:"荔湾区上下九路", description:"广州最具代表性的骑楼商业街，建于民国时期。", highlight:"百年骑楼·西关商埠", lat:23.1194, lng:113.2471 },
  { name:"永庆坊", type:"历史街区", typeIcon:"🏙", address:"恩宁路", description:"广州旧城活化改造的标志项目，李小龙祖居所在地。", highlight:"旧城活化典范·功夫传奇", lat:23.1178, lng:113.2410 },
  { name:"荔枝湾涌", type:"水乡风貌", typeIcon:"🌊", address:"荔湾区多宝路", description:"广州旧八景之一荔湾渔唱发生地，岭南水乡诗意景致。", highlight:"岭南水乡·粤剧文化", lat:23.1215, lng:113.2360 },
  { name:"沙面岛", type:"历史租界", typeIcon:"🌴", address:"荔湾区沙面大街", description:"鸦片战争后英法租界，150余幢欧陆风格建筑保存完好。", highlight:"欧陆建筑·珠江畔历史孤岛", lat:23.1102, lng:113.2409 },
];

const THEMES = [
  { name: "寺庙祈福线", subtitle: "千年古刹 · 闹市中的清净", kw: "寺" },
  { name: "古迹探访线", subtitle: "从南越王到明清 · 两千年穿越", kw: "古" },
  { name: "岭南建筑线", subtitle: "宗祠骑楼西关大屋 · 广府营造之美", kw: "岭南" },
  { name: "老城漫步线", subtitle: "街巷里弄 · 广州的烟火气", kw: "闲" },
  { name: "历史文化线", subtitle: "帝王陵寝到近代风云 · 一城故事", kw: "史" },
];

const COLORS = ["#8B2020", "#1B4F8A", "#2E7D32", "#6A1B9A", "#E65100"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateLocalRoute(promptText) {
  const theme = THEMES[Math.floor(Math.random() * THEMES.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const count = 4 + Math.floor(Math.random() * 4); // 4-7 stops

  const pool = promptText
    ? shuffle([...LOCAL_POOL.filter(p =>
        promptText.includes("寺") ? p.type.includes("寺") :
        promptText.includes("古") ? p.type.includes("古") || p.type.includes("考古") || p.name.includes("南越") || p.name.includes("千年") :
        promptText.includes("建筑") ? p.type.includes("建筑") || p.type.includes("宗祠") || p.type.includes("街区") :
        promptText.includes("荔湾") || promptText.includes("西关") ? p.name.includes("荔") || p.name.includes("沙面") || p.name.includes("永庆") || p.name.includes("上下") :
        promptText.includes("越秀") ? p.name.includes("越秀") || p.name.includes("南越") || p.name.includes("中山") || p.name.includes("北京") :
        true
      ), ...LOCAL_POOL])
    : shuffle(LOCAL_POOL);

  const stops = pool.slice(0, count).map((s, i) => ({
    id: i + 1,
    name: s.name,
    type: s.type,
    typeIcon: s.typeIcon,
    address: s.address,
    description: s.description,
    highlight: s.highlight,
    walkFromPrev: i === 0 ? "" : `步行 ${Math.floor(Math.random() * 15) + 5} 分钟`,
    lat: s.lat,
    lng: s.lng,
  }));

  const distance = (count * 1.2 + Math.random() * 2).toFixed(1);
  const duration = Math.ceil(count * 0.4 + Math.random() * 0.5);

  return {
    name: theme.name,
    subtitle: theme.subtitle,
    distance: `${distance} km`,
    duration: `约 ${duration} 小时`,
    difficulty: Math.random() > 0.7 ? "中等" : "轻松",
    color,
    stops,
  };
}

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

    // 先尝试 Cloudflare Worker / DeepSeek API
    try {
      const res = await fetch("https://hiking-ai.fuyrenoiu.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `用户偏好：${prompt}` }],
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error(`请求失败 (${res.status})`);
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      const route = parseRoute(text);
      if (!route) throw new Error("无法解析返回结果");
      setPreview(route);
      setLoading(false);
      return;
    } catch (err) {
      // API 失败，使用本地生成
      console.warn("AI API 不可用，使用本地生成:", err.message);
    }

    // 本地生成
    try {
      await new Promise(r => setTimeout(r, 800)); // 模拟延迟
      const route = generateLocalRoute(prompt);
      setPreview(route);
    } catch (err) {
      setError("生成失败，请重试");
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
