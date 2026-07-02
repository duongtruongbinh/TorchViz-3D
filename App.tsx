import React, { Suspense } from 'react';
import AppShell from './src/components/AppShell';

const TorchVizWorkspace = React.lazy(() => import('./src/components/workspace/TorchVizWorkspace'));

export default function App() {
  return (
    <AppShell
      renderWorkspace={({ onBackToLanding }) => (
        <Suspense fallback={<div className="min-h-screen bg-[var(--surface)]" />}>
          <TorchVizWorkspace onBackToLanding={onBackToLanding} />
        </Suspense>
      )}
    />
  );
}
