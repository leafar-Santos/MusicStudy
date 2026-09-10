import InteractiveInstrumentLab from '../_shared/InteractiveInstrumentLab'

const config = {
  name:'Fagote', icon:'🎶', category:'Madeiras • Palheta dupla', family:'woodwind', visual:'bassoon', soundfontInstrument:'bassoon', range:['Bb1','E5'], lowest:'Bb1',
  description:'Madeira grave de palheta dupla, importante na base harmônica da orquestra.', labDescription:'Explore o registro do fagote, suas chaves e o sample de cada nota.', techniqueLabel:'Sistema de chaves', notesHelp:'A visualização destaca uma combinação básica de chaves para cada altura.', footerTitle:'Fagote:', footerText:'o fagote possui um sistema de chaves complexo e diversas digitações alternativas. Este mapa é uma representação didática simplificada.'
}

export default function FagoteInstrumentPage(){
  return <InteractiveInstrumentLab config={config} />
}
