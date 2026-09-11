import { Link } from 'react-router-dom'
import './FeatureCard.css'

export default function FeatureCard({ tag, title, description, symbol, to, tone = '' }) {
  return (
    <Link className={`feature-card ${tone}`} to={to}>
      <span className="feature-card__tag">{tag}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="feature-card__symbol">{symbol}</span>
    </Link>
  )
}
