import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthPage from './components/AuthenticationComponent'
import { FileDashboard } from './components/FileDashboard'
import LandingPage from './components/LandingPage'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<AuthPage/>} ></Route>
        <Route path='/' element={<LandingPage/>}></Route>
        <Route path='/dashboard' element={<FileDashboard/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
