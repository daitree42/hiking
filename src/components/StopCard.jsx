export default function StopCard({ stop, expanded, onToggle }) {
  return (
    <div className={`stop-card ${expanded ? "stop-card--expanded" : ""}`}>
      <button className="stop-card__header" onClick={onToggle}>
        <span className="stop-card__order" style={{ backgroundColor: "var(--route-color, #8B2020)" }}>
          {stop.id}
        </span>
        <div className="stop-card__info">
          <span className="stop-card__name">{stop.name}</span>
          <span className="stop-card__type">
            {stop.typeIcon} {stop.type}
          </span>
        </div>
        <span className="stop-card__walk">{stop.walk}</span>
        <span className="stop-card__toggle">{expanded ? "−" : "+"}</span>
      </button>
      {expanded && (
        <div className="stop-card__body">
          <p className="stop-card__address">📍 {stop.address}</p>
          <p className="stop-card__description">{stop.description}</p>
          <div className="stop-card__highlight" style={{ borderLeftColor: "var(--route-color, #8B2020)" }}>
            ✦ {stop.highlight}
          </div>
        </div>
      )}
    </div>
  );
}
