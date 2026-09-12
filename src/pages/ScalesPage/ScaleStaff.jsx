export default function ScaleStaff({ notes, active = -1, onNote }) {
  return (
    <div className="scale-staff-scroll" tabIndex="0" aria-label="Pentagrama em clave de Sol; role horizontalmente para ver todas as notas">
      <svg className="scale-staff" viewBox="0 0 800 250" aria-label="Notas da escala em clave de Sol">
        {[80, 100, 120, 140, 160].map(y => <line key={y} x1="20" x2="780" y1={y} y2={y} stroke="#828b98" />)}
        <text x="25" y="158" fontSize="102" fontFamily="'Noto Music', 'Segoe UI Symbol', serif" fill="#25334a">𝄞</text>
        {notes.map((note, index) => {
          const x = 125 + index * 88
          const y = 180 - note.position * 10
          const ledgers = []
          for (let line = 180; line <= y; line += 20) ledgers.push(line)
          for (let line = 60; line >= y; line -= 20) ledgers.push(line)
          const down = y <= 120
          return (
            <g key={index} className={`scale-staff-note${active === index ? ' is-active' : ''}`} role="button" tabIndex="0" aria-label={`Ouvir ${note.name}${note.octave}, grau ${note.degree}`} onClick={() => onNote(index)} onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onNote(index) }
            }}>
              <title>{note.name}{note.octave} · {note.frequency.toFixed(1)} Hz</title>
              <rect className="scale-note-hit" x={x - 40} y="12" width="80" height="226" rx="12" />
              {ledgers.map(line => <line key={line} x1={x - 19} x2={x + 19} y1={line} y2={line} stroke="currentColor" />)}
              {note.symbol && <text x={x - 30} y={y + 7} fontSize="25" textAnchor="middle" fill="currentColor">{note.symbol}</text>}
              <ellipse cx={x} cy={y} rx="12" ry="8" transform={`rotate(-20 ${x} ${y})`} fill="currentColor" />
              <line x1={x + (down ? -11 : 11)} x2={x + (down ? -11 : 11)} y1={y} y2={y + (down ? 36 : -36)} stroke="currentColor" strokeWidth="2" />
              <text x={x} y="220" textAnchor="middle" fontSize="16" fill="currentColor">{note.name}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
