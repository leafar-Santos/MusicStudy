# MusicStudy - React (Create React App)

Projeto convertido para React com `react-scripts`, sem Vite.

## Instalação limpa no Windows

Se você já executou versões anteriores do projeto, apague as dependências antigas antes de instalar:

```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm cache verify
npm install
npm start
```

O projeto abre em `http://localhost:3000`.

## Build

```powershell
npm run build
```

A pasta gerada é `build/`.

## Deploy

```powershell
npm run deploy
```

## Observação sobre ESLint/Jest

A configuração `react-app/jest` foi removida porque o projeto não depende dela para execução e ela pode causar o erro `Environment key "jest/globals" is unknown` quando existe uma combinação incompatível de pacotes ESLint/Jest instalada.
