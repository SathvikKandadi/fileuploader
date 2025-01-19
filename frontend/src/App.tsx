import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthPage from './components/AuthenticationComponent'
import FileViewer from './components/FileViewer'
import { FileDashboard } from './components/FileDashboard'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AuthPage/>} ></Route>
        {/* <Route path='/dashboard' element={<FileViewer filename='demo'/>}></Route> */}
        <Route path='/dashboard' element={<FileDashboard/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
