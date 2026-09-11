import PageHero from '../../components/ui/PageHero/PageHero'
import SectionTitle from '../../components/ui/SectionTitle/SectionTitle'
import ToolCard from '../../components/ui/ToolCard/ToolCard'
import './ToolsPage.css'

export default function ToolsPage() {
  return (
    <>
      <PageHero eyebrow="Ferramentas" title="Recursos para estudar e tocar" description="Ferramentas rápidas, sem login." symbol="⚙" />
      <div className="tools-page">
        <SectionTitle title="Ferramentas disponíveis" />

        <div className="tools-page__grid">
          <ToolCard icon="♩" title="Metrônomo" description="Controle BPM" to="/ferramentas/metronomo" />
          <ToolCard icon="≈" title="Afinador" description="Acesso ao microfone" to="/ferramentas/afinador" />
          <ToolCard icon="○" title="Círculo das quintas" description="Relações tonais" to="/ferramentas/circulo-quintas" />
          <ToolCard icon="♫" title="Sons de referência" description="Biblioteca de instrumentos" to="/instrumentos" />
        </div>
      </div>
    </>
  )
}
