import type { ReactElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import LandingPage from './landing/LandingPage';
import LearningLabView from './learning/LearningLabView';
import ReinforcementLearningView from './reinforcement_learning/View';

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
            onOpenReinforcementLearning={() => navigate('/reinforcement-learning')}
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
        path="/reinforcement-learning"
        element={<ReinforcementLearningView onBackToLanding={() => navigate('/')} />}
      />

      <Route
        path="/reinforcement-learning/roadmap/:trackId"
        element={<ReinforcementLearningView onBackToLanding={() => navigate('/')} />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function AppShell({ renderWorkspace }: AppShellProps) {
  return (
    <BrowserRouter>
      <AppRoutes renderWorkspace={renderWorkspace} />
    </BrowserRouter>
  );
}