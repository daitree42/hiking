import { useState, useEffect } from "react";

export default function RouteMap({ stops, color }) {
  const [Comp, setComp] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    import("./RouteMapImpl.jsx")
      .then(mod => setComp(() => mod.default))
      .catch(e => {
        console.warn("地图加载失败:", e.message);
        setFailed(true);
      });
  }, []);

  if (failed || !stops || stops.length === 0) return null;
  if (!Comp) return <div style={{ height: 260, background:"#F5F0E8", borderRadius:4 }} />;
  return <Comp stops={stops} color={color} />;
}
