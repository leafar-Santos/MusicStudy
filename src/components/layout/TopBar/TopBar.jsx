import { NavLink } from 'react-router-dom'
import './TopBar.css'

export default function TopBar() {
  return (
    <header className="topbar">
      <NavLink className="topbar__brand" to="/">
        <span className="topbar__brand-mark">♫</span>
        <span>MusicStudy</span>
      </NavLink>

      <nav className="topbar__nav" aria-label="Navegação principal">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/aprender">Aprender</NavLink>
        <NavLink to="/praticar">Praticar</NavLink>
        <NavLink to="/instrumentos">Instrumentos</NavLink>
        <NavLink to="/escalas">Escalas</NavLink>
        <NavLink to="/dicionario">Dicionário</NavLink>
      </nav>
    </header>
  )
}
