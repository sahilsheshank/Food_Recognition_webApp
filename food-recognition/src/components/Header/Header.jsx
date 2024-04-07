import React from 'react'
import {Link} from 'react-router-dom'
function Header() {
  return (
    <div >
      <div className='flex w-full h-10 justify-between  '>
        <div className='w-1/5 justify-center flex items-center  text-black'>
           <Link to={'/'}> i am logo</Link> 
        </div>
        <div className='flex justify-center gap-6 w-3/5 items-center'>
            <div className='text-xl font-medium cursor-pointer font-sans '>
              <Link to={'/'}>home</Link>
            </div>
            <div className='text-xl font-medium cursor-pointer font-sans '>
              <Link to={'/recipes'}>recipes</Link>
            </div>
            <div className='text-xl font-medium cursor-pointer font-sans '>
              <Link to={'/nutrition'}>Nutrition Analysis</Link>
            </div>
        </div>
        <div className='w-1/5 justify-center gap-5 flex items-center'>
            <div className='text-xl font-medium cursor-pointer font-sans '>
              <Link to={'/login'}>
                Login
              </Link>
            </div>
            <div className='text-xl font-medium cursor-pointer font-sans '>
              <Link to={'/signin'}>
                signin
              </Link>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Header
