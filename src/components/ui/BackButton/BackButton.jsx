import { Link } from 'react-router-dom'
import './BackButton.css'

export default function BackButton({ to, children }) {
  return (
    <nav className="back-navigation" aria-label="Navegação de retorno">
      <Link className="back-button" to={to}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m12 5-7 7 7 7M5 12h14" />
        </svg>
        <span>{children}</span>
      </Link>
    </nav>
  )
}
