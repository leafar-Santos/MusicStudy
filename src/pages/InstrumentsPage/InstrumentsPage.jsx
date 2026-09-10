import { Link } from 'react-router-dom'
import PageHero from '../../components/ui/PageHero/PageHero'
import SectionTitle from '../../components/ui/SectionTitle/SectionTitle'
import { instruments } from '../../data/instruments'
import './InstrumentsPage.css'

export default function InstrumentsPage() {
  return (
    <>
      <PageHero eyebrow="Instrumentos" title="Escute antes de afinar" description="Escolha um instrumento e use sons de referência." symbol="♪" />

      <div className="instruments-page">
        <SectionTitle title="Biblioteca de instrumentos" />
        <div className="instruments-grid">
          {instruments.map(instrument => (
            <Link className="instrument-card" key={instrument.slug} to={`/instrumentos/${instrument.slug}`}>
              <span className="instrument-card__emoji">{instrument.icon}</span>
              <span className="instrument-card__family">{instrument.family}</span>
              <h3>{instrument.name}</h3>
              <p>{instrument.description}</p>
              <span className="instrument-card__link">Abrir instrumento →</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
