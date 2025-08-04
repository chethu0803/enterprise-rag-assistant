import Home from './pages/Home'
import Chat from './pages/Chat'
import Upload from './pages/Upload'
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute'
import Register from './pages/Register'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <PrivateRoute adminOnly={true}>
                <Upload />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </>
  )
}

export default App
