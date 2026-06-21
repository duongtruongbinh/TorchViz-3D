import { useState, type ReactElement } from 'react';
import LandingPage from './landing/LandingPage';

type AppView = 'landing' | 'workspace';

type AppShellProps = {
  renderWorkspace: (props: { onBackToLanding: () => void }) => ReactElement;
};

export default function AppShell({ renderWorkspace }: AppShellProps) {
  const [view, setView] = useState<AppView>('landing');

  if (view === 'workspace') {
    return renderWorkspace({ onBackToLanding: () => setView('landing') });
  }

  return <LandingPage onOpenWorkspace={() => setView('workspace')} />;
}
