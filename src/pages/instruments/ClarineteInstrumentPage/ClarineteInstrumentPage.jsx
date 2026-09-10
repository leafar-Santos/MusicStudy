import InteractiveInstrumentLab from '../_shared/InteractiveInstrumentLab'

const config = {
  name:'Clarinete em Si♭', icon:'🎶', category:'Madeiras • Palheta simples', family:'woodwind', visual:'clarinet', soundfontInstrument:'clarinet', soundfont:'FluidR3_GM', range:['E3','G6'], lowest:'E3', transpose:-2,
  description:'Instrumento transpositor de palheta simples, com grande extensão e flexibilidade.', labDescription:'Escolha uma nota para visualizar a digitação e ouvir a altura real do clarinete em Si♭.', techniqueLabel:'Sistema Boehm', notesHelp:'Os controles destacados mostram uma digitação principal de referência.', footerTitle:'Clarinete em Si♭:', footerText:'a nota escrita soa um tom abaixo. Algumas notas possuem digitações alternativas; o mapa apresenta uma referência didática do sistema Boehm.'
}

export default function ClarineteInstrumentPage(){
  return <InteractiveInstrumentLab config={config} />
}
