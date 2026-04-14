import { useState } from 'react'
import './App.css'
import { Route, Routes } from "react-router-dom";
import Home from './pages/Home/Home';
import Signup from './pages/Register/Signup';
import Recipes from './pages/Recipes/Recipes';
import Login from './pages/Register/Login';
import { UserContext } from './contexts/UserContext';
import Private from './components/Private/Private';
import Track from './components/Track/Track';
import CalorieCalculator from './pages/CalorieCalculator/CalorieCalc';
import HistoryPage from './pages/History/History';
import Blogs from './pages/Blogs/Blogs';
import Burn from './pages/Burn/Burn';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [loggedUser, setLoggedUser] = useState(JSON.parse(localStorage.getItem("nutrify-app")));
  const [calGoal, setCalGoal] = useState(() => {
    const saved = localStorage.getItem("calorieGoal");
    return saved ? JSON.parse(saved) : null;
  });
  // Shared today stats — updated by TodayCal, read by ActivityHUD
  const [todayStats, setTodayStats] = useState({ calories: 0, carbs: 0, protein: 0, fat: 0 });

  return (
    <UserContext.Provider value={{
      calGoal, setCalGoal,
      loggedUser, setLoggedUser,
      refreshKey, setRefreshKey,
      todayStats, setTodayStats,
    }}>
      <div className="fixed top-0 z-[-2] h-screen w-screen bg-zinc-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.10),rgba(0,0,0,0))]" />
      <Routes>
        <Route path='/'         element={<Signup />} />
        <Route path='/login'    element={<Login />} />
        <Route path='/signup'   element={<Signup />} />
        <Route path='/home'            element={<Private Component={Home} />} />
        <Route path='/caloriecalculator' element={<Private Component={CalorieCalculator} />} />
        <Route path='/track'    element={<Private Component={Track} />} />
        <Route path='/history'  element={<Private Component={HistoryPage} />} />
        <Route path='/burn'     element={<Private Component={Burn} />} />
        <Route path='/recipes'  element={<Recipes />} />
        <Route path='/blogs'    element={<Blogs />} />
      </Routes>
    </UserContext.Provider>
  )
}

export default App
