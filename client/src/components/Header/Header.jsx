import React, { useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext'
import { LogOut, Zap } from 'lucide-react'
import ActivityHUD from '../ActivityHUD/ActivityHUD'

function Header() {
  const loggedInData = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    loggedInData.setLoggedUser(null);
    localStorage.removeItem("nutrify-app");
    localStorage.removeItem("calorieGoal");
    navigate('/login');
  }

  const navLinks = [
    { to: '/home',             label: 'Home' },
    { to: '/caloriecalculator', label: 'My Goals' },
    { to: '/track',            label: 'Log Food' },
    { to: '/burn',             label: 'Activity' },
    { to: '/history',          label: 'History' },
    { to: '/recipes',          label: 'Recipes' },
    { to: '/blogs',            label: 'Blogs' },
  ];

  const isActive = (path) => location.pathname === path;
  const isLoggedIn = !!loggedInData.loggedUser;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to={isLoggedIn ? "/home" : "/"} className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:bg-emerald-400 transition-colors">
              <Zap className="w-3.5 h-3.5 text-black fill-black" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">Nutrify</span>
          </Link>

          {/* Nav links — only when logged in */}
          {isLoggedIn && (
            <nav className="hidden lg:flex items-center gap-0.5 mx-4">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    isActive(to)
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Activity HUD — only when logged in */}
            {isLoggedIn && <ActivityHUD />}

            {isLoggedIn && loggedInData.loggedUser?.name && (
              <span className="hidden xl:block text-xs text-zinc-500 border-l border-zinc-800 pl-3 ml-1">
                <span className="text-zinc-400 font-medium">{loggedInData.loggedUser.name}</span>
              </span>
            )}

            {isLoggedIn && (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-700"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:block">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
