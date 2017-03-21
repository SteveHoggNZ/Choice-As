import React from 'react'
import DuckImage from '../assets/Duck.jpg'
import './HomeView.scss'

export const HomeView = () => (
  <div>
    <img
      alt='This is a duck'
      className='duck'
      src={DuckImage} />
  </div>
)

export default HomeView
