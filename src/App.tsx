import { Outlet, Link } from 'react-router-dom';
import './App.css'


const App = () => {
  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-logo">Game</h1>
          <ul className="navbar-menu">
            <li className="navbar-item">
              <Link to="/" className="navbar-link">Game</Link>
            </li>
            <li className="navbar-item">
              <Link to="/leaderboard" className="navbar-link">Leaderboard</Link>
            </li>
          </ul>
        </div>
      </nav>
      <main className="content-container">
        <Outlet />
      </main>
    </div>
  )
}

export default App
