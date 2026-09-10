import InteractiveInstrumentLab from '../_shared/InteractiveInstrumentLab'

const config = {
  name:'Oboé', icon:'🎶', category:'Madeiras • Palheta dupla', family:'woodwind', visual:'oboe', soundfontInstrument:'oboe', range:['Bb3','F6'], lowest:'Bb3',
  description:'Instrumento de palheta dupla com timbre penetrante e expressivo.', labDescription:'Explore as notas do oboé com chaves destacadas e sample correspondente.', techniqueLabel:'Sistema de chaves', notesHelp:'As chaves iluminadas representam uma digitação principal de referência.', footerTitle:'Oboé:', footerText:'o instrumento possui sistemas e digitações alternativas; o desenho serve como apoio visual para estudo e reconhecimento.'
}

export default function OboeInstrumentPage(){
  return <InteractiveInstrumentLab config={config} />
}
