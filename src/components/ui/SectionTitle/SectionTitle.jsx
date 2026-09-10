import './SectionTitle.css'

export default function SectionTitle({ title, description, compact = false }) {
  return (
    <div className={`section-title ${compact ? 'compact' : ''}`}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}
