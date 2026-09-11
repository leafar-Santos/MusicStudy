import { useRef, useState } from 'react'
import './VirtualInstrument.css'

const NOTES = [
  ['C4',261.63],['C#4',277.18],['D4',293.66],['D#4',311.13],['E4',329.63],['F4',349.23],
  ['F#4',369.99],['G4',392],['G#4',415.30],['A4',440],['A#4',466.16],['B4',493.88],
  ['C5',523.25],['D5',587.33],['E5',659.25],['F5',698.46],['G5',783.99]
]

function profile(engine){
  return {
    strings:{type:'sawtooth', attack:.08, release:1.4, filter:1800},
    flute:{type:'sine', attack:.08, release:.7, filter:4200},
    reed:{type:'square', attack:.05, release:.8, filter:1500},
    clarinet:{type:'square', attack:.05, release:.9, filter:1250},
    brass:{type:'sawtooth', attack:.04, release:.9, filter:1100},
    percussion:{type:'triangle', attack:.002, release:.22, filter:3000},
  }[engine] || {type:'triangle',attack:.03,release:.8,filter:2400}
}

export default function VirtualInstrument({ name, engine='strings' }) {
  const [active,setActive]=useState('')
  const contextRef=useRef(null)

  function play(note,hz){
    const AudioContext=window.AudioContext||window.webkitAudioContext
    if(!AudioContext) return
    const ctx=contextRef.current || new AudioContext()
    contextRef.current=ctx
    const p=profile(engine)
    const osc=ctx.createOscillator(), gain=ctx.createGain(), filter=ctx.createBiquadFilter()
    osc.type=p.type; osc.frequency.value=engine==='percussion'?Math.max(80,hz/3):hz
    filter.type='lowpass'; filter.frequency.value=p.filter
    const now=ctx.currentTime
    gain.gain.setValueAtTime(.0001,now)
    gain.gain.exponentialRampToValueAtTime(engine==='percussion'?.35:.16,now+p.attack)
    gain.gain.exponentialRampToValueAtTime(.0001,now+p.release)
    osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination)
    osc.start(now); osc.stop(now+p.release+.05)
    setActive(note); window.setTimeout(()=>setActive(''),Math.max(220,p.release*700))
  }

  return <section className={`virtual-instrument virtual-instrument--${engine}`}>
    <div className="virtual-instrument__head">
      <div><span>Instrumento virtual</span><h2>{name}</h2></div>
      <div className="virtual-instrument__display">{active || 'Toque uma nota'}</div>
    </div>
    {engine==='percussion' ? (
      <div className="virtual-instrument__pads">
        {['Bumbo','Caixa','Tom 1','Tom 2','Prato','Triângulo'].map((label,i)=>
          <button key={label} onClick={()=>play(label,NOTES[i+2][1])}><strong>{label}</strong><small>tocar</small></button>
        )}
      </div>
    ) : (
      <div className="virtual-instrument__keys">
        {NOTES.map(([note,hz])=><button className={note.includes('#')?'is-sharp':''} key={note} onClick={()=>play(note,hz)}>
          <strong>{note}</strong><small>{hz.toFixed(1)} Hz</small>
        </button>)}
      </div>
    )}
    <p className="virtual-instrument__hint">Demonstração interativa do registro e da sonoridade. O timbre é modelado no navegador para estudo de referência.</p>
  </section>
}