import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Whisky from './pages/Whisky.jsx'
import Gin from './pages/Gin.jsx'
import Rum from './pages/Rum.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/whisky" element={<Whisky />} />
        <Route path="/gin" element={<Gin />} />
        <Route path="/rum" element={<Rum />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
