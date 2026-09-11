import { Link, useParams } from 'react-router-dom'
import { theoryTopics } from '../../data/theory'
import './TheoryTopicPage.css'
const content={
'elementos-da-musica':['Música organiza sons e silêncios no tempo. Para estudar leitura, comece distinguindo altura, duração, intensidade e timbre.','Ouça sons graves e agudos e descreva também se são longos, curtos, fortes ou suaves.'],
'pentagrama-linhas-espacos':['O pentagrama possui cinco linhas e quatro espaços, contados de baixo para cima. Notas podem aparecer também em linhas suplementares.','Treine apontando aleatoriamente linhas e espaços e dizendo sua posição antes de nomear notas.'],
'claves':['A clave fixa uma referência para nomear as notas na pauta. A clave de Sol é comum em registros médios e agudos; a de Fá, em registros graves.','Identifique primeiro a linha de referência da clave e derive as demais notas por sequência.'],
'notas-musicais':['A sequência Dó, Ré, Mi, Fá, Sol, Lá, Si se repete em diferentes alturas. Na pauta, cada passo para linha ou espaço vizinho avança uma nota.','Leia lentamente em ambas as direções sem depender de frases decoradas.'],
'figuras-e-pausas':['Figuras representam durações relativas. As pausas representam silêncios com valores correspondentes.','Marque uma pulsação constante e alterne som e silêncio mantendo o pulso interno.'],
'compasso-e-pulsacao':['O pulso é a referência regular; o compasso agrupa pulsos e cria padrões de acentuação. Barras delimitam esses grupos.','Conte em voz alta e destaque o primeiro tempo de cada compasso.'],
'formulas-de-compasso':['A fórmula indica quantos tempos ou subdivisões organizam o compasso e qual figura serve de referência escrita.','Compare 2/4, 3/4, 4/4 e 6/8 batendo palmas.'],
'ponto-ligadura-fermata':['O ponto aumenta a duração da figura; a ligadura de valor une durações; a fermata indica sustentação além do valor escrito conforme a interpretação.','Reescreva durações pontuadas como soma de valores equivalentes.'],
'acidentes':['Sustenido eleva e bemol abaixa a nota em um semitom; bequadro cancela a alteração aplicável.','Localize no teclado pares naturais e alterados e diga seus nomes possíveis.'],
'tons-e-semitons':['O semitom é a menor distância do sistema temperado comum; dois semitons formam um tom.','Conte semitons no teclado sem pular teclas, incluindo pretas e brancas.'],
'intervalos':['Intervalo é a distância entre duas notas. A classificação considera quantidade de graus e qualidade sonora.','Escolha uma nota e construa segundas, terças, quartas e quintas acima dela.'],
'escalas-maiores':['A escala maior segue uma organização específica de tons e semitons e possui sete graus antes da repetição da oitava.','Construa escalas a partir de diferentes tônicas preservando o padrão de distâncias.'],
'tonalidade-armadura':['A armadura reúne alterações recorrentes de uma tonalidade e reduz a repetição de acidentes ao longo da pauta.','Use o círculo de quintas do site para relacionar tonalidades e armaduras.'],
'escalas-menores':['Escalas menores apresentam organizações próprias. As formas natural, harmônica e melódica alteram principalmente os graus superiores.','Compare as três formas partindo da mesma tônica.'],
'sincopa-contratempo':['Síncopes e contratempos deslocam a sensação de acento para regiões fracas do pulso ou entre pulsações.','Pratique primeiro falando a subdivisão e depois execute apenas os ataques escritos.'],
'expressao-articulacao':['Dinâmicas, andamento e articulações orientam como a música deve soar, não apenas quais notas tocar.','Toque a mesma frase em legato e staccato e compare a intenção musical.'],
'acordes-triades':['Tríades são formadas pela sobreposição de terças e podem ser classificadas pela combinação de seus intervalos.','Construa tríades sobre cada grau de uma escala maior.'],
'revisao-leitura':['Leitura aplicada integra altura, ritmo, métrica, acidentes, articulação e expressão em uma única execução.','Faça leitura curta em andamento confortável e só aumente a velocidade mantendo precisão.']
}
export default function TheoryTopicPage(){
 const {slug}=useParams(); const topic=theoryTopics.find(t=>t.slug===slug)
 if(!topic)return <div className="theory-topic-page">Tema não encontrado.</div>
 const [body,practice]=content[slug]||[topic.description,'Revise o conceito e aplique em uma pequena leitura.']
 return <div className="theory-topic-page">
  <Link to="/aprender">← Voltar para Aprender</Link>
  <header><span>{topic.level} • Módulo {topic.order}</span><div>{topic.symbol}</div><h1>{topic.title}</h1><p>{topic.description}</p></header>
  <article><h2>Conceito</h2><p>{body}</p><h2>Como estudar</h2><p>{practice}</p><div className="theory-topic-page__tip"><strong>Objetivo do módulo</strong><p>Compreender o assunto, reconhecê-lo visualmente e aplicá-lo antes de avançar.</p></div></article>
  <Link className="theory-topic-page__exercise" to={`/praticar/${slug}`}>Ir para os exercícios →</Link>
 </div>
}