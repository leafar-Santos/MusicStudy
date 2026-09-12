import { Link } from 'react-router-dom'
import PageHero from '../../components/ui/PageHero/PageHero'
import SectionTitle from '../../components/ui/SectionTitle/SectionTitle'
import { buildScale, scaleTypes } from '../../data/scales'
import './ScalesPage.css'

export default function ScalesPage() {
  return <>
    <PageHero eyebrow="Escalas" title="Veja as notas. Ouça as escalas." description="Escolha uma escala para explorar em diferentes tonalidades." symbol="𝄞" />
    <div className="scales-page">
      <SectionTitle title="Escalas interativas" />
      <div className="scales-grid">
        {scaleTypes.map(type => <Link key={type.slug} to={`/escalas/${type.slug}`} className="scale-card">
          <svg viewBox="0 0 480 300" aria-hidden="true" style={{ color: type.color }}>
            <rect width="480" height="300" fill="#19233e" />
            {[95, 120, 145, 170, 195].map(y => <line key={y} x1="35" x2="445" y1={y} y2={y} stroke="#60708c" />)}
            {buildScale('C', type).map((note, i) => <g key={i} fill="currentColor" stroke="currentColor">
              {i === 0 && <path d="M46 220h36" />}
              {note.symbol && <text x={44 + i * 50} y={227 - i * 12.5} fontSize="21" stroke="none">{note.symbol}</text>}
              <ellipse cx={64 + i * 50} cy={220 - i * 12.5} rx="10" ry="7" transform={`rotate(-20 ${64 + i * 50} ${220 - i * 12.5})`} />
              <path d={`M${73 + i * 50} ${220 - i * 12.5}v-35`} strokeWidth="2" />
            </g>)}
            <text x="240" y="263" textAnchor="middle" fill="currentColor" fontSize="18">{type.formula}</text>
          </svg>
          <div><h2>{type.title}</h2><p>{type.subtitle}</p><span>Explorar escala →</span></div>
        </Link>)}
      </div>
    </div>
  </>
}
