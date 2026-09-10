import InteractiveInstrumentLab from '../_shared/InteractiveInstrumentLab'

const config = {
  name:'Contrabaixo', icon:'🎻', category:'Cordas friccionadas', family:'strings', visual:'bass', soundfontInstrument:'contrabass', range:['E1','B3'],
  strings:[{name:'Mi',note:'E1'},{name:'Lá',note:'A1'},{name:'Ré',note:'D2'},{name:'Sol',note:'G2'}],
  description:'O instrumento mais grave da família tradicional de cordas da orquestra.', labDescription:'Explore as cordas do contrabaixo e ouça samples reais do instrumento.', techniqueLabel:'Mapa do espelho', notesHelp:'A visualização mostra uma referência de corda e posição para cada nota.', footerTitle:'Contrabaixo:', footerText:'o instrumento é afinado em quartas (Mi–Lá–Ré–Sol). A distância física entre posições é maior que nos demais instrumentos de cordas.'
}

export default function ContrabaixoInstrumentPage(){
  return <InteractiveInstrumentLab config={config} />
}
