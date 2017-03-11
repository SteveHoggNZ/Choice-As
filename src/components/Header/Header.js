import React from 'react'
import { IndexLink, Link } from 'react-router'
import LoginFormContainer from 'containers/CognitoUsers/LoginFormContainer'
import './Header.scss'

export const Header = () => (
  <div>
    <h1>Choice As</h1>
    <LoginFormContainer />
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
