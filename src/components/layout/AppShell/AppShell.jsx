import { Outlet } from 'react-router-dom'
import TopBar from '../TopBar/TopBar'
import BottomNav from '../BottomNav/BottomNav'
import './AppShell.css'

export default function AppShell() {
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
