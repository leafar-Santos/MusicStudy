import { Link } from 'react-router-dom'
import './ToolCard.css'

export default function ToolCard({ icon, title, description, to }) {
  return (
    <Link className="tool-card" to={to}>
      <span className="tool-card__icon">{icon}</span>
      <div>
        <strong>{title}</strong>
        <small>{description}</small>
      </div>
    </Link>
  )
}
