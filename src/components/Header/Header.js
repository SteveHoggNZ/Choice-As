import React from 'react'
import { IndexLink, Link } from 'react-router'
import './Header.scss'

export const Header = () => (
  <div>
    <h1>React Redux Starter Kit</h1>
    <IndexLink to='/' activeClassName='route--active'>
      Home
    </IndexLink>
    {' · '}
    <Link to='/counter' activeClassName='route--active'>
      Counter
    </Link>
    {' · '}
    <Link to='/choiceas/session' activeClassName='route--active'>
      Choice As Session
    </Link>
    {' · '}
    <Link to='/choiceas/test' activeClassName='route--active'>
      Choice As Test
    </Link>
  </div>
)

export default Header
