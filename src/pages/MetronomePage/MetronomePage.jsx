import { useEffect, useRef, useState } from 'react'

import './MetronomePage.css'

const TIME_SIGNATURES = {
  '1/4': {
    beats: 1,
    groups: [1],
    label: '1/4',
    description: 'Um tempo por compasso',
  },

  '2/4': {
    beats: 2,
    groups: [2],
    label: '2/4',
    description: 'Binário simples',
  },

  '3/4': {
    beats: 3,
    groups: [3],
    label: '3/4',
    description: 'Ternário simples',
  },

  '4/4': {
    beats: 4,
    groups: [4],
    label: '4/4',
    description: 'Quaternário simples',
  },

  '6/8': {
    beats: 6,
    groups: [3, 3],
    label: '6/8',
    description: 'Composto — 2 grupos de 3',
  },

  '9/8': {
    beats: 9,
    groups: [3, 3, 3],
    label: '9/8',
    description: 'Composto — 3 grupos de 3',
  },

  '12/8': {
    beats: 12,
    groups: [3, 3, 3, 3],
    label: '12/8',
    description: 'Composto — 4 grupos de 3',
  },
}

const SOUNDS = {
  wood: {
    name: 'Madeira',
    icon: '◉',
    oscillator: 'sine',
    beatFrequency: 780,
    accentFrequency: 1180,
    subdivisionFrequency: 520,
  },

  digital: {
    name: 'Digital',
    icon: '◇',
    oscillator: 'square',
    beatFrequency: 900,
    accentFrequency: 1450,
    subdivisionFrequency: 620,
  },

  soft: {
    name: 'Suave',
    icon: '○',
    oscillator: 'sine',
    beatFrequency: 580,
    accentFrequency: 880,
    subdivisionFrequency: 420,
  },

  bell: {
    name: 'Sino',
    icon: '♢',
    oscillator: 'triangle',
    beatFrequency: 980,
    accentFrequency: 1650,
    subdivisionFrequency: 680,
  },
}

const TIMER_OPTIONS = [0, 1, 5, 10, 15, 20, 30]

function formatTimer(totalSeconds) {
  if (!totalSeconds) {
    return '--:--'
  }

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0'
  )}`
}

export default function MetronomePage() {
  const [bpm, setBpm] = useState(120)

  const [running, setRunning] = useState(false)

  const [timeSignature, setTimeSignature] = useState('4/4')

  const [subdivision, setSubdivision] = useState(1)

  const [sound, setSound] = useState('wood')

  const [accentEnabled, setAccentEnabled] = useState(true)

  const [timerMinutes, setTimerMinutes] = useState(0)

  const [remainingSeconds, setRemainingSeconds] = useState(0)

  const [currentBeat, setCurrentBeat] = useState(0)

  const [currentSubdivision, setCurrentSubdivision] = useState(0)

  const contextRef = useRef(null)

  const metronomeTimerRef = useRef(null)

  const beatRef = useRef(0)

  const subdivisionRef = useRef(0)

  const signature = TIME_SIGNATURES[timeSignature]

  const currentSound = SOUNDS[sound]

  const getAudioContext = async () => {
    const AudioContext =
      window.AudioContext || window.webkitAudioContext

    if (!AudioContext) {
      return null
    }

    if (!contextRef.current) {
      contextRef.current = new AudioContext()
    }

    if (contextRef.current.state === 'suspended') {
      await contextRef.current.resume()
    }

    return contextRef.current
  }

  const isGroupStart = beat => {
    if (!timeSignature.includes('/8')) {
      return false
    }

    let current = 0

    for (const group of signature.groups) {
      if (beat === current) {
        return true
      }

      current += group
    }

    return false
  }

  const playClick = async ({
    accent = false,
    subdivisionClick = false,
    secondaryAccent = false,
  }) => {
    const context = await getAudioContext()

    if (!context) {
      return
    }

    const selectedSound = SOUNDS[sound]

    const oscillator = context.createOscillator()

    const gain = context.createGain()

    oscillator.type = selectedSound.oscillator

    let frequency = selectedSound.beatFrequency
    let volume = 0.16
    let duration = 0.055

    if (subdivisionClick) {
      frequency = selectedSound.subdivisionFrequency
      volume = 0.07
      duration = 0.035
    }

    if (secondaryAccent) {
      frequency = selectedSound.beatFrequency * 1.12
      volume = 0.19
    }

    if (accent && accentEnabled) {
      frequency = selectedSound.accentFrequency
      volume = 0.28
      duration = 0.075
    }

    oscillator.frequency.value = frequency

    gain.gain.setValueAtTime(volume, context.currentTime)

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      context.currentTime + duration
    )

    oscillator.connect(gain)

    gain.connect(context.destination)

    oscillator.start(context.currentTime)

    oscillator.stop(context.currentTime + duration)
  }

  const stopMetronome = () => {
    setRunning(false)

    clearTimeout(metronomeTimerRef.current)

    beatRef.current = 0

    subdivisionRef.current = 0

    setCurrentBeat(0)

    setCurrentSubdivision(0)

    if (timerMinutes > 0) {
      setRemainingSeconds(timerMinutes * 60)
    }
  }

  const startMetronome = async () => {
    await getAudioContext()

    beatRef.current = 0

    subdivisionRef.current = 0

    setCurrentBeat(0)

    setCurrentSubdivision(0)

    if (timerMinutes > 0) {
      setRemainingSeconds(timerMinutes * 60)
    }

    setRunning(true)
  }

  const toggleMetronome = () => {
    if (running) {
      stopMetronome()
    } else {
      startMetronome()
    }
  }

  useEffect(() => {
    if (!running) {
      return
    }

    const subdivisionInterval =
      60000 / bpm / subdivision

    const tick = () => {
      const beat = beatRef.current

      const sub = subdivisionRef.current

      const firstSubdivision = sub === 0

      const firstBeat = beat === 0

      if (firstSubdivision) {
        playClick({
          accent: firstBeat,
          secondaryAccent:
            !firstBeat && isGroupStart(beat),
        })
      } else {
        playClick({
          subdivisionClick: true,
        })
      }

      setCurrentBeat(beat)

      setCurrentSubdivision(sub)

      subdivisionRef.current += 1

      if (subdivisionRef.current >= subdivision) {
        subdivisionRef.current = 0

        beatRef.current += 1

        if (beatRef.current >= signature.beats) {
          beatRef.current = 0
        }
      }

      metronomeTimerRef.current = setTimeout(
        tick,
        subdivisionInterval
      )
    }

    tick()

    return () => {
      clearTimeout(metronomeTimerRef.current)
    }
  }, [
    running,
    bpm,
    subdivision,
    timeSignature,
    sound,
    accentEnabled,
  ])

  useEffect(() => {
    if (!running || timerMinutes === 0) {
      return
    }

    const countdown = setInterval(() => {
      setRemainingSeconds(previous => {
        if (previous <= 1) {
          clearInterval(countdown)

          setRunning(false)

          clearTimeout(metronomeTimerRef.current)

          return 0
        }

        return previous - 1
      })
    }, 1000)

    return () => clearInterval(countdown)
  }, [running, timerMinutes])

  const changeTimer = minutes => {
    setTimerMinutes(minutes)

    setRemainingSeconds(minutes * 60)
  }

  return (
    <div className="metronome-page">
      <header className="metronome-page__header">
        <div>
          <span className="metronome-page__eyebrow">
            Ferramentas do músico
          </span>

          <h1>Metrônomo</h1>

          <p>
            Controle o tempo, compasso, subdivisões e
            duração da sua sessão de estudo.
          </p>
        </div>

        <div
          className={`metronome-status ${
            running ? 'running' : ''
          }`}
        >
          <span />

          {running ? 'Em execução' : 'Parado'}
        </div>
      </header>

      <div className="metronome-layout">
        <section className="metronome-main">
          <div className="metronome-display">
            <div className="metronome-display__signature">
              {timeSignature}
            </div>

            <div className="metronome-display__bpm">
              {bpm}

              <span>BPM</span>
            </div>

            <div className="metronome-display__timer">
              <span>Tempo restante</span>

              <strong>
                {timerMinutes === 0
                  ? '∞'
                  : formatTimer(remainingSeconds)}
              </strong>
            </div>
          </div>

          <div className="beat-visualizer">
            {Array.from({
              length: signature.beats,
            }).map((_, index) => {
              const first = index === 0

              const groupStart =
                !first && isGroupStart(index)

              return (
                <div
                  key={index}
                  className={[
                    'beat-indicator',

                    currentBeat === index && running
                      ? 'active'
                      : '',

                    first ? 'accent' : '',

                    groupStart
                      ? 'secondary-accent'
                      : '',
                  ].join(' ')}
                >
                  <span>{index + 1}</span>
                </div>
              )
            })}
          </div>

          {subdivision > 1 && (
            <div className="subdivision-visualizer">
              {Array.from({
                length: subdivision,
              }).map((_, index) => (
                <span
                  key={index}
                  className={
                    currentSubdivision === index &&
                    running
                      ? 'active'
                      : ''
                  }
                />
              ))}
            </div>
          )}

          <div className="tempo-control">
            <button
              onClick={() =>
                setBpm(value =>
                  Math.max(30, value - 5)
                )
              }
            >
              −5
            </button>

            <button
              className="tempo-control__small"
              onClick={() =>
                setBpm(value =>
                  Math.max(30, value - 1)
                )
              }
            >
              −
            </button>

            <input
              aria-label="BPM"
              type="range"
              min="30"
              max="240"
              value={bpm}
              onChange={event =>
                setBpm(Number(event.target.value))
              }
            />

            <button
              className="tempo-control__small"
              onClick={() =>
                setBpm(value =>
                  Math.min(240, value + 1)
                )
              }
            >
              +
            </button>

            <button
              onClick={() =>
                setBpm(value =>
                  Math.min(240, value + 5)
                )
              }
            >
              +5
            </button>
          </div>

          <div className="metronome-actions">
            <button
              className={`metronome-play ${
                running ? 'running' : ''
              }`}
              onClick={toggleMetronome}
            >
              <span>
                {running ? '■' : '▶'}
              </span>

              {running ? 'Parar' : 'Iniciar'}
            </button>
          </div>
        </section>

        <aside className="metronome-settings">
          <section className="setting-card">
            <div className="setting-card__header">
              <div>
                <span>01</span>

                <h2>Compasso</h2>
              </div>

              <strong>
                {signature.description}
              </strong>
            </div>

            <div className="signature-sections">
              <div>
                <label>Simples</label>

                <div className="option-grid">
                  {['1/4', '2/4', '3/4', '4/4'].map(
                    signatureOption => (
                      <button
                        key={signatureOption}
                        className={
                          timeSignature ===
                          signatureOption
                            ? 'selected'
                            : ''
                        }
                        onClick={() =>
                          setTimeSignature(
                            signatureOption
                          )
                        }
                      >
                        {signatureOption}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label>Compostos</label>

                <div className="option-grid option-grid--three">
                  {['6/8', '9/8', '12/8'].map(
                    signatureOption => (
                      <button
                        key={signatureOption}
                        className={
                          timeSignature ===
                          signatureOption
                            ? 'selected'
                            : ''
                        }
                        onClick={() =>
                          setTimeSignature(
                            signatureOption
                          )
                        }
                      >
                        {signatureOption}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="setting-card">
            <div className="setting-card__header">
              <div>
                <span>02</span>

                <h2>Subdivisão</h2>
              </div>
            </div>

            <div className="subdivision-options">
              {[
                [1, '♩', 'Sem subdivisão'],
                [2, '♫', 'Duas partes'],
                [3, '♬', 'Três partes'],
                [4, '♩♩', 'Quatro partes'],
              ].map(
                ([
                  value,
                  symbol,
                  description,
                ]) => (
                  <button
                    key={value}
                    className={
                      subdivision === value
                        ? 'selected'
                        : ''
                    }
                    onClick={() =>
                      setSubdivision(value)
                    }
                  >
                    <strong>{symbol}</strong>

                    <span>
                      {description}
                    </span>
                  </button>
                )
              )}
            </div>
          </section>

          <section className="setting-card">
            <div className="setting-card__header">
              <div>
                <span>03</span>

                <h2>Som</h2>
              </div>
            </div>

            <div className="sound-options">
              {Object.entries(SOUNDS).map(
                ([key, option]) => (
                  <button
                    key={key}
                    className={
                      sound === key
                        ? 'selected'
                        : ''
                    }
                    onClick={() => {
                      setSound(key)

                      playClick({
                        accent: true,
                      })
                    }}
                  >
                    <strong>
                      {option.icon}
                    </strong>

                    <span>
                      {option.name}
                    </span>
                  </button>
                )
              )}
            </div>
          </section>

          <section className="setting-card">
            <div className="setting-card__header">
              <div>
                <span>04</span>

                <h2>Acentuação</h2>
              </div>
            </div>

            <button
              className={`accent-toggle ${
                accentEnabled
                  ? 'enabled'
                  : ''
              }`}
              onClick={() =>
                setAccentEnabled(
                  value => !value
                )
              }
            >
              <span className="accent-toggle__switch">
                <i />
              </span>

              <div>
                <strong>
                  Primeiro tempo forte
                </strong>

                <small>
                  Destaca o início de cada
                  compasso
                </small>
              </div>
            </button>
          </section>

          <section className="setting-card">
            <div className="setting-card__header">
              <div>
                <span>05</span>

                <h2>Timer de estudo</h2>
              </div>
            </div>

            <div className="timer-options">
              {TIMER_OPTIONS.map(minutes => (
                <button
                  key={minutes}
                  className={
                    timerMinutes === minutes
                      ? 'selected'
                      : ''
                  }
                  onClick={() =>
                    changeTimer(minutes)
                  }
                >
                  {minutes === 0
                    ? 'Livre'
                    : `${minutes} min`}
                </button>
              ))}
            </div>

            <p className="timer-help">
              Ao terminar o tempo definido, o
              metrônomo será interrompido
              automaticamente.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}