import { NavLink } from 'react-router-dom'
import './BottomNav.css'

const items = [
  ['⌂', 'Home', '/'],
  ['𝄞', 'Aprender', '/aprender'],
  ['♩', 'Praticar', '/praticar'],
  ['♪', 'Instrumentos', '/instrumentos'],
  ['⚙', 'Ferramentas', '/ferramentas'],
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegação mobile">
      {items.map(([icon, label, to]) => (
        <NavLink key={to} to={to} end={to === '/'}>
          <b>{icon}</b>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
