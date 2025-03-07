import React, { Children } from 'react'

import Header from '../Header/Header'
import Footer from '../Footer/Footer'
function Layout({children}) {
  return (
    <>
       <Header/> 
      {children}
      
    </>
  )
}

export default Layout
