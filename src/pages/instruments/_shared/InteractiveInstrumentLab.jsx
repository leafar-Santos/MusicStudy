import { Link } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import './InteractiveInstrumentLab.css'

const NOTE_INDEX = { C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11 }
const CHROMATIC = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

function noteToMidi(note){
  const m=note.match(/^([A-G])([#b]?)(-?\d+)$/); if(!m) return 60
  return (Number(m[3])+1)*12+NOTE_INDEX[`${m[1]}${m[2]}`]
}
function midiToNote(m){ return `${CHROMATIC[((m%12)+12)%12]}${Math.floor(m/12)-1}` }
function pretty(note){ return note?.replace('#','♯').replace('b','♭') ?? '—' }
function freq(note){ return 440*Math.pow(2,(noteToMidi(note)-69)/12) }

function loadSoundfont(){
  if(window.Soundfont) return Promise.resolve(window.Soundfont)
  return new Promise((resolve,reject)=>{
    const existing=document.querySelector('script[data-soundfont-player="true"]')
    if(existing){
      if(window.Soundfont){resolve(window.Soundfont);return}
      existing.addEventListener('load',()=>resolve(window.Soundfont),{once:true})
      existing.addEventListener('error',reject,{once:true}); return
    }
    const s=document.createElement('script')
    s.src='https://cdn.jsdelivr.net/npm/soundfont-player@0.12.0/dist/soundfont-player.min.js'
    s.async=true; s.dataset.soundfontPlayer='true'; s.onload=()=>resolve(window.Soundfont); s.onerror=reject
    document.head.appendChild(s)
  })
}

function buildChromatic(min,max,transpose=0){
  const a=noteToMidi(min), b=noteToMidi(max), out=[]
  for(let m=a;m<=b;m++) out.push({ written:midiToNote(m), sounding:midiToNote(m+transpose) })
  return out
}

function stringPosition(note, strings){
  const midi=noteToMidi(note)
  let best=null
  strings.forEach((s,i)=>{
    const open=noteToMidi(s.note), semitones=midi-open
    if(semitones>=0 && semitones<=7){
      const candidate={stringIndex:i,semitones, finger:semitones===0?0:Math.min(4,Math.ceil(semitones/2))}
      if(!best || semitones<best.semitones) best=candidate
    }
  })
  return best || {stringIndex:0,semitones:0,finger:0}
}

const WOODWIND_CONTROLS=['thumb','register','l1','l2','l3','r1','r2','r3','side1','side2']
function woodwindFingering(note, lowest='C4'){
  const steps=Math.max(0,noteToMidi(note)-noteToMidi(lowest))
  const normalized=steps%12
  const closed=Math.max(0,6-Math.min(6,normalized))
  const result=['thumb']
  for(let i=0;i<closed;i++) result.push(i<3?`l${i+1}`:`r${i-2}`)
  if(steps>=12) result.push('register')
  if([1,3,6,8,10].includes(normalized)) result.push(normalized<7?'side1':'side2')
  return result
}

function brassValves(note, base='C4'){
  const n=((noteToMidi(note)-noteToMidi(base))%12+12)%12
  const map={0:[],1:[1,2,3],2:[1,3],3:[2,3],4:[1,2],5:[1],6:[2],7:[],8:[2,3],9:[1,2],10:[1],11:[2]}
  return map[n]||[]
}
function trombonePosition(note, base='Bb2'){
  const n=((noteToMidi(note)-noteToMidi(base))%12+12)%12
  const map={0:1,1:7,2:6,3:5,4:4,5:3,6:2,7:1,8:4,9:3,10:2,11:1}
  return map[n]||1
}

function StringVisual({config,note}){
  const pos=stringPosition(note.written,config.strings)
  const y=14+(1-Math.pow(2,-pos.semitones/12))*70
  return <div className="ii-string-visual">
    <div className={`ii-string-body ii-string-body--${config.visual || 'violin'}`}>
      <div className="ii-string-body__neck"/><div className="ii-string-body__fingerboard"/>
      <div className="ii-string-body__upper"/><div className="ii-string-body__waist"/><div className="ii-string-body__lower"/>
      <div className="ii-string-body__bridge"/><div className="ii-string-body__tail"/>
      {config.strings.map((s,i)=><div key={s.note} className={`ii-string-line ${i===pos.stringIndex?'is-active':''}`} style={{left:`${43+i*(14/(config.strings.length-1||1))}%`}} />)}
      <div className={`ii-finger-dot ${pos.finger===0?'is-open':''}`} style={{left:`${43+pos.stringIndex*(14/(config.strings.length-1||1))}%`,top:`${y}%`}}>{pos.finger===0?'○':pos.finger}</div>
    </div>
    <div className="ii-visual-caption"><b>{config.strings[pos.stringIndex]?.name}</b><span>{pos.finger===0?'Corda solta':`${pos.finger}º dedo • 1ª posição`}</span></div>
  </div>
}

function WoodwindVisual({config,note}){
  const active=new Set((config.fingerings&&config.fingerings[note.written])||woodwindFingering(note.written,config.lowest))
  return <div className="ii-woodwind-visual">
    <div className={`ii-woodwind ii-woodwind--${config.visual || 'clarinet'}`}>
      <div className="ii-woodwind__top"/><div className="ii-woodwind__body"/><div className="ii-woodwind__bell"/>
      <div className={`ii-ww-control ii-ww-control--thumb ${active.has('thumb')?'is-active':''}`}>T</div>
      <div className={`ii-ww-control ii-ww-control--register ${active.has('register')?'is-active':''}`}>R</div>
      {['l1','l2','l3','r1','r2','r3'].map((id,i)=><div key={id} className={`ii-ww-hole ii-ww-hole--${i+1} ${active.has(id)?'is-active':''}`}>{i<3?i+1:i-2}</div>)}
      <div className={`ii-ww-side ii-ww-side--1 ${active.has('side1')?'is-active':''}`}>A</div>
      <div className={`ii-ww-side ii-ww-side--2 ${active.has('side2')?'is-active':''}`}>B</div>
    </div>
    <div className="ii-visual-caption"><b>{pretty(note.written)}</b><span>{active.size ? `${active.size} controles destacados` : 'Digitação aberta'}</span></div>
  </div>
}

function BrassVisual({config,note}){
  const valves=brassValves(note.written,config.base)
  return <div className="ii-brass-visual">
    <div className={`ii-brass ii-brass--${config.visual || 'trumpet'}`}>
      <div className="ii-brass__mouthpiece"/><div className="ii-brass__tube"/><div className="ii-brass__bell"/>
      <div className="ii-brass__valves">{[1,2,3].map(v=><div key={v} className={`ii-valve ${valves.includes(v)?'is-active':''}`}><span>{v}</span></div>)}</div>
    </div>
    <div className="ii-visual-caption"><b>{valves.length?`Válvulas ${valves.join(' + ')}`:'Aberto'}</b><span>Combinação principal</span></div>
  </div>
}

function TromboneVisual({note,config}){
  const p=trombonePosition(note.written,config.base)
  return <div className="ii-trombone-visual">
    <div className="ii-trombone"><div className="ii-trombone__bell"/><div className="ii-trombone__body"/><div className="ii-trombone__slide" style={{transform:`translateX(${(p-1)*10}px)`}}/><div className="ii-trombone__grip"/></div>
    <div className="ii-visual-caption"><b>{p}ª posição</b><span>Posição aproximada da vara</span></div>
  </div>
}

function PercussionVisual({activePad,onPad,config,ready}){
  return <div className="ii-percussion-visual"><div className="ii-percussion-kit">
    {config.pads.map((p,i)=><button key={p.id} type="button" disabled={!ready} onClick={()=>onPad(p)} className={`ii-drum-pad ii-drum-pad--${i+1} ${activePad===p.id?'is-active':''}`}><b>{p.label}</b><span>{p.key}</span></button>)}
  </div><div className="ii-visual-caption"><b>Kit interativo</b><span>Toque nos próprios pads ou nos botões</span></div></div>
}

export default function InteractiveInstrumentLab({config}){
  useEffect(()=>{
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  },[])
  const notes=useMemo(()=>{
    if(config.family==='percussion') return []
    if(config.notes) return config.notes
    if(!config.range?.[0] || !config.range?.[1]) return []
    return buildChromatic(config.range[0],config.range[1],config.transpose||0)
  },[config])
  const [selected,setSelected]=useState(notes[0] || null)
  const [playing,setPlaying]=useState(null)
  const [ready,setReady]=useState(false)
  const [status,setStatus]=useState('Carregando samples...')
  const [volume,setVolume]=useState(.82)
  const [activePad,setActivePad]=useState(null)
  const ctxRef=useRef(null), instrumentRef=useRef(null), nodeRef=useRef(null), timerRef=useRef(null)

  useEffect(()=>{
    let cancelled=false
    async function setup(){
      try{
        const Soundfont=await loadSoundfont(); if(cancelled)return
        const AC=window.AudioContext||window.webkitAudioContext; if(!AC) throw new Error('Web Audio API indisponível')
        const ctx=new AC(); ctxRef.current=ctx
        if(config.family==='percussion'){
          const loaded={}
          const uniqueInstruments=[...new Set((config.pads||[]).map(p=>p.instrument))]
          for(const instrumentName of uniqueInstruments){
            try{
              loaded[instrumentName]=await Soundfont.instrument(ctx,instrumentName,{soundfont:'MusyngKite',format:'mp3'})
            }catch(primaryError){
              console.warn(`Falha no MusyngKite para ${instrumentName}. Tentando FluidR3_GM.`,primaryError)
              try{
                loaded[instrumentName]=await Soundfont.instrument(ctx,instrumentName,{soundfont:'FluidR3_GM',format:'mp3'})
              }catch(fallbackError){
                console.warn(`Não foi possível carregar ${instrumentName}.`,fallbackError)
              }
            }
          }
          if(!Object.keys(loaded).length) throw new Error('Nenhum sample de percussão pôde ser carregado.')
          instrumentRef.current=loaded
        }else{
          instrumentRef.current=await Soundfont.instrument(ctx,config.soundfontInstrument,{soundfont:config.soundfont||'MusyngKite',format:'mp3'})
        }
        if(cancelled)return; setReady(true); setStatus(`${config.name} pronto`)
      }catch(e){console.error(e); if(!cancelled)setStatus('Não foi possível carregar os samples.')}
    }
    setup()
    return()=>{cancelled=true;clearTimeout(timerRef.current);try{nodeRef.current?.stop?.()}catch{};try{ctxRef.current?.close?.()}catch{}}
  },[config])

  async function ensureAudio(){const c=ctxRef.current;if(!c)return false;if(c.state==='suspended')await c.resume();return true}
  async function play(note){
    setSelected(note); if(!ready||!instrumentRef.current||!(await ensureAudio()))return
    clearTimeout(timerRef.current); try{nodeRef.current?.stop?.()}catch{}
    const n=config.playWritten?note.written:note.sounding
    const node=instrumentRef.current.play(n,ctxRef.current.currentTime,{gain:volume,duration:2.1});nodeRef.current=node;setPlaying(note.written)
    timerRef.current=setTimeout(()=>setPlaying(null),2100)
  }
  async function playPad(p){
    if(!ready||!(await ensureAudio()))return
    clearTimeout(timerRef.current); try{nodeRef.current?.stop?.()}catch{}
    const inst=instrumentRef.current[p.instrument]; if(!inst)return
    const node=inst.play(p.note,ctxRef.current.currentTime,{gain:volume,duration:1.6});nodeRef.current=node;setActivePad(p.id);setPlaying(p.id)
    timerRef.current=setTimeout(()=>{setActivePad(null);setPlaying(null)},1600)
  }
  function stop(){clearTimeout(timerRef.current);try{nodeRef.current?.stop?.()}catch{};setPlaying(null);setActivePad(null)}

  return <div className={`ii-page ii-page--${config.family}`}>
    <Link className="ii-back" to="/instrumentos"><span>←</span><span>Voltar aos instrumentos</span></Link>
    <section className="ii-hero"><div className="ii-hero__icon">{config.icon}</div><div><span>{config.category}</span><h1>{config.name}</h1><p>{config.description}</p></div></section>
    <section className="ii-lab">
      <div className="ii-lab__top"><div><span>Music Lab</span><h2>{config.labTitle || `${config.name} interativo`}</h2><p>{config.labDescription}</p></div><div className={`ii-status ${ready?'is-ready':''}`}>{ready?`● ${config.name} pronto`:status}</div></div>
      <div className="ii-layout">
        <aside className="ii-sidebar"><div className="ii-sidebar__sticky">
          <div className="ii-current"><div><span>{config.family==='percussion'?'Som':'Nota selecionada'}</span><strong>{config.family==='percussion'?(activePad?config.pads.find(p=>p.id===activePad)?.label:'Kit'):pretty(selected.written)}</strong>{config.transpose ? <small>soa {pretty(selected.sounding)}</small>:null}</div>{config.family!=='percussion'&&<button type="button" disabled={!ready} onClick={()=>play(selected)}>▶ Ouvir</button>}</div>
          <div className="ii-visual-panel">
            {config.family==='strings'&&<StringVisual config={config} note={selected}/>} 
            {config.family==='woodwind'&&<WoodwindVisual config={config} note={selected}/>} 
            {config.family==='brass'&&config.visual!=='trombone'&&<BrassVisual config={config} note={selected}/>} 
            {config.family==='brass'&&config.visual==='trombone'&&<TromboneVisual config={config} note={selected}/>} 
            {config.family==='percussion'&&<PercussionVisual config={config} activePad={activePad} onPad={playPad} ready={ready}/>} 
          </div>
          {config.family!=='percussion'&&<div className="ii-info"><div><span>Nota</span><b>{pretty(selected.written)}</b></div><div><span>{config.transpose?'Concerto':'Frequência'}</span><b>{config.transpose?pretty(selected.sounding):`${freq(selected.sounding).toFixed(1)} Hz`}</b></div><div><span>Frequência</span><b>{freq(selected.sounding).toFixed(1)} Hz</b></div></div>}
          <div className="ii-controls"><label>Volume<input type="range" min="0" max="1" step=".05" value={volume} onChange={e=>setVolume(Number(e.target.value))}/></label><button type="button" onClick={stop} disabled={!playing}>Parar som</button></div>
        </div></aside>
        <main className="ii-notes-panel">
          <div className="ii-notes-intro"><span>{config.techniqueLabel}</span><h3>{config.family==='percussion'?'Escolha um timbre':'Escolha uma nota'}</h3><p>{config.notesHelp}</p></div>
          {config.family==='percussion' ? <div className="ii-note-grid ii-note-grid--pads">{config.pads.map(p=><button key={p.id} type="button" disabled={!ready} className={`ii-note-button ${playing===p.id?'is-playing':''}`} onClick={()=>playPad(p)}><strong>{p.label}</strong><span>{p.instrument.replaceAll('_',' ')}</span><em>{playing===p.id?'♪ Tocando':'▶ Ouvir'}</em></button>)}</div> : <div className="ii-note-grid">{notes.map(n=><button key={`${n.written}-${n.sounding}`} type="button" disabled={!ready} className={`ii-note-button ${selected.written===n.written?'is-selected':''} ${playing===n.written?'is-playing':''}`} onClick={()=>play(n)}><strong>{pretty(n.written)}</strong>{config.transpose?<span>soa {pretty(n.sounding)}</span>:<span>{freq(n.sounding).toFixed(1)} Hz</span>}<em>{playing===n.written?'♪ Tocando':'▶ Ouvir'}</em></button>)}</div>}
        </main>
      </div>
      <div className="ii-footer"><strong>{config.footerTitle}</strong><span>{config.footerText}</span></div>
    </section>
  </div>
}

export { buildChromatic }
