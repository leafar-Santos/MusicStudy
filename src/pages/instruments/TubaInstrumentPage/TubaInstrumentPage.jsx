import InteractiveInstrumentLab from '../_shared/InteractiveInstrumentLab'

const config = {
  name:'Tuba', icon:'🎺', category:'Metais', family:'brass', visual:'tuba', soundfontInstrument:'tuba', range:['E1','F4'], base:'C2',
  description:'O instrumento mais grave da família dos metais.', labDescription:'Selecione notas para observar combinações de válvulas e ouvir samples graves de tuba.', techniqueLabel:'Válvulas', notesHelp:'As válvulas iluminadas mostram uma combinação de referência para cada classe de altura.', footerTitle:'Tuba:', footerText:'existem tubas em diferentes afinações e com diferentes números de válvulas. Esta visualização usa um modelo genérico de três válvulas para estudo.'
}

export default function TubaInstrumentPage(){
  return <InteractiveInstrumentLab config={config} />
}
