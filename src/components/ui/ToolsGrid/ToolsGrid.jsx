import ToolCard from '../ToolCard/ToolCard'
import metronomeImage from '../../../assets/tools/metronome.svg'
import tunerImage from '../../../assets/tools/tuner.svg'
import circleImage from '../../../assets/tools/circle-of-fifths.svg'
import referenceImage from '../../../assets/tools/reference-sounds.svg'
import tuningForkImage from '../../../assets/tools/tuning-fork.svg'
import './ToolsGrid.css'

export default function ToolsGrid() {
  return (
    <div className="tools-grid">
          <ToolCard image={tuningForkImage} title="Diapasão" description="Referência sonora · Lá 440 Hz" to="/ferramentas/diapasao" />
          <ToolCard image={metronomeImage} title="Metrônomo" description="Controle BPM" to="/ferramentas/metronomo" />
          <ToolCard image={tunerImage} title="Afinador" description="Acesso ao microfone" to="/ferramentas/afinador" />
          <ToolCard image={circleImage} title="Círculo das quintas" description="Relações tonais" to="/ferramentas/circulo-quintas" />
          <ToolCard image={referenceImage} title="Sons de referência" description="Biblioteca de instrumentos" to="/instrumentos" />
        </div>
  )
}
