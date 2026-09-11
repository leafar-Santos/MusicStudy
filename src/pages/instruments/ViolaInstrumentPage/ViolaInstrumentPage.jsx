import InteractiveInstrumentLab from '../_shared/InteractiveInstrumentLab'

const config = {
  name:'Viola', icon:'🎻', category:'Cordas friccionadas', family:'strings', visual:'viola', soundfontInstrument:'viola', range:['C3','E5'],
  strings:[{name:'Dó',note:'C3'},{name:'Sol',note:'G3'},{name:'Ré',note:'D4'},{name:'Lá',note:'A4'}],
  description:'Cordas friccionadas de registro médio, com timbre mais escuro que o violino.', labDescription:'Explore a primeira posição da viola e ouça samples correspondentes.', techniqueLabel:'Primeira posição', notesHelp:'O marcador mostra a corda e o dedo sugerido para a nota selecionada.', footerTitle:'Viola:', footerText:'a afinação padrão é Dó–Sol–Ré–Lá. O mapa mostra uma referência de primeira posição e pode haver alternativas de digitação.'
}

export default function ViolaInstrumentPage(){
  return <InteractiveInstrumentLab config={config} />
}
