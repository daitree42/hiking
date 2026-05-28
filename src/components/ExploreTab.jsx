import { ROUTES } from "../data/routes";
import RouteCard from "./RouteCard";
import AiGenerator from "./AiGenerator";

export default function ExploreTab({ onSave }) {
  return (
    <div className="tab-content explore-tab">
      <section className="section">
        <h2 className="section__title">精选路线</h2>
        <div className="routes-list">
          {Object.values(ROUTES).map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section__title">AI 定制路线</h2>
        <AiGenerator onSave={onSave} />
      </section>
    </div>
  );
}
