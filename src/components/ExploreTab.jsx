import { PRESET_ROUTES } from "../data/routes";
import SectionLabel from "./SectionLabel";
import RouteCard from "./RouteCard";
import AiGenerator from "./AiGenerator";

export default function ExploreTab({ onSave }) {
  return (
    <div>
      <SectionLabel>精选路线</SectionLabel>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {PRESET_ROUTES.map(r => <RouteCard key={r.id} route={r} />)}
      </div>

      <SectionLabel>AI 定制路线</SectionLabel>
      <AiGenerator onSave={onSave} />
    </div>
  );
}
