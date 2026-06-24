import { useState, type ReactElement } from 'react';
import LandingPage from './landing/LandingPage';
import LearningLabView from './learning/LearningLabView';
import ReinforcementLearningView from './reinforcement_learning/View';

type AppView = 'landing' | 'workspace' | 'learning' | 'reinforcement-learning';

type AppShellProps = {
  renderWorkspace: (props: { onBackToLanding: () => void }) => ReactElement;
};

export default function AppShell({ renderWorkspace }: AppShellProps) {
  const [view, setView] = useState<AppView>('landing');

  if (view === 'workspace') {
    return renderWorkspace({ onBackToLanding: () => setView('landing') });
  }

  if (view === 'learning') {
    return <LearningLabView onBackToLanding={() => setView('landing')} />;
  }

  if (view === 'reinforcement-learning') {
    return <ReinforcementLearningView onBackToLanding={() => setView('landing')} />;
  }

  return (
    <LandingPage
      onOpenWorkspace={() => setView('workspace')}
      onOpenLearningLab={() => setView('learning')}
      onOpenReinforcementLearning={() => setView('reinforcement-learning')}
    />
  );
}
