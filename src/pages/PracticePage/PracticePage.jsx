import { Link } from 'react-router-dom'
import PageHero from '../../components/ui/PageHero/PageHero'
import SectionTitle from '../../components/ui/SectionTitle/SectionTitle'
import { theoryTopics } from '../../data/theory'
import './PracticePage.css'
export default function PracticePage(){
 return <><PageHero eyebrow="Praticar" title="Exercícios por assunto" description="Cada módulo da teoria possui um treino correspondente para fixação." symbol="♩"/>
 <div className="practice-page"><SectionTitle title="Escolha um módulo" description="Estude o tema e depois valide o que aprendeu."/>
 <div className="practice-grid">{theoryTopics.map(topic=><Link className="practice-card" key={topic.slug} to={`/praticar/${topic.slug}`}><div className="practice-card__number">{topic.order}</div><span className="practice-card__icon">{topic.symbol}</span><span className="practice-card__level">{topic.level}</span><h3>{topic.title}</h3><p>{topic.description}</p><span className="practice-card__action">Começar exercício →</span></Link>)}</div></div></>
}