import InteractiveInstrumentLab from '../_shared/InteractiveInstrumentLab'

const config = {
  name:'Percussão', icon:'🥁', category:'Percussão', family:'percussion',
  description:'Família de instrumentos responsáveis por pulsação, cor e acentuação rítmica.', labDescription:'Toque diretamente nos pads ou use os botões para ouvir diferentes timbres de percussão.', techniqueLabel:'Pads de percussão', notesHelp:'Cada pad carrega um sample correspondente ao instrumento indicado.', footerTitle:'Percussão:', footerText:'a família reúne instrumentos de altura definida e indefinida. Este laboratório combina alguns timbres representativos para treino auditivo.',
  pads:[
    {id:'timpani',label:'Tímpano',instrument:'timpani',note:'C3',key:'T'},
    {id:'xylophone',label:'Xilofone',instrument:'xylophone',note:'C5',key:'X'},
    {id:'marimba',label:'Marimba',instrument:'marimba',note:'C4',key:'M'},
    {id:'bells',label:'Sinos',instrument:'tubular_bells',note:'C5',key:'B'},
    {id:'taiko',label:'Taiko',instrument:'taiko_drum',note:'C3',key:'K'},
    {id:'synth',label:'Drum',instrument:'synth_drum',note:'C3',key:'D'}
  ]
}

export default function PercussaoInstrumentPage(){
  return <InteractiveInstrumentLab config={config} />
}
