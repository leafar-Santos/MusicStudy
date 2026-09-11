import InteractiveInstrumentLab from '../_shared/InteractiveInstrumentLab'

const config = {
  name:'Trompa em Fá', icon:'📯', category:'Metais', family:'brass', visual:'horn', soundfontInstrument:'french_horn', range:['F#3','C6'], base:'C4', transpose:-7,
  description:'Metal de timbre arredondado, capaz de ligar sonoridades de madeiras e metais.', labDescription:'Explore notas da trompa com indicação das válvulas e sample correspondente.', techniqueLabel:'Válvulas rotativas', notesHelp:'As válvulas destacadas representam uma combinação de referência; os parciais dependem da embocadura.', footerTitle:'Trompa em Fá:', footerText:'a nota escrita soa uma quinta justa abaixo. A trompa explora muitos harmônicos com as mesmas válvulas, controlados principalmente pela embocadura.'
}

export default function TrompaInstrumentPage(){
  return <InteractiveInstrumentLab config={config} />
}
