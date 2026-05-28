import { useState } from "react";
import Timeline from "./Timeline";

export default function RouteCard({ route }) {
  const [expanded, setExpanded] = useState(false);
  const color = route.color || "#8B2020";

  return (
    <div className="route-card">
      <div className="route-card__bar" style={{ backgroundColor: color }} />
      <div className="route-card__body">
        <button className="route-card__header" onClick={() => setExpanded(!expanded)}>
          <div className="route-card__info">
            <h3 className="route-card__name">{route.name}</h3>
            <p className="route-card__subtitle">{route.subtitle}</p>
            <div className="route-card__meta">
              <span>{route.distance}</span>
              <span className="dot">·</span>
              <span>{route.duration}</span>
              <span className="dot">·</span>
              <span>{route.difficulty}</span>
            </div>
            <span className="route-card__area">{route.startArea}</span>
          </div>
          <span className="route-card__toggle">{expanded ? "−" : "+"}</span>
        </button>

        {expanded && (
          <div className="route-card__timeline">
            <Timeline stops={route.stops} color={color} />
          </div>
        )}
      </div>
    </div>
  );
}
