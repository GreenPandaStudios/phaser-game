import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LeaderBoard, PhaserGame, ScoreKeeper } from './components'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // The App component is now the main layout
    children: [
      {
        index: true, // This is the default component shown at "/"
        element: (
          <ScoreKeeper>
            <PhaserGame />
          </ScoreKeeper>
        ),
      },
      {
        path: 'leaderboard',
        element: <LeaderBoard />,
      },
    ],
  },
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
