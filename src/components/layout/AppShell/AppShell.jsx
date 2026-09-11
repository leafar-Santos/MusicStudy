import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TopBar from '../TopBar/TopBar'
import BottomNav from '../BottomNav/BottomNav'
import './AppShell.css'

export default function AppShell() {
  const location = useLocation()

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    return () => {
      window.history.scrollRestoration = previousRestoration
    }
  }, [])

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location])

  return (
    <div className="app-shell">
      <TopBar />
      <main className="app-shell__content">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
