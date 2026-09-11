import BackButton from '../../components/ui/BackButton/BackButton'
import { Link, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { theoryTopics } from '../../data/theory'
import './ExerciseTopicPage.css'
const banks={
'claves':[['Qual clave é mais usada para registros agudos?','Clave de Sol',['Clave de Sol','Clave de Fá','Nenhuma']],['A clave serve principalmente para...','definir uma referência para o nome das notas',['definir uma referência para o nome das notas','indicar apenas o andamento','marcar o volume']]],
'figuras-e-pausas':[['Uma mínima vale quantas semínimas?','2',['1','2','4']],['Uma pausa representa...','silêncio com duração definida',['silêncio com duração definida','nota mais forte','mudança de clave']]],
'acidentes':[['O sustenido normalmente...','eleva a nota em um semitom',['eleva a nota em um semitom','abaixa um tom','duplica a duração']],['O bequadro é usado para...','cancelar uma alteração aplicável',['cancelar uma alteração aplicável','aumentar o andamento','ligar compassos']]],
'tons-e-semitons':[['Quantos semitons formam um tom?','2',['1','2','3']],['De Mi para Fá, no sistema temperado comum, há...','um semitom',['um semitom','um tom','dois tons']]],
'intervalos':[['De Dó até Sol, contando Dó como primeiro grau, temos uma...','quinta',['terça','quarta','quinta']],['Intervalo descreve...','a distância entre duas notas',['a velocidade','o volume','a distância entre duas notas']]],
'escalas-maiores':[['Quantos graus diferentes há antes da repetição da oitava?','7',['5','7','8']],['Uma escala é organizada a partir de...','uma tônica e um padrão de distâncias',['somente pausas','uma tônica e um padrão de distâncias','uma dinâmica']]],
'formulas-de-compasso':[['Em 3/4, o numerador indica...','três unidades de tempo no compasso',['três unidades de tempo no compasso','três claves','três tonalidades']]],
'acordes-triades':[['Uma tríade possui, em sua forma básica...','três notas',['duas notas','três notas','cinco notas']]]
}
function generic(topic){return [[`Qual é o foco principal do módulo “${topic.title}”?`,topic.description,[topic.description,'Somente velocidade de execução','Somente memorização de repertório']],['A melhor sequência de estudo é...','compreender, reconhecer e aplicar',['decorar sem aplicar','tocar sempre mais rápido','compreender, reconhecer e aplicar']]]}
export default function ExerciseTopicPage(){
 const {slug}=useParams(); const topic=theoryTopics.find(t=>t.slug===slug); const questions=useMemo(()=>topic?(banks[slug]||generic(topic)):[],[slug,topic])
 const [index,setIndex]=useState(0),[score,setScore]=useState(0),[answer,setAnswer]=useState(''),[done,setDone]=useState(false)
 if(!topic)return <div className="exercise-topic-page">Exercício não encontrado.</div>
 const q=questions[index]
 function choose(option){if(answer)return;setAnswer(option);if(option===q[1])setScore(s=>s+1)}
 function next(){if(index===questions.length-1){setDone(true)}else{setIndex(i=>i+1);setAnswer('')}}
 return <div className="exercise-topic-page">
  <BackButton to="/praticar">Voltar aos exercícios</BackButton>
  <header><span>Módulo {topic.order} • {topic.level}</span><h1>{topic.title}</h1><p>Exercícios específicos para fixar o conteúdo estudado.</p></header>
  {!done?<section className="exercise-box"><div className="exercise-box__progress">Questão {index+1} de {questions.length}</div><h2>{q[0]}</h2><div className="exercise-box__options">{q[2].map(o=><button className={answer?(o===q[1]?'correct':o===answer?'wrong':''):''} onClick={()=>choose(o)} key={o}>{o}</button>)}</div>{answer&&<><p className="exercise-box__feedback">{answer===q[1]?'Correto.':'Revise este ponto e tente novamente depois.'}</p><button className="exercise-box__next" onClick={next}>{index===questions.length-1?'Ver resultado':'Próxima questão →'}</button></>}</section>:
  <section className="exercise-result"><div>✓</div><h2>Exercício concluído</h2><p>Você acertou <strong>{score} de {questions.length}</strong>.</p><Link to={`/aprender/${slug}`}>Revisar teoria</Link></section>}
 </div>
}