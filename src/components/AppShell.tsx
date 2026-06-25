import type { ReactElement } from 'react';
import { HashRouter, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';

import LandingPage from './landing/LandingPage';
import LearningLabView from './learning/LearningLabView';

type AppShellProps = {
  renderWorkspace: (props: { onBackToLanding: () => void }) => ReactElement;
};

function AppRoutes({ renderWorkspace }: AppShellProps) {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingPage
            onOpenWorkspace={() => navigate('/workspace')}
            onOpenLearningLab={() => navigate('/learning')}
          />
        }
      />

      <Route
        path="/workspace"
        element={renderWorkspace({ onBackToLanding: () => navigate('/') })}
      />

      <Route
        path="/learning"
        element={<LearningLabView onBackToLanding={() => navigate('/')} />}
      />

      <Route
        path="/learning/:domainId"
        element={<LearningLabView onBackToLanding={() => navigate('/')} />}
      />

      <Route
        path="/learning/:domainId/:trackId"
        element={<LearningLabView onBackToLanding={() => navigate('/')} />}
      />

      <Route
        path="/reinforcement-learning"
        element={<Navigate to="/learning/reinforcement-learning" replace />}
      />

      <Route
        path="/reinforcement-learning/roadmap/:trackId"
        element={<LegacyReinforcementLearningRedirect />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function LegacyReinforcementLearningRedirect() {
  const { trackId } = useParams();
  if (trackId === 'robot-learning') return <Navigate to="/learning/robot-learning" replace />;
  if (trackId === 'reinforcement-learning') return <Navigate to="/learning/reinforcement-learning" replace />;
  return <Navigate to={`/learning/reinforcement-learning/${trackId ?? 'tabular-control'}`} replace />;
}

export default function AppShell({ renderWorkspace }: AppShellProps) {
  return (
    <HashRouter>
      <AppRoutes renderWorkspace={renderWorkspace} />
    </HashRouter>
  );
}
