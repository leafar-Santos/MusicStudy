import { Link } from 'react-router-dom'
import PageHero from '../../components/ui/PageHero/PageHero'
import SectionTitle from '../../components/ui/SectionTitle/SectionTitle'
import { theoryTopics } from '../../data/theory'
import './LearnPage.css'
export default function LearnPage(){
 const levels=['Básico','Intermediário','Avançado']
 return <><PageHero eyebrow="Aprender" title="Teoria para compreender o que você toca" description="Trilha progressiva de teoria musical, organizada do fundamento à leitura aplicada." symbol="𝄞"/>
 <div className="learn-page"><SectionTitle title="Trilha de teoria musical" description="Progressão inspirada na organização pedagógica do MSA, com conteúdo original para estudo no site."/>
 {levels.map(level=><section className="learn-level" key={level}><div className="learn-level__heading"><span>{level}</span><h2>{level==='Básico'?'Fundamentos':level==='Intermediário'?'Leitura e estrutura':'Integração e aplicação'}</h2></div><div className="learn-grid">{theoryTopics.filter(t=>t.level===level).map(topic=><Link className="learn-card" key={topic.slug} to={`/aprender/${topic.slug}`}><div className="learn-card__order">{topic.order}</div><span className="learn-card__symbol">{topic.symbol}</span><h3>{topic.title}</h3><p>{topic.description}</p><span className="learn-card__action">Estudar tema →</span></Link>)}</div></section>)}
 </div></>
}