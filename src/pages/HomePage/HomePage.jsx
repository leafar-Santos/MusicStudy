import { Link } from 'react-router-dom'
import FeatureCard from '../../components/ui/FeatureCard/FeatureCard'
import SectionTitle from '../../components/ui/SectionTitle/SectionTitle'
import ToolsGrid from '../../components/ui/ToolsGrid/ToolsGrid'
import './HomePage.css'

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="home-hero__copy">
          <h1>Aprenda música.</h1>

          <div className="home-hero__actions">
            <Link className="home-button primary" to="/aprender">Começar a estudar</Link>
          </div>
        </div>

      </section>

      <div className="home-content">
        <SectionTitle title="Explore" />

        <div className="home-grid">
          <FeatureCard tag="Aprender" title="Teoria Musical" description="Notas, claves, compassos, intervalos, escalas e acordes." symbol="𝄞" to="/aprender" />
          <FeatureCard tag="Praticar" title="Exercícios" description="Leitura, teoria, ritmo e percepção auditiva." symbol="♩" to="/praticar" tone="dark" />
          <FeatureCard tag="Instrumentos" title="Sons & Afinação" description="Escolha um instrumento e escute notas de referência." symbol="♪" to="/instrumentos" tone="warm" />
          <FeatureCard tag="Referência" title="Dicionário Musical" description="Termos, símbolos, articulações e dinâmicas." symbol="𝄐" to="/dicionario" />
        </div>

        <section className="home-tools">
          <SectionTitle title="Ferramentas" />
          <ToolsGrid />
        </section>
      </div>
    </>
  )
}
