import InteractiveInstrumentLab from '../_shared/InteractiveInstrumentLab'

const config = {
  name:'Trompete em Si♭', icon:'🎺', category:'Metais', family:'brass', visual:'trumpet', soundfontInstrument:'trumpet', range:['F#3','C6'], base:'C4', transpose:-2,
  description:'Metal agudo e brilhante, muito usado em bandas, fanfarras e orquestras.', labDescription:'Selecione uma nota para ver a combinação de válvulas e ouvir o trompete.', techniqueLabel:'3 válvulas', notesHelp:'As válvulas iluminadas mostram a combinação de referência para a nota.', footerTitle:'Trompete em Si♭:', footerText:'é um instrumento transpositor: a nota escrita soa um tom abaixo. A mesma combinação de válvulas produz diferentes parciais conforme a embocadura.'
}

export default function TrompeteInstrumentPage(){
  return <InteractiveInstrumentLab config={config} />
}
