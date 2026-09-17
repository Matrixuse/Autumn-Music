import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { PlayerProvider } from './context/PlayerContext'

const App = () => {
  return (
    <BrowserRouter>
      <PlayerProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </PlayerProvider>
    </BrowserRouter>
  )
}

export default App
