import React from 'react'
import { IndexLink, Link } from 'react-router'
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap'
import { Spinner } from 'components/Spinner'
import LoginFormContainer from 'containers/CognitoUsers/LoginFormContainer'
import './Header.scss'

export class Header extends React.Component {
  constructor (props) {
    super(props)

    this.handleLogout = ::this.handleLogout
  }

  handleLogout (e) {
    const { logout } = this.props
    e.preventDefault()
    logout()
  }

  componentWillMount () {
    const { location, debugSet } = this.props

    if (location && location.search && location.search === '?debug') {
      debugSet()
    }
  }

  render () {
    const { loginSession, requestInProgress, debug } = this.props

    return <div>
      <Navbar color='faded' light toggleable>
        <NavbarBrand>Choice As</NavbarBrand>
        <Nav className='ml-auto' navbar>
          {loginSession.loggedIn &&
            <NavItem>
              <NavLink href='#' onClick={this.handleLogout}>Log out</NavLink>
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
            Session
          </Link>
          {debug &&
            <span>
              {' · '}
              <Link to='/choiceas/test' activeClassName='route--active'>
                Test
              </Link>
            </span>}
        </span>}
      {!loginSession.loggedIn && requestInProgress &&
        <Spinner size={1}>Loading...</Spinner>}
    </div>
  }
}

Header.propTypes = {
  logout: React.PropTypes.func.isRequired,
  loginSession: React.PropTypes.object.isRequired,
  requestInProgress: React.PropTypes.bool,
  location: React.PropTypes.object.isRequired,
  debugSet: React.PropTypes.func.isRequired,
  debug: React.PropTypes.bool
}

export default Header
