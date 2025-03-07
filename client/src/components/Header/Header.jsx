import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext'
function Header() {

  const loggedInData = useContext(UserContext);
  const navigate = useNavigate();

  const logout = () => {
    loggedInData.setLoggedUser = null;
    localStorage.removeItem("nutrify-app");
    navigate('/login');
  }

  return (
    <div className='sticky top-0 z-50 bg-gray-950'>
      <div className=' flex py-10 w-full h-10 justify-between  '>
        <div className='w-1/5 justify-center flex items-center text-4xl font-bold text-black'>
          <Link to={'/'}> Nutrify.</Link>
        </div>
        <div className='flex justify-center gap-6 w-3/5 items-center'>
          <div className='text-xl hover:bg-white rounded-2xl transition-all ease-in-out p-4 font-medium cursor-pointer font-sans '>
            <Link to={'/'}>home</Link>
          </div>
          <div className='text-xl hover:bg-white rounded-2xl transition-all ease-in-out p-4 font-medium cursor-pointer font-sans '>
            <Link to={'/recipes'}>recipes</Link>
          </div>
          <div className='text-xl hover:bg-white rounded-2xl transition-all ease-in-out p-4 font-medium cursor-pointer font-sans '>
            <Link to={'/caloriecalculator'}>Count Calories</Link>
          </div>
          <div className='text-xl hover:bg-white rounded-2xl transition-all ease-in-out p-4 font-medium cursor-pointer font-sans '>
            <Link to={'/track'}>Nutrition Analysis</Link>
          </div>
          <div className='text-xl hover:bg-white rounded-2xl transition-all ease-in-out p-4 font-medium cursor-pointer font-sans '>
            <Link to={'/history'}>History</Link>
          </div>
        </div>
        <div className='w-1/5 justify-center gap-5 flex items-center'>
          <div className='text-xl hover:bg-white rounded-2xl transition-all ease-in-out p-4 font-medium cursor-pointer font-sans '>
            <button onClick={logout} className='text-blue-400'>
              Logout

            </button>

          </div>

        </div>
      </div>
    </div>
  )
}

export default Header
