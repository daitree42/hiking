import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

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

export default function RouteMapImpl({ stops, color = "#8B2020" }) {
  if (!stops || stops.length === 0) return null;
  const validStops = stops.filter(s => s.lat && s.lng);
  if (validStops.length === 0) return null;
  const center = [validStops[0].lat, validStops[0].lng];
  const positions = validStops.map(s => [s.lat, s.lng]);
  return (
    <MapContainer center={center} zoom={13} style={{ height: 260, width: "100%", borderRadius: 4 }} zoomControl={false} scrollWheelZoom={false} dragging={false}>
      <TileLayer attribution='&copy; 高德地图' url="https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}" />
      <FitBounds stops={validStops} />
      <Polyline positions={positions} pathOptions={{ color, weight: 2, opacity: 0.6 }} />
      {validStops.map((s, i) => (
        <Marker key={s.id || i} position={[s.lat, s.lng]} icon={numberedIcon(i + 1, color)}>
          <Popup><strong>{s.name}</strong><br />{s.highlight}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
