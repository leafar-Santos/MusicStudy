import ToolsGrid from '../../components/ui/ToolsGrid/ToolsGrid'
import PageHero from '../../components/ui/PageHero/PageHero'
import SectionTitle from '../../components/ui/SectionTitle/SectionTitle'
import './ToolsPage.css'

export default function ToolsPage() {
  return (
    <>
      <PageHero eyebrow="Ferramentas" title="Recursos para estudar e tocar" description="Ferramentas rápidas, sem login." symbol="⚙" />
      <div className="tools-page">
        <SectionTitle title="Ferramentas disponíveis" />

        <ToolsGrid />
      </div>
    </>
  )
}
