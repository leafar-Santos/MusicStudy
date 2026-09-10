# MusicStudy

Projeto React + Vite refatorado com arquitetura por componente.

## Requisitos atendidos

1. Cada componente possui sua própria pasta.
2. Cada componente possui seu próprio arquivo CSS.
3. O CSS global fica isolado em `src/styles/global.css`.
4. O menu superior possui o item **Home**.
5. A navegação mobile também possui **Home**.

## Estrutura

```text
src/
├── components/
│   ├── layout/
│   │   ├── AppShell/
│   │   │   ├── AppShell.jsx
│   │   │   └── AppShell.css
│   │   ├── BottomNav/
│   │   │   ├── BottomNav.jsx
│   │   │   └── BottomNav.css
│   │   └── TopBar/
│   │       ├── TopBar.jsx
│   │       └── TopBar.css
│   └── ui/
│       ├── FeatureCard/
│       ├── PageHero/
│       ├── SectionTitle/
│       └── ToolCard/
├── pages/
│   ├── HomePage/
│   ├── LearnPage/
│   ├── PracticePage/
│   ├── InstrumentsPage/
│   ├── InstrumentDetailPage/
│   ├── ToolsPage/
│   ├── MetronomePage/
│   ├── TunerPage/
│   ├── CircleOfFifthsPage/
│   └── DictionaryPage/
├── data/
└── styles/
    └── global.css
```

## Executar

```bash
npm install
npm run dev
```

## CSS global

`src/styles/global.css` contém apenas:

- reset
- variáveis de tema
- regras base do documento

Os estilos de componentes e páginas ficam junto de seus respectivos arquivos.
