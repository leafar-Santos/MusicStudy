import InteractiveInstrumentLab from '../_shared/InteractiveInstrumentLab'

const config = {
  name:'Flauta transversal', icon:'🪈', category:'Madeiras', family:'woodwind', visual:'flute', soundfontInstrument:'flute', range:['C4','C7'], lowest:'C4',
  description:'Madeira de som claro e ágil, tocada por sopro transversal.', labDescription:'Selecione uma nota para destacar uma digitação de referência e ouvir o sample de flauta.', techniqueLabel:'Sistema de chaves', notesHelp:'Os círculos iluminados representam chaves acionadas na digitação de referência.', footerTitle:'Flauta transversal:', footerText:'o diagrama é uma referência visual simplificada. Algumas notas possuem digitações alternativas e mecanismos diferentes conforme o modelo da flauta.'
}

export default function FlautaInstrumentPage(){
  return <InteractiveInstrumentLab config={config} />
}
