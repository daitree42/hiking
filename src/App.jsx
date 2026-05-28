import { useState } from "react";
import { ROUTES } from "./data/routes";
import Header from "./components/Header";
import RouteCard from "./components/RouteCard";
import StopCard from "./components/StopCard";
import RouteMap from "./components/RouteMap";
import AiGenerator from "./components/AiGenerator";
import "./App.css";

export default function App() {
  const [activeRouteId, setActiveRouteId] = useState("yuexiu");
  const [expandedStop, setExpandedStop] = useState(null);
  const [aiRoute, setAiRoute] = useState(null);
  const [showAi, setShowAi] = useState(false);

  const route = aiRoute || ROUTES[activeRouteId];
  const routeColor = route?.color || "#8B2020";

  function handleRouteGenerated(newRoute) {
    setAiRoute(newRoute);
    setShowAi(false);
    setExpandedStop(null);
  }

  function resetToPreset(routeId) {
    setAiRoute(null);
    setActiveRouteId(routeId);
    setExpandedStop(null);
    setShowAi(false);
  }

  return (
    <div className="app" style={{ "--route-color": routeColor }}>
      <Header />

      <main className="main">
        {/* Left: Route list and itinerary */}
        <section className="panel panel--left">
          <div className="route-tabs">
            <div className="route-tabs__preset">
              {Object.entries(ROUTES).map(([id, r]) => (
                <RouteCard
                  key={id}
                  routeId={id}
                  route={r}
                  active={!aiRoute && activeRouteId === id}
                  onClick={resetToPreset}
                />
              ))}
            </div>
            <button
              className={`route-tabs__ai-btn ${showAi ? "active" : ""}`}
              onClick={() => setShowAi(!showAi)}
            >
              ✦ AI 定制路线
            </button>
          </div>

          {showAi && <AiGenerator onRouteGenerated={handleRouteGenerated} />}

          {aiRoute && (
            <div className="ai-route-badge" style={{ backgroundColor: routeColor }}>
              <span>AI 生成：{aiRoute.name}</span>
              <button onClick={() => { setAiRoute(null); setShowAi(false); }}>× 清除</button>
            </div>
          )}

          {/* Itinerary */}
          <div className="itinerary">
            <div className="itinerary__header">
              <h2 className="itinerary__title">{route.name}</h2>
              <p className="itinerary__subtitle">{route.subtitle}</p>
              <div className="itinerary__meta">
                <span>{route.distance}</span>
                <span className="dot">·</span>
                <span>{route.duration}</span>
                <span className="dot">·</span>
                <span>{route.difficulty}</span>
                <span className="dot">·</span>
                <span>{route.startArea}</span>
              </div>
            </div>

            <div className="itinerary__stops">
              {route.stops.map((stop) => (
                <StopCard
                  key={stop.id}
                  stop={stop}
                  expanded={expandedStop === stop.id}
                  onToggle={() => setExpandedStop(expandedStop === stop.id ? null : stop.id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Right: Map */}
        <section className="panel panel--right">
          <div className="map-container">
            <RouteMap route={route} />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>用脚步丈量城市 · 广州徒步路线指南</p>
      </footer>
    </div>
  );
}
