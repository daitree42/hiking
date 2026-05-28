import { ROUTES, TYPE_COLORS } from "../data/routes";

const TYPE_COLORS_OBJ = TYPE_COLORS;

export default function RouteCard({ routeId, route, active, onClick }) {
  const bgColor = route.color || "#8B2020";
  return (
    <button
      className={`route-card ${active ? "route-card--active" : ""}`}
      onClick={() => onClick(routeId)}
      style={{
        "--route-color": bgColor,
        borderColor: active ? bgColor : "transparent",
      }}
    >
      <div className="route-card__header">
        <h3 className="route-card__name">{route.name}</h3>
        <span className="route-card__subtitle">{route.subtitle}</span>
      </div>
      <div className="route-card__meta">
        <span className="route-card__stat">{route.distance}</span>
        <span className="route-card__sep">·</span>
        <span className="route-card__stat">{route.duration}</span>
        <span className="route-card__sep">·</span>
        <span className="route-card__stat">{route.difficulty}</span>
      </div>
      <div className="route-card__stops-count">{route.stops.length} 个途经点</div>
    </button>
  );
}
