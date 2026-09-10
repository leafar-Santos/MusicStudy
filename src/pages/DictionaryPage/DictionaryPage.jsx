import { useMemo, useState } from 'react'

import { dictionaryTerms } from '../../data/dictionary'

import './DictionaryPage.css'

const CATEGORIES = [
  {
    id: 'all',
    label: 'Todos',
    icon: '𝄞',
  },
  {
    id: 'andamento',
    label: 'Andamento',
    icon: '♩',
  },
  {
    id: 'dinamicas',
    label: 'Dinâmicas',
    icon: '𝆑',
  },
  {
    id: 'tecnicas',
    label: 'Técnicas',
    icon: '♪',
  },
  {
    id: 'expressividade',
    label: 'Expressividade',
    icon: '𝄐',
  },
  {
    id: 'repeticoes',
    label: 'Repetições',
    icon: '𝄆',
  },
  {
    id: 'geral',
    label: 'Geral',
    icon: '♫',
  },
]

function normalizeText(value = '') {
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export default function DictionaryPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [selectedTerm, setSelectedTerm] = useState(null)

  const filteredTerms = useMemo(() => {
    const normalizedQuery =
      normalizeText(query)

    return dictionaryTerms
      .filter(term => {
        const matchesCategory =
          category === 'all' ||
          term.category === category

        const searchableText =
          normalizeText(
            [
              term.term,
              term.definition,
              term.abbreviation,
              term.symbol,
              term.bpm,
              term.category,
            ]
              .filter(Boolean)
              .join(' ')
          )

        const matchesQuery =
          !normalizedQuery ||
          searchableText.includes(
            normalizedQuery
          )

        return (
          matchesCategory &&
          matchesQuery
        )
      })
      .sort((a, b) =>
        a.term.localeCompare(
          b.term,
          'pt-BR'
        )
      )
  }, [query, category])

  const selectedCategory =
    CATEGORIES.find(
      item => item.id === category
    )

  function clearFilters() {
    setQuery('')
    setCategory('all')
  }

  return (
    <div className="dictionary-page">

      {/* HEADER */}

      <header className="dictionary-header">
        <div>
          <span className="dictionary-header__eyebrow">
            Referência musical
          </span>

          <h1>
            Dicionário musical
          </h1>

          <p>
            Consulte termos encontrados em
            partituras, aulas, ensaios e métodos
            musicais.
          </p>
        </div>

        <div className="dictionary-header__counter">
          <strong>
            {dictionaryTerms.length}
          </strong>

          <span>
            termos disponíveis
          </span>
        </div>
      </header>

      {/* PAINEL PRINCIPAL */}

      <section className="dictionary-search-panel">

        <div className="dictionary-search">

          <span className="dictionary-search__icon">
            ⌕
          </span>

          <input
            value={query}
            onChange={event =>
              setQuery(
                event.target.value
              )
            }
            placeholder="Buscar allegro, crescendo, legato, coda..."
          />

          {query && (
            <button
              type="button"
              className="dictionary-search__clear"
              onClick={() =>
                setQuery('')
              }
              aria-label="Limpar busca"
            >
              ×
            </button>
          )}

        </div>

        <div className="dictionary-search-panel__info">
          <span>
            Pesquise por termo,
            significado, símbolo,
            abreviação ou BPM.
          </span>

          <strong>
            {filteredTerms.length}{' '}
            {filteredTerms.length === 1
              ? 'resultado'
              : 'resultados'}
          </strong>
        </div>

      </section>

      {/* CATEGORIAS */}

      <nav
        className="dictionary-categories"
        aria-label="Categorias do dicionário"
      >
        {CATEGORIES.map(item => {

          const amount =
            item.id === 'all'
              ? dictionaryTerms.length
              : dictionaryTerms.filter(
                  term =>
                    term.category ===
                    item.id
                ).length

          return (
            <button
              type="button"
              key={item.id}
              className={
                category === item.id
                  ? 'selected'
                  : ''
              }
              onClick={() =>
                setCategory(item.id)
              }
            >
              <span className="dictionary-categories__icon">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>

              <small>
                {amount}
              </small>
            </button>
          )
        })}
      </nav>

      {/* TÍTULO DA CATEGORIA */}

      <div className="dictionary-results-header">
        <div>
          <span>
            Categoria
          </span>

          <h2>
            {selectedCategory?.label}
          </h2>
        </div>

        {(query ||
          category !== 'all') && (
          <button
            type="button"
            onClick={clearFilters}
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* RESULTADOS */}

      {filteredTerms.length > 0 ? (
        <div className="dictionary-list">

          {filteredTerms.map(term => {

            const categoryInfo =
              CATEGORIES.find(
                item =>
                  item.id ===
                  term.category
              )

            const isSelected =
              selectedTerm ===
              term.term

            return (
              <article
                key={`${term.category}-${term.term}`}
                className={`dictionary-card ${
                  isSelected
                    ? 'dictionary-card--expanded'
                    : ''
                }`}
              >

                <div className="dictionary-card__top">

                  <span className="dictionary-card__category">
                    {categoryInfo?.icon}

                    {categoryInfo?.label}
                  </span>

                  {term.abbreviation && (
                    <span className="dictionary-card__abbreviation">
                      {term.abbreviation}
                    </span>
                  )}

                </div>

                <div className="dictionary-card__content">

                  <div>
                    <h3>
                      {term.term}
                    </h3>

                    <p>
                      {term.definition}
                    </p>
                  </div>

                  {(term.symbol ||
                    term.bpm) && (
                    <div className="dictionary-card__metadata">

                      {term.symbol && (
                        <div>
                          <span>
                            Símbolo
                          </span>

                          <strong className="dictionary-card__symbol">
                            {term.symbol}
                          </strong>
                        </div>
                      )}

                      {term.bpm && (
                        <div>
                          <span>
                            BPM
                          </span>

                          <strong>
                            {term.bpm}
                          </strong>
                        </div>
                      )}

                    </div>
                  )}

                </div>

                {term.details && (
                  <>
                    <button
                      type="button"
                      className="dictionary-card__more"
                      onClick={() =>
                        setSelectedTerm(
                          isSelected
                            ? null
                            : term.term
                        )
                      }
                    >
                      {isSelected
                        ? 'Fechar detalhes'
                        : 'Ver detalhes'}

                      <span>
                        {isSelected
                          ? '↑'
                          : '↓'}
                      </span>
                    </button>

                    {isSelected && (
                      <div className="dictionary-card__details">
                        <span>
                          Sobre este termo
                        </span>

                        <p>
                          {term.details}
                        </p>
                      </div>
                    )}
                  </>
                )}

              </article>
            )
          })}

        </div>
      ) : (
        <div className="dictionary-empty">

          <div className="dictionary-empty__icon">
            𝄞
          </div>

          <h2>
            Nenhum termo encontrado
          </h2>

          <p>
            Tente pesquisar outra palavra
            ou selecionar outra categoria.
          </p>

          <button
            type="button"
            onClick={clearFilters}
          >
            Limpar pesquisa
          </button>

        </div>
      )}

      {/* RODAPÉ INFORMATIVO */}

      <section className="dictionary-tip">

        <div className="dictionary-tip__symbol">
          ♪
        </div>

        <div>
          <strong>
            Termos musicais
          </strong>

          <p>
            Muitas indicações encontradas
            nas partituras utilizam palavras
            italianas para informar andamento,
            dinâmica, técnica e expressão ao
            intérprete.
          </p>
        </div>

      </section>

    </div>
  )
}