import { useEffect, useState } from 'react'
import Nes from './nes/Nes'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  return (
    <div className='dashboard'>
      <Navbar></Navbar>
      <Nes></Nes>
      <Footer></Footer>
    </div>
  )
}

export default App
