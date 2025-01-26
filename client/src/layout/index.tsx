import React, { ReactNode } from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar'

interface ComponentPropsType {
  children?: ReactNode
}

const index: React.FC<ComponentPropsType> = () => {
  return (
    <main className=' xs:block md:flex p-6 gap-10'>
      <Sidebar/>
      <div className='xs:w-[20vw] sm:w-[10vw] md:w-[5vw]'></div>
      <Outlet />
    </main>
  )
}

export default index;