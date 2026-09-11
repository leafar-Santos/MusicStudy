import InteractiveInstrumentLab from '../_shared/InteractiveInstrumentLab'

const config = {
  name:'Trombone', icon:'🎺', category:'Metais', family:'brass', visual:'trombone', soundfontInstrument:'trombone', range:['E2','Bb4'], base:'Bb2',
  description:'Metal de registro médio-grave que usa vara para alterar a altura das notas.', labDescription:'Selecione uma nota para visualizar a posição aproximada da vara e ouvir o sample.', techniqueLabel:'7 posições da vara', notesHelp:'O desenho desloca a vara conforme a posição de referência da nota escolhida.', footerTitle:'Trombone:', footerText:'as sete posições da vara se combinam com diferentes séries harmônicas. O mapa indica uma posição principal de referência para estudo.'
}

export default function TromboneInstrumentPage(){
  return <InteractiveInstrumentLab config={config} />
}
