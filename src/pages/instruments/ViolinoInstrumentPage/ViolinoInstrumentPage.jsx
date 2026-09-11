import InteractiveInstrumentLab from '../_shared/InteractiveInstrumentLab'

const config = {
  name:'Violino', icon:'🎻', category:'Cordas friccionadas', family:'strings', visual:'violin', soundfontInstrument:'violin', range:['G3','B5'],
  strings:[{name:'Sol',note:'G3'},{name:'Ré',note:'D4'},{name:'Lá',note:'A4'},{name:'Mi',note:'E5'}],
  description:'Instrumento agudo de cordas friccionadas, afinado em quintas.', labDescription:'Escolha uma nota para ver a corda e a posição do dedo na primeira posição e ouvir seu som.', techniqueLabel:'Primeira posição', notesHelp:'A nota selecionada é mostrada diretamente no espelho do instrumento.', footerTitle:'Violino:', footerText:'o mapa usa a primeira posição como referência didática. A mesma nota pode ter digitações alternativas em outras posições.'
}

export default function ViolinoInstrumentPage(){
  return <InteractiveInstrumentLab config={config} />
}
