import { useState } from 'react'
import './App.css'
import LandingPage from './Pages/LandingPage'
import SignUpPage from './Pages/SignUpPage'
import LoginPage from './Pages/LoginPage'
 
function App() {
  const [count, setCount] = useState(0)

  return (
    <LandingPage></LandingPage>
  )
}

export default App
