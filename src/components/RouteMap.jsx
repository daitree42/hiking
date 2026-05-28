import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

// Fix default marker icon path issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createNumberedIcon(number, color) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background:${color};color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)">${number}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

function FitBounds({ stops }) {
  const map = useMap();
  useEffect(() => {
    if (stops.length > 0) {
      const bounds = L.latLngBounds(stops.map((s) => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [map, stops]);
  return null;
}

export default function RouteMap({ route }) {
  if (!route || !route.stops || route.stops.length === 0) return null;

  const positions = route.stops.map((s) => [s.lat, s.lng]);
  const color = route.color || "#8B2020";

  return (
    <MapContainer
      center={[23.13, 113.26]}
      zoom={13}
      style={{ height: "100%", width: "100%", borderRadius: "12px" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds stops={route.stops} />
      <Polyline positions={positions} pathOptions={{ color, weight: 3, opacity: 0.7 }} />
      {route.stops.map((stop, idx) => (
        <Marker
          key={stop.id}
          position={[stop.lat, stop.lng]}
          icon={createNumberedIcon(idx + 1, color)}
        >
          <Popup>
            <strong>{stop.name}</strong>
            <br />
            {stop.highlight}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
