import { Link } from 'react-router-dom'
import './ToolCard.css'

export default function ToolCard({ icon, image, title, description, to }) {
  return (
    <Link className={`tool-card${image ? ' tool-card--illustrated' : ''}`} to={to}>
      {image ? (
        <img className="tool-card__image" src={image} alt="" width="480" height="300" />
      ) : (
        <span className="tool-card__icon">{icon}</span>
      )}
      <div className="tool-card__content">
        <strong>{title}</strong>
        <small>{description}</small>
      </div>
    </Link>
  )
}
