import { useEffect, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "./store/useStore";
import { applyAccentColor, C } from "./theme";
import TopBar from "./components/layout/TopBar";
import PhaseTimeline from "./components/layout/PhaseTimeline";
import OnboardingWizard from "./components/layout/OnboardingWizard";

const DashboardView = lazy(() => import("./components/views/DashboardView"));
const PipelineView = lazy(() => import("./components/views/PipelineView"));
const ProjectsView = lazy(() => import("./components/views/ProjectsView"));
const KPIsView = lazy(() => import("./components/views/KPIsView"));
const QuarterView = lazy(() => import("./components/views/QuarterView"));
const PhasesView = lazy(() => import("./components/views/PhasesView"));
const GuardrailsView = lazy(() => import("./components/views/GuardrailsView"));
const PersonasView = lazy(() => import("./components/views/PersonasView"));
const IdeasView = lazy(() => import("./components/views/IdeasView"));
const ContentHubView = lazy(() => import("./components/views/ContentHubView"));
const WeeklyCalendarView = lazy(() => import("./components/views/WeeklyCalendarView"));
const RetrospectiveView = lazy(() => import("./components/views/RetrospectiveView"));
const SettingsView = lazy(() => import("./components/views/SettingsView"));
const UserGuideView = lazy(() => import("./components/views/UserGuideView"));

const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

const PAGE_TRANSITION = { duration: 0.18, ease: "easeOut" };

function LoadingFallback() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 200,
        color: C.textDim,
        fontSize: "0.85rem",
      }}
    >
      Loading…
    </div>
  );
}

export default function App() {
  const appConfig = useStore((s) => s.appConfig);
  const activeView = useStore((s) => s.activeView);

  // Apply accent color on mount and when it changes
  useEffect(() => {
    applyAccentColor(appConfig.accentColor);
  }, [appConfig.accentColor]);

  // Show onboarding wizard on first run
  if (!appConfig.onboardingComplete) {
    return <OnboardingWizard />;
  }

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
          maxWidth: 1200,
          width: "100%",
          margin: "0 auto",
          padding: "1.5rem 1.25rem 3rem",
          boxSizing: "border-box",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            variants={PAGE_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={PAGE_TRANSITION}
          >
            <Suspense fallback={<LoadingFallback />}>
              {activeView === "dashboard" && <DashboardView />}
              {activeView === "pipeline" && <PipelineView />}
              {activeView === "projects" && <ProjectsView />}
              {activeView === "kpis" && <KPIsView />}
              {activeView === "quarter" && <QuarterView />}
              {activeView === "phases" && <PhasesView />}
              {activeView === "guardrails" && <GuardrailsView />}
              {activeView === "personas" && <PersonasView />}
              {activeView === "ideas" && <IdeasView />}
              {activeView === "content-hub" && <ContentHubView />}
              {activeView === "weekly-calendar" && <WeeklyCalendarView />}
              {activeView === "retrospective" && <RetrospectiveView />}
              {activeView === "settings" && <SettingsView />}
              {activeView === "user-guide" && <UserGuideView />}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
