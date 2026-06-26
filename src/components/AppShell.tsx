import type { ReactElement } from 'react';
import { HashRouter, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';

import {
  APP_ROUTES,
  getLegacyReinforcementLearningRedirectPath,
  getLearningDomainPath,
} from '../lib/appRoutes';
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
        path={APP_ROUTES.landing}
        element={
          <LandingPage
            onOpenWorkspace={() => navigate(APP_ROUTES.workspace)}
            onOpenLearningLab={() => navigate(APP_ROUTES.learning)}
          />
        }
      />

      <Route
        path={APP_ROUTES.workspace}
        element={renderWorkspace({ onBackToLanding: () => navigate(APP_ROUTES.landing) })}
      />

      <Route
        path={APP_ROUTES.learning}
        element={<LearningLabView onBackToLanding={() => navigate(APP_ROUTES.landing)} />}
      />

      <Route
        path={APP_ROUTES.learningDomain}
        element={<LearningLabView onBackToLanding={() => navigate(APP_ROUTES.landing)} />}
      />

      <Route
        path={APP_ROUTES.learningTrack}
        element={<LearningLabView onBackToLanding={() => navigate(APP_ROUTES.landing)} />}
      />

      <Route
        path={APP_ROUTES.legacyReinforcementLearning}
        element={<Navigate to={getLearningDomainPath('reinforcement-learning')} replace />}
      />

      <Route
        path={APP_ROUTES.legacyReinforcementLearningTrack}
        element={<LegacyReinforcementLearningRedirect />}
      />

      <Route path="*" element={<Navigate to={APP_ROUTES.landing} replace />} />
    </Routes>
  );
}

function LegacyReinforcementLearningRedirect() {
  const { trackId } = useParams();
  return <Navigate to={getLegacyReinforcementLearningRedirectPath(trackId)} replace />;
}

export default function AppShell({ renderWorkspace }: AppShellProps) {
  return (
    <HashRouter>
      <AppRoutes renderWorkspace={renderWorkspace} />
    </HashRouter>
  );
}
