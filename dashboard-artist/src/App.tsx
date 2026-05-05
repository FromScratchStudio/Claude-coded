import { AnimatePresence, motion } from "framer-motion";
import { C } from "./theme";
import { useStore } from "./store/useStore";
import TopBar from "./components/layout/TopBar";
import PhaseTimeline from "./components/layout/PhaseTimeline";
import DashboardView from "./components/views/DashboardView";
import PipelineView from "./components/views/PipelineView";
import ProjectsView from "./components/views/ProjectsView";
import KPIsView from "./components/views/KPIsView";
import TrimestreView from "./components/views/TrimestreView";
import PhasesView from "./components/views/PhasesView";
import GardeFousView from "./components/views/GardeFousView";
import ReferentielView from "./components/views/ReferentielView";
import IdeasView from "./components/views/IdeasView";
import KeftaMateshaView from "./components/views/KeftaMateshaView";
import SettingsView from "./components/views/SettingsView";
import UserGuideView from "./components/views/UserGuideView";
import WeeklyCalendarView from "./components/views/WeeklyCalendarView";
import WeeklyRetroView from "./components/views/WeeklyRetroView";
import AiConseillerView from "./components/views/AiConseillerView";
import type { ViewId } from "./types";

const VIEWS: Record<ViewId, JSX.Element> = {
  dashboard: <DashboardView />,
  pipeline: <PipelineView />,
  projects: <ProjectsView />,
  kpis: <KPIsView />,
  trimestre: <TrimestreView />,
  phases: <PhasesView />,
  "garde-fous": <GardeFousView />,
  referentiel: <ReferentielView />,
  ideas: <IdeasView />,
  "kefta-matesha": <KeftaMateshaView />,
  "weekly-calendar": <WeeklyCalendarView />,
  retrospective: <WeeklyRetroView />,
  "ia-conseiller": <AiConseillerView />,
  settings: <SettingsView />,
  "user-guide": <UserGuideView />,
};

const variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
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
      }}
    >
      <TopBar />
      <PhaseTimeline />

      <main
        style={{
          flex: 1,
          maxWidth: 1400,
          width: "100%",
          margin: "0 auto",
          padding: "1.5rem 1.25rem 3rem",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {VIEWS[activeView]}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
