import { useState } from 'react'

import './CircleOfFifthsPage.css'

const KEYS = [
  {
    id: 'C',
    major: 'C',
    majorName: 'Dó maior',
    minor: 'Am',
    minorName: 'Lá menor',
    signature: 'Sem acidentes',
    accidentals: '♮',
    dominant: 'G',
    subdominant: 'F',
    parallel: 'Cm',
    chords: [
      { degree: 'I', chord: 'C', type: 'Tônica' },
      { degree: 'ii', chord: 'Dm', type: 'Supertônica' },
      { degree: 'iii', chord: 'Em', type: 'Mediante' },
      { degree: 'IV', chord: 'F', type: 'Subdominante' },
      { degree: 'V', chord: 'G', type: 'Dominante' },
      { degree: 'vi', chord: 'Am', type: 'Submediante' },
      { degree: 'vii°', chord: 'B°', type: 'Sensível' },
    ],
  },

  {
    id: 'G',
    major: 'G',
    majorName: 'Sol maior',
    minor: 'Em',
    minorName: 'Mi menor',
    signature: '1 sustenido',
    accidentals: 'F♯',
    dominant: 'D',
    subdominant: 'C',
    parallel: 'Gm',
    chords: [
      { degree: 'I', chord: 'G', type: 'Tônica' },
      { degree: 'ii', chord: 'Am', type: 'Supertônica' },
      { degree: 'iii', chord: 'Bm', type: 'Mediante' },
      { degree: 'IV', chord: 'C', type: 'Subdominante' },
      { degree: 'V', chord: 'D', type: 'Dominante' },
      { degree: 'vi', chord: 'Em', type: 'Submediante' },
      { degree: 'vii°', chord: 'F♯°', type: 'Sensível' },
    ],
  },

  {
    id: 'D',
    major: 'D',
    majorName: 'Ré maior',
    minor: 'Bm',
    minorName: 'Si menor',
    signature: '2 sustenidos',
    accidentals: 'F♯ C♯',
    dominant: 'A',
    subdominant: 'G',
    parallel: 'Dm',
    chords: [
      { degree: 'I', chord: 'D', type: 'Tônica' },
      { degree: 'ii', chord: 'Em', type: 'Supertônica' },
      { degree: 'iii', chord: 'F♯m', type: 'Mediante' },
      { degree: 'IV', chord: 'G', type: 'Subdominante' },
      { degree: 'V', chord: 'A', type: 'Dominante' },
      { degree: 'vi', chord: 'Bm', type: 'Submediante' },
      { degree: 'vii°', chord: 'C♯°', type: 'Sensível' },
    ],
  },

  {
    id: 'A',
    major: 'A',
    majorName: 'Lá maior',
    minor: 'F♯m',
    minorName: 'Fá♯ menor',
    signature: '3 sustenidos',
    accidentals: 'F♯ C♯ G♯',
    dominant: 'E',
    subdominant: 'D',
    parallel: 'Am',
    chords: [
      { degree: 'I', chord: 'A', type: 'Tônica' },
      { degree: 'ii', chord: 'Bm', type: 'Supertônica' },
      { degree: 'iii', chord: 'C♯m', type: 'Mediante' },
      { degree: 'IV', chord: 'D', type: 'Subdominante' },
      { degree: 'V', chord: 'E', type: 'Dominante' },
      { degree: 'vi', chord: 'F♯m', type: 'Submediante' },
      { degree: 'vii°', chord: 'G♯°', type: 'Sensível' },
    ],
  },

  {
    id: 'E',
    major: 'E',
    majorName: 'Mi maior',
    minor: 'C♯m',
    minorName: 'Dó♯ menor',
    signature: '4 sustenidos',
    accidentals: 'F♯ C♯ G♯ D♯',
    dominant: 'B',
    subdominant: 'A',
    parallel: 'Em',
    chords: [
      { degree: 'I', chord: 'E', type: 'Tônica' },
      { degree: 'ii', chord: 'F♯m', type: 'Supertônica' },
      { degree: 'iii', chord: 'G♯m', type: 'Mediante' },
      { degree: 'IV', chord: 'A', type: 'Subdominante' },
      { degree: 'V', chord: 'B', type: 'Dominante' },
      { degree: 'vi', chord: 'C♯m', type: 'Submediante' },
      { degree: 'vii°', chord: 'D♯°', type: 'Sensível' },
    ],
  },

  {
    id: 'B',
    major: 'B',
    majorName: 'Si maior',
    minor: 'G♯m',
    minorName: 'Sol♯ menor',
    signature: '5 sustenidos',
    accidentals: 'F♯ C♯ G♯ D♯ A♯',
    dominant: 'F♯',
    subdominant: 'E',
    parallel: 'Bm',
    chords: [
      { degree: 'I', chord: 'B', type: 'Tônica' },
      { degree: 'ii', chord: 'C♯m', type: 'Supertônica' },
      { degree: 'iii', chord: 'D♯m', type: 'Mediante' },
      { degree: 'IV', chord: 'E', type: 'Subdominante' },
      { degree: 'V', chord: 'F♯', type: 'Dominante' },
      { degree: 'vi', chord: 'G♯m', type: 'Submediante' },
      { degree: 'vii°', chord: 'A♯°', type: 'Sensível' },
    ],
  },

  {
    id: 'F#',
    major: 'F♯',
    majorName: 'Fá♯ maior',
    minor: 'D♯m',
    minorName: 'Ré♯ menor',
    alternativeMajor: 'G♭',
    alternativeMinor: 'E♭m',
    signature: '6 sustenidos',
    accidentals: 'F♯ C♯ G♯ D♯ A♯ E♯',
    dominant: 'C♯',
    subdominant: 'B',
    parallel: 'F♯m',
    chords: [
      { degree: 'I', chord: 'F♯', type: 'Tônica' },
      { degree: 'ii', chord: 'G♯m', type: 'Supertônica' },
      { degree: 'iii', chord: 'A♯m', type: 'Mediante' },
      { degree: 'IV', chord: 'B', type: 'Subdominante' },
      { degree: 'V', chord: 'C♯', type: 'Dominante' },
      { degree: 'vi', chord: 'D♯m', type: 'Submediante' },
      { degree: 'vii°', chord: 'E♯°', type: 'Sensível' },
    ],
  },

  {
    id: 'Db',
    major: 'D♭',
    majorName: 'Ré♭ maior',
    minor: 'B♭m',
    minorName: 'Si♭ menor',
    signature: '5 bemóis',
    accidentals: 'B♭ E♭ A♭ D♭ G♭',
    dominant: 'A♭',
    subdominant: 'G♭',
    parallel: 'D♭m',
    chords: [
      { degree: 'I', chord: 'D♭', type: 'Tônica' },
      { degree: 'ii', chord: 'E♭m', type: 'Supertônica' },
      { degree: 'iii', chord: 'Fm', type: 'Mediante' },
      { degree: 'IV', chord: 'G♭', type: 'Subdominante' },
      { degree: 'V', chord: 'A♭', type: 'Dominante' },
      { degree: 'vi', chord: 'B♭m', type: 'Submediante' },
      { degree: 'vii°', chord: 'C°', type: 'Sensível' },
    ],
  },

  {
    id: 'Ab',
    major: 'A♭',
    majorName: 'Lá♭ maior',
    minor: 'Fm',
    minorName: 'Fá menor',
    signature: '4 bemóis',
    accidentals: 'B♭ E♭ A♭ D♭',
    dominant: 'E♭',
    subdominant: 'D♭',
    parallel: 'A♭m',
    chords: [
      { degree: 'I', chord: 'A♭', type: 'Tônica' },
      { degree: 'ii', chord: 'B♭m', type: 'Supertônica' },
      { degree: 'iii', chord: 'Cm', type: 'Mediante' },
      { degree: 'IV', chord: 'D♭', type: 'Subdominante' },
      { degree: 'V', chord: 'E♭', type: 'Dominante' },
      { degree: 'vi', chord: 'Fm', type: 'Submediante' },
      { degree: 'vii°', chord: 'G°', type: 'Sensível' },
    ],
  },

  {
    id: 'Eb',
    major: 'E♭',
    majorName: 'Mi♭ maior',
    minor: 'Cm',
    minorName: 'Dó menor',
    signature: '3 bemóis',
    accidentals: 'B♭ E♭ A♭',
    dominant: 'B♭',
    subdominant: 'A♭',
    parallel: 'E♭m',
    chords: [
      { degree: 'I', chord: 'E♭', type: 'Tônica' },
      { degree: 'ii', chord: 'Fm', type: 'Supertônica' },
      { degree: 'iii', chord: 'Gm', type: 'Mediante' },
      { degree: 'IV', chord: 'A♭', type: 'Subdominante' },
      { degree: 'V', chord: 'B♭', type: 'Dominante' },
      { degree: 'vi', chord: 'Cm', type: 'Submediante' },
      { degree: 'vii°', chord: 'D°', type: 'Sensível' },
    ],
  },

  {
    id: 'Bb',
    major: 'B♭',
    majorName: 'Si♭ maior',
    minor: 'Gm',
    minorName: 'Sol menor',
    signature: '2 bemóis',
    accidentals: 'B♭ E♭',
    dominant: 'F',
    subdominant: 'E♭',
    parallel: 'B♭m',
    chords: [
      { degree: 'I', chord: 'B♭', type: 'Tônica' },
      { degree: 'ii', chord: 'Cm', type: 'Supertônica' },
      { degree: 'iii', chord: 'Dm', type: 'Mediante' },
      { degree: 'IV', chord: 'E♭', type: 'Subdominante' },
      { degree: 'V', chord: 'F', type: 'Dominante' },
      { degree: 'vi', chord: 'Gm', type: 'Submediante' },
      { degree: 'vii°', chord: 'A°', type: 'Sensível' },
    ],
  },

  {
    id: 'F',
    major: 'F',
    majorName: 'Fá maior',
    minor: 'Dm',
    minorName: 'Ré menor',
    signature: '1 bemol',
    accidentals: 'B♭',
    dominant: 'C',
    subdominant: 'B♭',
    parallel: 'Fm',
    chords: [
      { degree: 'I', chord: 'F', type: 'Tônica' },
      { degree: 'ii', chord: 'Gm', type: 'Supertônica' },
      { degree: 'iii', chord: 'Am', type: 'Mediante' },
      { degree: 'IV', chord: 'B♭', type: 'Subdominante' },
      { degree: 'V', chord: 'C', type: 'Dominante' },
      { degree: 'vi', chord: 'Dm', type: 'Submediante' },
      { degree: 'vii°', chord: 'E°', type: 'Sensível' },
    ],
  },
]

export default function CircleOfFifthsPage() {
  const [selectedId, setSelectedId] = useState('C')

  const selected =
    KEYS.find(key => key.id === selectedId) ?? KEYS[0]

  return (
    <div className="circle-page">
      <header className="circle-page__header">
        <div>
          <span className="circle-page__eyebrow">
            Ferramentas do músico
          </span>

          <h1>Círculo das quintas</h1>

          <p>
            Explore tonalidades, relativas menores,
            armaduras de clave e os acordes que formam
            cada campo harmônico.
          </p>
        </div>

        <div className="circle-page__legend">
          <span>
            <i className="major-dot" />
            Maior
          </span>

          <span>
            <i className="minor-dot" />
            Menor relativa
          </span>
        </div>
      </header>

      <div className="circle-layout">
        <section className="circle-tool">
          <div className="circle-tool__top">
            <span>Círculo interativo</span>

            <strong>
              {selected.signature}
            </strong>
          </div>

          <div className="fifths-wheel">
            <div className="fifths-wheel__direction fifths-wheel__direction--sharp">
              <span>♯</span>
              <small>Sustenidos</small>
            </div>

            <div className="fifths-wheel__direction fifths-wheel__direction--flat">
              <span>♭</span>
              <small>Bemóis</small>
            </div>

            {KEYS.map((key, index) => {
              const angle =
                index * 30 - 90

              const radians =
                (angle * Math.PI) / 180

              const x =
                50 +
                43 *
                  Math.cos(radians)

              const y =
                50 +
                43 *
                  Math.sin(radians)

              return (
                <button
                  key={key.id}
                  type="button"
                  className={`fifths-key fifths-key--major ${
                    selected.id === key.id
                      ? 'selected'
                      : ''
                  }`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                  onClick={() =>
                    setSelectedId(key.id)
                  }
                  aria-label={`Selecionar ${key.majorName}`}
                >
                  <strong>
                    {key.major}
                  </strong>

                  {key.alternativeMajor && (
                    <small>
                      {key.alternativeMajor}
                    </small>
                  )}
                </button>
              )
            })}

            {KEYS.map((key, index) => {
              const angle =
                index * 30 - 90

              const radians =
                (angle * Math.PI) / 180

              const x =
                50 +
                28.5 *
                  Math.cos(radians)

              const y =
                50 +
                28.5 *
                  Math.sin(radians)

              return (
                <button
                  key={`minor-${key.id}`}
                  type="button"
                  className={`fifths-key fifths-key--minor ${
                    selected.id === key.id
                      ? 'selected'
                      : ''
                  }`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                  onClick={() =>
                    setSelectedId(key.id)
                  }
                  aria-label={`Selecionar ${key.minorName}`}
                >
                  <strong>
                    {key.minor}
                  </strong>

                  {key.alternativeMinor && (
                    <small>
                      {key.alternativeMinor}
                    </small>
                  )}
                </button>
              )
            })}

            <div className="fifths-wheel__center">
              <span>Tonalidade</span>

              <strong>
                {selected.major}
              </strong>

              <small>
                {selected.majorName}
              </small>
            </div>
          </div>

          <div className="circle-tool__hint">
            <span>↻</span>

            <p>
              No sentido horário, cada passo sobe uma
              quinta perfeita e acrescenta um sustenido.
              No sentido anti-horário aparecem as
              tonalidades com bemóis.
            </p>
          </div>
        </section>

        <aside className="circle-sidebar">
          <section className="circle-info-card circle-info-card--selected">
            <div className="circle-info-card__number">
              01
            </div>

            <div className="circle-info-card__content">
              <span className="circle-info-card__label">
                Tonalidade selecionada
              </span>

              <h2>
                {selected.majorName}
              </h2>

              <div className="circle-key-signature">
                <span>
                  Armadura
                </span>

                <strong>
                  {selected.accidentals}
                </strong>

                <small>
                  {selected.signature}
                </small>
              </div>
            </div>
          </section>

          <section className="circle-info-card">
            <div className="circle-info-card__header">
              <span>02</span>

              <div>
                <h3>
                  Relações tonais
                </h3>

                <p>
                  Tonalidades diretamente relacionadas
                  à tonalidade selecionada.
                </p>
              </div>
            </div>

            <div className="tonal-relations">
              <div>
                <span>
                  Relativa menor
                </span>

                <strong>
                  {selected.minor}
                </strong>
              </div>

              <div>
                <span>
                  Dominante
                </span>

                <strong>
                  {selected.dominant}
                </strong>
              </div>

              <div>
                <span>
                  Subdominante
                </span>

                <strong>
                  {selected.subdominant}
                </strong>
              </div>

              <div>
                <span>
                  Paralela menor
                </span>

                <strong>
                  {selected.parallel}
                </strong>
              </div>
            </div>
          </section>

          <section className="circle-info-card">
            <div className="circle-info-card__header">
              <span>03</span>

              <div>
                <h3>
                  Campo harmônico
                </h3>

                <p>
                  Acordes diatônicos de{' '}
                  {selected.majorName}.
                </p>
              </div>
            </div>

            <div className="harmonic-field">
              {selected.chords.map(chord => (
                <div
                  className="harmonic-chord"
                  key={`${selected.id}-${chord.degree}`}
                >
                  <span>
                    {chord.degree}
                  </span>

                  <strong>
                    {chord.chord}
                  </strong>

                  <small>
                    {chord.type}
                  </small>
                </div>
              ))}
            </div>
          </section>

          <section className="circle-tip-card">
            <div className="circle-tip-card__icon">
              𝄞
            </div>

            <div>
              <strong>
                Por que usar o círculo?
              </strong>

              <p>
                Ele ajuda a visualizar rapidamente
                tonalidades próximas, acidentes,
                relativas e progressões harmônicas.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}