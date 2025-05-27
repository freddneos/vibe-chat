import { checkAuth } from './auth'

const routes = {
  login: renderLoginPage,
  home: renderHomePage
}

// Initialize router
export async function initRouter() {
  window.addEventListener('hashchange', handleRouteChange)
  await handleRouteChange()
}

// Handle route changes
async function handleRouteChange() {
  const { isAuthenticated } = await checkAuth()
  const hash = window.location.hash.slice(1) || 'home'
  
  if (!isAuthenticated && hash !== 'login') {
    window.location.hash = 'login'
    return
  }
  
  if (isAuthenticated && hash === 'login') {
    window.location.hash = 'home'
    return
  }
  
  const routeFunction = routes[hash] || renderNotFoundPage
  routeFunction()
}

// Render login page
function renderLoginPage() {
  document.querySelector('#app').innerHTML = `
    <div class="snes-container" style="background-color: #000; padding: 20px; max-width: 600px; margin: 0 auto;">
      <div class="snes-panel" style="padding: 20px;">
        <h3 class="snes-text">Vibe Chat - Login</h3>
        
        <div id="auth-tabs" class="snes-tabs">
          <button class="snes-button active" id="login-tab">Login</button>
          <button class="snes-button" id="register-tab">Register</button>
        </div>
        
        <div id="login-form" class="auth-form">
          <div class="form-group" style="margin-bottom: 10px;">
            <label class="snes-text" for="login-email">Email</label>
            <input type="email" id="login-email" class="snes-input" placeholder="your@email.com">
          </div>
          
          <div class="form-group" style="margin-bottom: 10px;">
            <label class="snes-text" for="login-password">Password</label>
            <input type="password" id="login-password" class="snes-input" placeholder="Your password">
          </div>
          
          <div id="login-error" class="error-message snes-text" style="color: red;"></div>
          
          <button id="login-button" class="snes-button" style="margin-top: 10px;">Login</button>
        </div>
        
        <div id="register-form" class="auth-form" style="display: none;">
          <div class="form-group" style="margin-bottom: 10px;">
            <label class="snes-text" for="register-email">Email</label>
            <input type="email" id="register-email" class="snes-input" placeholder="your@email.com">
          </div>
          
          <div class="form-group" style="margin-bottom: 10px;">
            <label class="snes-text" for="register-password">Password</label>
            <input type="password" id="register-password" class="snes-input" placeholder="Your password">
          </div>
          
          <div class="form-group" style="margin-bottom: 10px;">
            <label class="snes-text" for="register-confirm-password">Confirm Password</label>
            <input type="password" id="register-confirm-password" class="snes-input" placeholder="Confirm your password">
          </div>
          
          <div id="register-error" class="error-message snes-text" style="color: red;"></div>
          
          <button id="register-button" class="snes-button" style="margin-top: 10px;">Register</button>
        </div>
      </div>
    </div>
  `
  
  // Add event listeners for tab switching
  document.getElementById('login-tab').addEventListener('click', () => {
    document.getElementById('login-form').style.display = 'block'
    document.getElementById('register-form').style.display = 'none'
    document.getElementById('login-tab').classList.add('active')
    document.getElementById('register-tab').classList.remove('active')
  })
  
  document.getElementById('register-tab').addEventListener('click', () => {
    document.getElementById('login-form').style.display = 'none'
    document.getElementById('register-form').style.display = 'block'
    document.getElementById('login-tab').classList.remove('active')
    document.getElementById('register-tab').classList.add('active')
  })
  
  // Add event listeners for form submission
  setupLoginForm()
  setupRegisterForm()
}

// Render home page (authenticated page)
async function renderHomePage() {
  const { user } = await checkAuth()
  
  document.querySelector('#app').innerHTML = `
    <div class="snes-container" style="background-color: #000;">
      <header class="snes-panel" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; margin-bottom: 20px;">
        <h1 class="snes-text">Vibe Chat</h1>
        <div class="user-info">
          <span class="snes-text">${user.email}</span>
          <button id="logout-button" class="snes-button">Logout</button>
        </div>
      </header>
      
      <div class="snes-panel" style="padding: 20px;">
        <h2 class="snes-text">Welcome to Vibe Chat!</h2>
        <p class="snes-text">You are now authenticated.</p>
        <div class="card snes-panel">
          <button id="counter" type="button" class="snes-button"></button>
        </div>
      </div>
    </div>
  `
  
  // Setup counter from the original app
  setupCounter(document.querySelector('#counter'))
  
  // Setup logout button
  document.getElementById('logout-button').addEventListener('click', async () => {
    const { error } = await signOut()
    if (!error) {
      window.location.hash = 'login'
    }
  })
}

// Render not found page
function renderNotFoundPage() {
  document.querySelector('#app').innerHTML = `
    <div class="snes-container" style="background-color: #000;">
      <div class="snes-panel" style="padding: 20px;">
        <h1 class="snes-text">404 - Page Not Found</h1>
        <a href="#home" class="snes-button">Go Home</a>
      </div>
    </div>
  `
}

// Setup login form
function setupLoginForm() {
  const loginForm = document.getElementById('login-button')
  const errorElement = document.getElementById('login-error')
  
  loginForm.addEventListener('click', async () => {
    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value
    
    if (!email || !password) {
      errorElement.textContent = 'Please fill in all fields'
      return
    }
    
    loginForm.disabled = true
    const { data, error } = await signIn(email, password)
    
    if (error) {
      errorElement.textContent = error.message
      loginForm.disabled = false
      return
    }
    
    window.location.hash = 'home'
  })
}

// Setup register form
function setupRegisterForm() {
  const registerForm = document.getElementById('register-button')
  const errorElement = document.getElementById('register-error')
  
  registerForm.addEventListener('click', async () => {
    const email = document.getElementById('register-email').value
    const password = document.getElementById('register-password').value
    const confirmPassword = document.getElementById('register-confirm-password').value
    
    if (!email || !password || !confirmPassword) {
      errorElement.textContent = 'Please fill in all fields'
      return
    }
    
    if (password !== confirmPassword) {
      errorElement.textContent = 'Passwords do not match'
      return
    }
    
    registerForm.disabled = true
    const { data, error } = await signUp(email, password)
    
    if (error) {
      errorElement.textContent = error.message
      registerForm.disabled = false
      return
    }
    
    errorElement.textContent = ''
    errorElement.innerHTML = '<span style="color: green;">Registration successful! Please check your email for confirmation and then log in.</span>'
    
    // Reset form
    document.getElementById('register-email').value = ''
    document.getElementById('register-password').value = ''
    document.getElementById('register-confirm-password').value = ''
    registerForm.disabled = false
  })
}
