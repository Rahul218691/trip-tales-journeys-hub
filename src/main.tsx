import { lazy, Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { Spinner } from './components/ui/spinner.tsx'
import { AppProvider } from './context/AuthContext'
import './index.css'

const App = lazy(() => import('./App.tsx'))

createRoot(document.getElementById("root")!).render(
    <Suspense fallback={
        <div className="min-h-screen w-full flex items-center justify-center">
            <Spinner size="lg" />
        </div>
    }>
    <BrowserRouter>
        <AppProvider>
            <App />
        </AppProvider>
    </BrowserRouter>
    </Suspense>
);
