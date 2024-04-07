import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
  BrowserRouter as Router,
  Route,
  Routes,

} from "react-router-dom";
import Home from './pages/Home/Home';
import Recipes from './pages/Recipes/Recipes';
import Login from './pages/Registration/Login';
import Signin from './pages/Registration/Signin';

import Nutrition from './pages/nutrition/nutrition';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/nutrition' element={<Nutrition/>} />
          <Route path='/recipes' element={<Recipes/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/signin' element={<Signin/>} />
         
          
        </Routes>
      </Router>
    </>
  )
}

export default App
