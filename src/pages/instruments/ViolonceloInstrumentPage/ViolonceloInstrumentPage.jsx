import InteractiveInstrumentLab from '../_shared/InteractiveInstrumentLab'

const config = {
  name:'Violoncelo', icon:'🎻', category:'Cordas friccionadas', family:'strings', visual:'cello', soundfontInstrument:'cello', range:['C2','E4'],
  strings:[{name:'Dó',note:'C2'},{name:'Sol',note:'G2'},{name:'Ré',note:'D3'},{name:'Lá',note:'A3'}],
  description:'Instrumento de cordas friccionadas de registro grave e grande expressividade.', labDescription:'Selecione notas para visualizar sua posição básica no espelho e ouvir o violoncelo.', techniqueLabel:'Posição básica', notesHelp:'O marcador indica a corda e uma digitação básica para estudo.', footerTitle:'Violoncelo:', footerText:'o mapa é uma referência visual simplificada para estudo inicial. A técnica real inclui extensões e posições adicionais.'
}

export default function ViolonceloInstrumentPage(){
  return <InteractiveInstrumentLab config={config} />
}
