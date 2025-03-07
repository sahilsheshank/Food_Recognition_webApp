import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
  Route,
  Routes,

} from "react-router-dom";
import Home from './pages/Home/Home';
import Signup from './pages/Register/Signup';
import Recipes from './pages/Recipes/Recipes';
import Login from './pages/Register/Login';
import Signin from './pages/Register/Signup';
import { UserContext } from './contexts/UserContext';
import Nutrition from './pages/nutrition/nutrition';
import { useNavigate } from 'react-router-dom';
import Private from './components/Private/Private';
import Track from './components/Track/Track';
import CalorieCalculator from './pages/CalorieCalculator/CalorieCalc';
import HistoryPage from './pages/History/History';
function App() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0)

  const [loggedUser, setLoggedUser] = useState(JSON.parse(localStorage.getItem("nutrify-app")));
  const [calGoal, setCalGoal] = useState({
    calories: null,
    carbs: 289,
    fat: 77,
    protein: 116,
  });
  return (
    <>
      <UserContext.Provider value={{ calGoal, setCalGoal, loggedUser, setLoggedUser }}>
        <div class="fixed top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <Routes>
          <Route path='/' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/home' element={<Private Component={Home} />} />
          <Route path='/caloriecalculator' element={<Private Component={CalorieCalculator} />} />
          <Route path='/track' element={<Private Component={Track} />} />
          <Route path='/history' element={<Private Component={HistoryPage} />} />
          <Route path='/recipes' element={<Recipes />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signin' element={<Signin />} />
        </Routes>
      </UserContext.Provider>
    </>
  )
}

export default App
