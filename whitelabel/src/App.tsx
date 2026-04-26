import { C, FONT } from "./theme";
import { useStore } from "./store/useStore";
import type { ViewId } from "./types";
import TopBar from "./components/layout/TopBar";
import DashboardView from "./components/views/DashboardView";
import PipelineView from "./components/views/PipelineView";
import ProjectsView from "./components/views/ProjectsView";
import KPIsView from "./components/views/KPIsView";
import RoadmapView from "./components/views/RoadmapView";
import IdeasView from "./components/views/IdeasView";
import PlanningView from "./components/views/PlanningView";
import PrinciplesView from "./components/views/PrinciplesView";
import ReferentielView from "./components/views/ReferentielView";
import SettingsView from "./components/views/SettingsView";

const VIEW_COMPONENTS: Record<ViewId, JSX.Element> = {
  dashboard: <DashboardView />,
  pipeline: <PipelineView />,
  projects: <ProjectsView />,
  kpis: <KPIsView />,
  roadmap: <RoadmapView />,
  ideas: <IdeasView />,
  planning: <PlanningView />,
  principles: <PrinciplesView />,
  referentiel: <ReferentielView />,
  settings: <SettingsView />,
};

export default function App() {
  const activeView = useStore((s) => s.activeView);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        display: "flex",
        flexDirection: "column",
        fontFamily: FONT.body,
      }}
    >
      <TopBar />
      <main
        style={{
          flex: 1,
          maxWidth: 1440,
          width: "100%",
          margin: "0 auto",
          padding: "1.5rem 1.25rem 3rem",
          boxSizing: "border-box",
        }}
      >
        {VIEW_COMPONENTS[activeView]}
      </main>
    </div>
  );
}
