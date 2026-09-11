const { copyFileSync } = require('node:fs')
const path = require('node:path')

// GitHub Pages serves this entry point when a BrowserRouter URL is refreshed.
// Keep it identical to index.html so it always references the current assets.
const buildDirectory = path.resolve(__dirname, '../build')
copyFileSync(path.join(buildDirectory, 'index.html'), path.join(buildDirectory, '404.html'))
