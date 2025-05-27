import { supabase } from './supabaseClient'

// Function to handle sign up
export async function signUp(email, password) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// Function to handle sign in
export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// Function to handle sign out
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    return { error: null }
  } catch (error) {
    return { error }
  }
}

// Function to get current user
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) throw error
    
    return { user, error: null }
  } catch (error) {
    return { user: null, error }
  }
}

// Function to check if user is authenticated
export async function checkAuth() {
  const { user, error } = await getCurrentUser()
  return { isAuthenticated: !!user, user, error }
}
