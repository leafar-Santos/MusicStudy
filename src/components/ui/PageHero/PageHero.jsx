import './PageHero.css'

export default function PageHero({ eyebrow, title, description, symbol = '𝄞' }) {
  return (
    <section className="page-hero">
      <div className="page-hero__content">
        <span className="page-hero__eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="page-hero__symbol">{symbol}</div>
    </section>
  )
}
