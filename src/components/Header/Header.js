import React from 'react'
import { IndexLink, Link } from 'react-router'
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap'
import { Spinner } from 'components/Spinner'
import LoginFormContainer from 'containers/CognitoUsers/LoginFormContainer'
import './Header.scss'

export const Header = ({ logout, loginSession, requestInProgress }) => {
  const handleLogout = (e) => {
    e.preventDefault()
    logout()
  }

  return <div>
    <Navbar color='faded' light toggleable>
      <NavbarBrand>Choice As</NavbarBrand>
      <Nav className='ml-auto' navbar>
        {loginSession.loggedIn &&
          <NavItem>
            <NavLink href='#' onClick={handleLogout}>Log out</NavLink>
          </NavItem>}
      </Nav>
    </Navbar>
    <br />
    <LoginFormContainer />
    {loginSession.loggedIn &&
      <span>
        <IndexLink to='/' activeClassName='route--active'>
          Home
        </IndexLink>
        {' · '}
        <Link to='/choiceas/session' activeClassName='route--active'>
          Choice As Session
        </Link>
        {' · '}
        <Link to='/choiceas/test' activeClassName='route--active'>
          Choice As Test
        </Link>
      </span>}
    {!loginSession.loggedIn && requestInProgress &&
      <Spinner size={1}>Loading...</Spinner>}
  </div>
}

Header.propTypes = {
  logout: React.PropTypes.func.isRequired,
  loginSession: React.PropTypes.object.isRequired,
  requestInProgress: React.PropTypes.bool
}

export default Header
