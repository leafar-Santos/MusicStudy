import BackButton from '../../components/ui/BackButton/BackButton'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './TuningForkPage.css'

export default function TuningForkPage() {
  const audioRef = useRef(null)
  const requestRef = useRef(0)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [volume, setVolume] = useState(70)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    const audio = audioRef.current
    return () => {
      requestRef.current += 1
      audio.pause()
    }
  }, [])

  useEffect(() => {
    audioRef.current.volume = volume / 100
  }, [volume])

  async function strike() {
    const audio = audioRef.current
    const request = ++requestRef.current
    setError('')
    setLoading(true)
    setPlaying(false)
    try {
      audio.pause()
      // Reload after a network failure so the next strike can retry.
      if (audio.error) audio.load()
      audio.currentTime = 0
      await audio.play()
      if (request === requestRef.current) setLoading(false)
    } catch (err) {
      if (request !== requestRef.current) return
      setPlaying(false)
      setLoading(false)
      setError('Não foi possível reproduzir o som. Toque novamente para tentar de novo.')
    }
  }

  function stop() {
    requestRef.current += 1
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setPlaying(false)
    setLoading(false)
  }

  return (
    <div className="tuning-fork-page">
      <BackButton to="/ferramentas">Voltar às ferramentas</BackButton>
      <header className="tuning-fork-hero">
        <span>REFERÊNCIA DE AFINAÇÃO</span>
        <h1>Diapasão</h1>
        <p>Uma nota para encontrar o seu tom. Toque no diapasão e escute o Lá de referência.</p>
      </header>

      <section className="tuning-fork-lab" aria-label="Diapasão interativo">
        <div className="tuning-fork-stage">
          <button type="button" onClick={strike} className={`tuning-fork-visual${playing ? ' is-playing' : ''}`} aria-label="Percutir o diapasão: Lá 440 Hz">
            <svg viewBox="0 0 320 400" aria-hidden="true">
              <defs>
                <linearGradient id="fork-metal"><stop stopColor="#8494af"/><stop offset=".45" stopColor="#f4f8ff"/><stop offset="1" stopColor="#8399b6"/></linearGradient>
              </defs>
              <ellipse cx="160" cy="372" rx="70" ry="9" fill="#000" opacity=".25"/>
              <g className="tuning-fork-waves" fill="none" stroke="#d7ad62" strokeWidth="3" strokeLinecap="round">
                <path d="M78 65q-30 60 0 120m-24-139q-40 80 0 160M242 65q30 60 0 120m24-139q40 80 0 160"/>
              </g>
              <g className="tuning-fork-prongs" fill="none" stroke="url(#fork-metal)" strokeWidth="19" strokeLinecap="round">
                <path d="M116 40v170a44 44 0 0 0 88 0V40"/>
              </g>
              <path d="M160 254v96" stroke="url(#fork-metal)" strokeWidth="21" strokeLinecap="round"/>
              <text x="160" y="162" textAnchor="middle" fill="#f2dfb4" fontSize="17">440 Hz</text>
            </svg>
            <span>Toque para percutir</span>
          </button>
        </div>

        <div className="tuning-fork-controls">
          <span className="tuning-fork-eyebrow">DIAPASÃO INTERATIVO</span>
          <h2>Lá <small>A4</small></h2>
          <p className="tuning-fork-frequency">440 <span>Hz</span></p>
          <p>Ouça o ataque e a ressonância de um diapasão real. O som diminui naturalmente até desaparecer.</p>
          <div className="tuning-fork-actions">
            <button type="button" onClick={strike}>{playing ? 'Percutir novamente' : 'Percutir diapasão'}</button>
            <button type="button" onClick={stop} disabled={!playing && !loading}>Parar som</button>
          </div>
          <label className="tuning-fork-volume" htmlFor="fork-volume">Volume <span>{volume}%</span>
            <input id="fork-volume" type="range" min="0" max="100" value={volume} onChange={event => setVolume(Number(event.target.value))} />
          </label>
          <p className="tuning-fork-status" role="status">{error || (loading ? 'Carregando áudio…' : playing ? 'Diapasão vibrando · Lá 440 Hz' : 'Pronto para tocar · use clique, toque, Enter ou Espaço no diapasão.')}</p>
        </div>
        <audio ref={audioRef} src={`${process.env.PUBLIC_URL}/audio/diapasao.mp3`} preload="none"
          onPlaying={() => { setPlaying(true); setLoading(false) }}
          onPause={() => setPlaying(false)}
          onEnded={() => { setPlaying(false); setLoading(false) }}
          onError={() => { setPlaying(false); setLoading(false); setError('Não foi possível carregar o áudio. Toque no diapasão para tentar novamente.') }} />
      </section>

      <section className="tuning-fork-guide" aria-label="Sobre o diapasão">
        <article>
          <h2>O que é um diapasão?</h2>
          <p>É uma peça de metal em forma de U que, ao receber uma leve batida, vibra e produz uma nota de altura estável. Seu som é quase puro, com uma frequência predominante. Este diapasão soa em Lá 440 Hz: suas hastes vibram aproximadamente 440 vezes por segundo.</p>
          <h2>Para que ele serve?</h2>
          <p>O diapasão oferece uma referência para afinar instrumentos e encontrar a nota inicial ao cantar. Também ajuda a treinar a percepção de altura e a comparar notas de ouvido. Ele emite uma nota fixa; para medir a afinação do seu instrumento, use o <Link to="/ferramentas/afinador">afinador</Link>.</p>
        </article>
        <article>
          <h2>Experimente ouvir e comparar</h2>
          <ol>
            <li>Toque no diapasão e escute atentamente o Lá.</li>
            <li>Cante a nota ou toque o Lá na mesma oitava em seu instrumento.</li>
            <li>Compare os sons. Pulsações ou “batimentos” podem indicar frequências próximas, mas diferentes.</li>
            <li>Ajuste a afinação aos poucos e toque o diapasão novamente para conferir.</li>
          </ol>
          <p>Em um diapasão físico, apoiar a base em uma caixa de ressonância ajuda a tornar o som mais audível.</p>
        </article>
      </section>
    </div>
  )
}
