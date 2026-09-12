import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import BackButton from '../../components/ui/BackButton/BackButton'
import { buildScale, scaleTypes, tonics } from '../../data/scales'
import ScaleStaff from './ScaleStaff'
import { loadScaleSamples, scaleSounds } from '../../audio/scaleSamples'
import './ScalesPage.css'

export default function ScaleDetailPage() {
  const { slug } = useParams()
  const type = scaleTypes.find(item => item.slug === slug)
  return type ? <ScaleLab key={slug} type={type} /> : <div className="scales-page"><BackButton to="/escalas">Voltar às escalas</BackButton><h1>Escala não encontrada</h1></div>
}

function ScaleLab({ type }) {
  const [tonic, setTonic] = useState(type.slug === 'diatonica' ? 'C' : 'A')
  const [direction, setDirection] = useState('ascending')
  const [bpm, setBpm] = useState(100)
  const [volume, setVolume] = useState(60)
  const [sound, setSound] = useState('piano')
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState('')
  const engine = useRef({ context: null, gain: null, voices: [], frame: null, request: 0, samples: new Map(), effects: new Set(), volume: 60 })
  const notes = buildScale(tonic, type, direction)

  function cancel() {
    const state = engine.current
    state.request += 1
    cancelAnimationFrame(state.frame)
    state.voices.forEach(voice => { try { voice.stop() } catch {} })
    state.voices = []
    state.effects.forEach(reset => reset())
  }

  function stop() { cancel(); setActive(-1); setPlaying(false); setLoading(false) }

  useEffect(() => {
    const state = engine.current
    window.scrollTo({ top: 0, behavior: 'auto' })
    return () => { cancel(); state.context?.close().catch(() => {}) }
  }, [])

  useEffect(() => {
    const state = engine.current
    state.volume = volume
    if (state.gain) state.gain.gain.setTargetAtTime(volume / 100, state.context.currentTime, .015)
  }, [volume])

  async function play(indices) {
    stop()
    setError('')
    const state = engine.current
    const request = state.request
    setLoading(true)
    try {
      if (!state.context) {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        if (!AudioContext) throw new Error('Audio unavailable')
        state.context = new AudioContext()
        state.gain = state.context.createGain()
        state.gain.connect(state.context.destination)
      }
      await state.context.resume()
      if (request !== state.request) return
      if (!state.samples.has(sound)) {
        const pending = loadScaleSamples(state.context, state.gain, sound).catch(error => {
          state.samples.delete(sound)
          throw error
        })
        state.samples.set(sound, pending)
      }
      const instrument = await state.samples.get(sound)
      if (request !== state.request) return
      if (instrument.stopEffects) state.effects.add(instrument.stopEffects)
      state.gain.gain.value = state.volume / 100
      setLoading(false)
      const start = state.context.currentTime + .04
      const step = 60 / bpm
      indices.forEach((index, order) => {
        const time = start + order * step
        const voice = instrument.play(notes[index].midi, time, step * .8)
        state.voices.push(voice)
      })
      setPlaying(true)
      function update() {
        if (request !== state.request) return
        const elapsed = state.context.currentTime - start
        const index = Math.floor(elapsed / step)
        if (index >= indices.length) {
          setActive(-1)
          if (elapsed >= indices.length * step + (instrument.tailTime || .15)) { state.voices = []; setPlaying(false); return }
        } else {
        setActive(index < 0 ? -1 : indices[index])
        }
        state.frame = requestAnimationFrame(update)
      }
      update()
    } catch {
      if (request === state.request) { stop(); setError('Não foi possível carregar ou reproduzir os samples. Verifique a conexão e toque em ouvir para tentar novamente.') }
    }
  }

  const melodicDown = type.slug === 'menor-melodica' && direction === 'descending'
  return <div className="scales-page scale-detail">
    <BackButton to="/escalas">Voltar às escalas</BackButton>
    <header className="scale-heading"><span>ESTUDO INTERATIVO</span><h1>{type.title}</h1><p>{type.concept}</p></header>
    <section className="scale-lab" aria-label="Laboratório de escalas">
      <div className="scale-settings">
        <label className="scale-sound">Som<select value={sound} onChange={event => { stop(); setError(''); setSound(event.target.value) }}>{scaleSounds.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        <label>Tônica<select value={tonic} onChange={event => { stop(); setTonic(event.target.value) }}>{tonics.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        <label>Sentido<select value={direction} onChange={event => { stop(); setDirection(event.target.value) }}><option value="ascending">Ascendente</option><option value="descending">Descendente</option></select></label>
        <label>Andamento · {bpm} BPM<input type="range" min="40" max="180" step="5" value={bpm} onChange={event => { stop(); setBpm(Number(event.target.value)) }} /></label>
        <label>Volume · {volume}%<input type="range" min="0" max="100" value={volume} onChange={event => setVolume(Number(event.target.value))} /></label>
      </div>
      <div className="scale-lab-heading"><h2>{tonics.find(item => item.id === tonic).label} · {direction === 'ascending' ? 'Subida' : 'Descida'}</h2><p>{melodicDown ? 'Na descida, usamos as notas da menor natural.' : 'Toque em uma nota para ouvi-la ou reproduza a escala completa.'}</p></div>
      <ScaleStaff notes={notes} active={active} onNote={index => play([index])} />
      <p className="scale-notation-help">Clave de Sol · Acidentes escritos junto às notas, sem armadura. No celular, deslize a pauta para os lados.</p>
      <div className="scale-note-buttons">{notes.map((note, index) => <button type="button" key={index} className={active === index ? 'is-active' : ''} aria-label={`Ouvir ${note.name}${note.octave}`} onClick={() => play([index])}><strong>{note.name}</strong><span>{note.degree}º grau</span></button>)}</div>
      <div className="scale-playback"><button type="button" onClick={() => play(notes.map((_, index) => index))}>▶ Ouvir escala</button><button type="button" disabled={!playing && !loading} onClick={stop}>■ Parar</button></div>
      <p className="scale-status" role="status">{error || (loading ? `Carregando samples de ${scaleSounds.find(item => item.id === sound).label}…` : playing ? active < 0 ? 'Reproduzindo…' : `Tocando ${notes[active].name}${notes[active].octave}` : 'Pronto para ouvir')}</p>
    <p className="scale-notation-help">Piano: samples Salamander, como no Piano Digital. Clarinete, Violino e Sax alto usam samples inclu?dos no site. <a href={`${process.env.PUBLIC_URL}/audio/scales/CREDITS.txt`} target="_blank" rel="noreferrer">Cr?ditos dos samples</a>.</p>
    </section>
    <aside className="scale-explanation"><h2>Como a escala é formada</h2><p>{direction === 'ascending' ? type.formula : notes.slice(1).map((note, index) => { const gap = notes[index].midi - note.midi; return gap === 1 ? 'S' : gap === 2 ? 'T' : '3S' }).join(' · ')}</p><p>T = tom · S = semitom · 3S = três semitons (segunda aumentada).</p><p>Escute, cante as notas e observe como os intervalos mudam a sonoridade. O áudio usa um timbre sintetizado com referência Lá = 440 Hz.</p><a href="https://musictheory.pugetsound.edu/mt21c/MinorScales.html" target="_blank" rel="noreferrer">Referência de estudo: escalas menores</a></aside>
  </div>
}
