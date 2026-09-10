import { Link } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import './PianoInstrumentPage.css'

const NOTE_DATA = [
  ['C4',261.63,'white','A'],['C#4',277.18,'black','W'],['D4',293.66,'white','S'],['D#4',311.13,'black','E'],
  ['E4',329.63,'white','D'],['F4',349.23,'white','F'],['F#4',369.99,'black','T'],['G4',392.00,'white','G'],
  ['G#4',415.30,'black','Y'],['A4',440.00,'white','H'],['A#4',466.16,'black','U'],['B4',493.88,'white','J'],
  ['C5',523.25,'white','K'],['C#5',554.37,'black','O'],['D5',587.33,'white','L'],['D#5',622.25,'black','P'],
  ['E5',659.25,'white',';'],['F5',698.46,'white',"'"],['F#5',739.99,'black',']'],['G5',783.99,'white','Z'],
  ['G#5',830.61,'black','X'],['A5',880.00,'white','C'],['A#5',932.33,'black','V'],['B5',987.77,'white','B'],
].map(([note, frequency, type, shortcut]) => ({ note, frequency, type, shortcut }))

const SAMPLE_MAP = {
  A0:'A0.mp3', C1:'C1.mp3', 'D#1':'Ds1.mp3', 'F#1':'Fs1.mp3',
  A1:'A1.mp3', C2:'C2.mp3', 'D#2':'Ds2.mp3', 'F#2':'Fs2.mp3',
  A2:'A2.mp3', C3:'C3.mp3', 'D#3':'Ds3.mp3', 'F#3':'Fs3.mp3',
  A3:'A3.mp3', C4:'C4.mp3', 'D#4':'Ds4.mp3', 'F#4':'Fs4.mp3',
  A4:'A4.mp3', C5:'C5.mp3', 'D#5':'Ds5.mp3', 'F#5':'Fs5.mp3',
  A5:'A5.mp3', C6:'C6.mp3', 'D#6':'Ds6.mp3', 'F#6':'Fs6.mp3',
  A6:'A6.mp3', C7:'C7.mp3',
}

function loadTone() {
  if (window.Tone) return Promise.resolve(window.Tone)
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-tonejs="true"]')
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Tone), { once: true })
      existing.addEventListener('error', reject, { once: true })
      return
    }
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js'
    script.async = true
    script.dataset.tonejs = 'true'
    script.onload = () => resolve(window.Tone)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export default function PianoInstrumentPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])
  const [activeNote, setActiveNote] = useState('')
  const [status, setStatus] = useState('Carregando piano...')
  const [samplesReady, setSamplesReady] = useState(false)
  const [audioStarted, setAudioStarted] = useState(false)
  const [sustain, setSustain] = useState(false)
  const [labelsVisible, setLabelsVisible] = useState(true)
  const [volume, setVolume] = useState(-8)
  const [reverb, setReverb] = useState(0.17)

  const samplerRef = useRef(null)
  const masterRef = useRef(null)
  const reverbRef = useRef(null)
  const toneRef = useRef(null)
  const heldRef = useRef(new Set())

  const whiteNotes = useMemo(() => NOTE_DATA.filter(note => note.type === 'white'), [])
  const blackNotes = useMemo(() => NOTE_DATA.map((note, index) => ({ ...note, index })).filter(note => note.type === 'black'), [])
  const whiteWidth = 100 / whiteNotes.length

  useEffect(() => {
    let cancelled = false

    async function setupPiano() {
      try {
        const Tone = await loadTone()
        if (cancelled) return
        toneRef.current = Tone

        const reverbNode = new Tone.Reverb({ decay: 2.2, wet: reverb }).toDestination()
        const masterNode = new Tone.Volume(volume).connect(reverbNode)
        const sampler = new Tone.Sampler({
          urls: SAMPLE_MAP,
          release: 1.25,
          baseUrl: 'https://tonejs.github.io/audio/salamander/',
        }).connect(masterNode)

        reverbRef.current = reverbNode
        masterRef.current = masterNode
        samplerRef.current = sampler

        await Tone.loaded()
        if (cancelled) return
        setSamplesReady(true)
        setStatus('Piano pronto')
      } catch {
        if (!cancelled) setStatus('Falha ao carregar os samples. Verifique a internet.')
      }
    }

    setupPiano()

    return () => {
      cancelled = true
      samplerRef.current?.dispose?.()
      masterRef.current?.dispose?.()
      reverbRef.current?.dispose?.()
    }
  }, [])

  useEffect(() => {
    if (masterRef.current) masterRef.current.volume.rampTo(Number(volume), 0.05)
  }, [volume])

  useEffect(() => {
    if (reverbRef.current) reverbRef.current.wet.rampTo(Number(reverb), 0.1)
  }, [reverb])

  async function ensureAudio() {
    const Tone = toneRef.current
    if (!Tone) return false
    await Tone.start()
    setAudioStarted(true)
    return true
  }

  async function attack(noteName) {
    if (!samplesReady || heldRef.current.has(noteName)) return
    const ok = await ensureAudio()
    if (!ok || !samplerRef.current) return

    heldRef.current.add(noteName)
    samplerRef.current.triggerAttack(noteName, toneRef.current.now(), 0.85)
    setActiveNote(noteName)
  }

  function release(noteName) {
    heldRef.current.delete(noteName)
    if (!sustain && samplerRef.current && toneRef.current) {
      samplerRef.current.triggerRelease(noteName, toneRef.current.now())
    }
  }

  function releaseUnheldNotes() {
    if (!samplerRef.current || !toneRef.current) return
    NOTE_DATA.forEach(({ note }) => {
      if (!heldRef.current.has(note)) samplerRef.current.triggerRelease(note, toneRef.current.now())
    })
  }

  useEffect(() => {
    const keyMap = Object.fromEntries(NOTE_DATA.map(({ shortcut, note }) => [shortcut.toUpperCase(), note]))

    const onKeyDown = event => {
      if (event.repeat) return
      const target = event.target
      const editable = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement
      if (editable) return

      if (event.code === 'Space') {
        event.preventDefault()
        setSustain(true)
        return
      }

      const note = keyMap[event.key.toUpperCase()]
      if (note) attack(note)
    }

    const onKeyUp = event => {
      if (event.code === 'Space') {
        setSustain(false)
        releaseUnheldNotes()
        return
      }
      const note = keyMap[event.key.toUpperCase()]
      if (note) release(note)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [samplesReady, sustain])

  function toggleSustain() {
    setSustain(current => {
      const next = !current
      if (!next) window.setTimeout(releaseUnheldNotes, 0)
      return next
    })
  }

  const activeFrequency = NOTE_DATA.find(note => note.note === activeNote)?.frequency

  return (
    <div className="piano-instrument-page">
      <Link className="piano-instrument-page__back" to="/instrumentos"><span>←</span><span>Voltar aos instrumentos</span></Link>

      <div className="piano-digital">
        <div className="piano-digital__top">
          <div>
            <span className="piano-digital__eyebrow">Music Lab</span>
            <h1>Piano Digital</h1>
            <p>Gravações reais de piano em vez de osciladores sintetizados.</p>
          </div>
          <div className={`piano-digital__badge ${samplesReady ? 'is-ready' : ''}`}>
            {samplesReady ? '● Piano pronto' : status}
          </div>
        </div>

        <section className="piano-digital__panel">
          <div className="piano-digital__display-grid">
            <div className="piano-digital__screen">
              <div className="piano-digital__label">Nota atual</div>
              <div className="piano-digital__note">{activeNote || '—'}</div>
              <div className="piano-digital__frequency">
                {activeFrequency ? `${activeFrequency.toFixed(2)} Hz` : samplesReady ? 'Clique em “Ativar piano”' : 'Aguardando samples...'}
              </div>
              <div className="piano-digital__status-line">
                <span>Samples: {samplesReady ? 'prontos' : 'carregando'}</span>
                <span>Instrumento: Salamander Grand Piano</span>
              </div>
              <div className="piano-digital__loadbar"><div style={{ width: samplesReady ? '100%' : '18%' }} /></div>
            </div>

            <div className="piano-digital__controls">
              <div className="piano-control">
                <label htmlFor="piano-volume">Volume</label>
                <input id="piano-volume" type="range" min="-36" max="3" step="1" value={volume} onChange={event => setVolume(event.target.value)} />
              </div>

              <div className="piano-control">
                <label>Sustain</label>
                <button type="button" className={sustain ? 'is-active' : ''} onClick={toggleSustain}>{sustain ? 'Ligado' : 'Desligado'}</button>
              </div>

              <div className="piano-control">
                <label htmlFor="piano-reverb">Reverb</label>
                <input id="piano-reverb" type="range" min="0" max="0.6" step="0.01" value={reverb} onChange={event => setReverb(event.target.value)} />
              </div>

              <div className="piano-control">
                <label>Atalhos</label>
                <button type="button" onClick={() => setLabelsVisible(value => !value)}>{labelsVisible ? 'Ocultar atalhos' : 'Mostrar atalhos'}</button>
              </div>

              <div className="piano-control piano-control--wide">
                <label>Áudio</label>
                <button
                  type="button"
                  className={`piano-control__primary ${audioStarted ? 'is-active' : ''}`}
                  disabled={!samplesReady}
                  onClick={ensureAudio}
                >
                  {audioStarted ? 'Piano ativado' : samplesReady ? 'Ativar piano' : 'Carregando piano...'}
                </button>
              </div>
            </div>
          </div>

          <div className="piano-keyboard-wrap">
            <div className="piano-keyboard" aria-label="Teclado virtual de piano">
              <div className="piano-keyboard__white-row">
                {whiteNotes.map(note => (
                  <button
                    type="button"
                    key={note.note}
                    className={`piano-key piano-key--white ${activeNote === note.note ? 'is-active' : ''}`}
                    onPointerDown={() => attack(note.note)}
                    onPointerUp={() => release(note.note)}
                    onPointerLeave={() => release(note.note)}
                  >
                    <span>{note.note}</span>
                    {labelsVisible && <em>{note.shortcut}</em>}
                  </button>
                ))}
              </div>

              {blackNotes.map(note => {
                const previousWhites = NOTE_DATA.slice(0, note.index).filter(item => item.type === 'white').length
                const left = `${(previousWhites * whiteWidth) - (whiteWidth * 0.28)}%`
                return (
                  <button
                    type="button"
                    key={note.note}
                    className={`piano-key piano-key--black ${activeNote === note.note ? 'is-active' : ''}`}
                    style={{ left: `calc(10px + ${left})` }}
                    onPointerDown={() => attack(note.note)}
                    onPointerUp={() => release(note.note)}
                    onPointerLeave={() => release(note.note)}
                  >
                    <span>{note.note.replace(/\d/, '')}</span>
                    {labelsVisible && <em>{note.shortcut}</em>}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="piano-digital__footer">
            <strong>Teclado físico:</strong> A W S E D F T G Y H U J K O L P ; ' ] Z X C V B
            <div>Os samples são carregados pela internet. Após o cache do navegador, os próximos carregamentos tendem a ser mais rápidos.</div>
          </div>
        </section>
      </div>
    </div>
  )
}
