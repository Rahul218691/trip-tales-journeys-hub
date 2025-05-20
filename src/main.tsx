import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Spinner } from './components/ui/spinner.tsx'
import './index.css'

const App = lazy(() => import('./App.tsx'))

createRoot(document.getElementById("root")!).render(
    <Suspense fallback={
        <div className="min-h-screen w-full flex items-center justify-center">
            <Spinner size="lg" />
        </div>
    }>
        <App />
    </Suspense>
);
