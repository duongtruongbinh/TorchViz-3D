import { useState, type ReactElement } from 'react';
import LandingPage from './landing/LandingPage';
import LearningLabView from './learning/LearningLabView';

type AppView = 'landing' | 'workspace' | 'learning';

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

  return (
    <LandingPage
      onOpenWorkspace={() => setView('workspace')}
      onOpenLearningLab={() => setView('learning')}
    />
  );
}
