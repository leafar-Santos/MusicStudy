import { Link, useParams } from 'react-router-dom'
import { instruments } from '../../data/instruments'
import SectionTitle from '../../components/ui/SectionTitle/SectionTitle'
import './InstrumentDetailPage.css'

function playTone(hz) {
  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return

  const context = new AudioContext()
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.frequency.value = hz
  gain.gain.setValueAtTime(0.0001, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.2, context.currentTime + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.5)

  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + 1.55)
}

export default function InstrumentDetailPage() {
  const { slug } = useParams()
  const instrument = instruments.find(item => item.slug === slug)

  if (!instrument) {
    return <div className="instrument-detail-page">Instrumento não encontrado.</div>
  }

  return (
    <div className="instrument-detail-page">
      <Link className="instrument-detail-page__back" to="/instrumentos">← Voltar aos instrumentos</Link>

      <section className="instrument-detail-hero">
        <div className="instrument-detail-hero__icon">{instrument.icon}</div>
        <div>
          <span className="instrument-detail-hero__family">{instrument.family}</span>
          <h1>{instrument.name}</h1>
          <p>{instrument.description}</p>
        </div>
      </section>

      <section className="instrument-detail-notes">
        <SectionTitle compact title="Notas de referência" description="Som sintetizado de demonstração. Depois você pode substituir por gravações reais." />

        <div className="instrument-detail-notes__list">
          {instrument.notes.map((note, index) => (
            <div className="instrument-note" key={`${note.name}-${index}`}>
              <div>
                <strong>{note.name}</strong>
                <span>{note.notation}</span>
                {note.concert && <small>{note.concert}</small>}
              </div>

              <div className="instrument-note__frequency">{note.hz.toFixed(2)} Hz</div>
              <button onClick={() => playTone(note.hz)}>▶ Ouvir</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
