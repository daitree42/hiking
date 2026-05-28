import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

// Fix default marker icon path issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function numberedIcon(num, color) {
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};color:#fff;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:sans-serif;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.25)">${num}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

function FitBounds({ stops }) {
  const map = useMap();
  useEffect(() => {
    if (stops?.length > 0) {
      const bounds = L.latLngBounds(stops.map(s => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [map, stops]);
  return null;
}

export default function RouteMap({ stops, color = "#8B2020" }) {
  if (!stops || stops.length === 0) return null;

  // Use first stop as center fallback
  const center = [stops[0]?.lat || 23.13, stops[0]?.lng || 113.26];
  const positions = stops.map(s => [s.lat, s.lng]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: 260, width: "100%", borderRadius: 4 }}
      zoomControl={false}
      scrollWheelZoom={false}
      dragging={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds stops={stops} />
      <Polyline positions={positions} pathOptions={{ color, weight: 2, opacity: 0.6 }} />
      {stops.map((s, i) => (
        <Marker key={s.id || i} position={[s.lat, s.lng]} icon={numberedIcon(i + 1, color)}>
          <Popup><strong>{s.name}</strong><br />{s.highlight}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
