import './style.css'
import 'snes.css/dist/snes.css' // Import snes.css
import { setupCounter } from './counter.js'
import { signIn, signOut, signUp } from './auth.js'
import { initRouter } from './router.js'

// Make auth functions available globally for the router
window.signIn = signIn
window.signOut = signOut
window.signUp = signUp
window.setupCounter = setupCounter

// Initialize the router
document.addEventListener('DOMContentLoaded', () => {
  initRouter()
})
