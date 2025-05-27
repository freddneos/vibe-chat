import './style.css'
import 'snes.css/dist/snes.css' // Import snes.css
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div class="snes-container" style="background-color: #000;">
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1 class="snes-text">Hello Vite!</h1>
    <div class="card snes-panel">
      <button id="counter" type="button" class="snes-button"></button>
    </div>
    <p class="read-the-docs snes-text">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))
