import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'

function ShowFood() {
    const loggedUser=useContext(UserContext);
    console.log(loggedUser);
  return (
    <div>
      
    </div>
  )
}

export default ShowFood
