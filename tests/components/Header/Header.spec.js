import React from 'react'
import { Header } from 'components/Header/Header'
import { IndexLink, Link } from 'react-router'
import { shallow } from 'enzyme'

describe('(Component) Header', () => {
  let _wrapper

  beforeEach(() => {
    const _props = {
      loginSession: {
        loggedIn: true
      }
    }
    _wrapper = shallow(<Header {..._props} />)
  })

  // it('Renders a welcome message', () => {
  //   const welcome = _wrapper.find('h1')
  //   expect(welcome).to.exist
  //   expect(welcome.text()).to.match(/Choice As/)
  // })

  describe('Navigation links...', () => {
    it('Should render a Link to Home route', () => {
      expect(_wrapper.contains(
        <IndexLink activeClassName='route--active' to='/'>
          Home
        </IndexLink>
      )).to.be.true
    })

    it('Should render a Link to Session route', () => {
      expect(_wrapper.contains(
        <Link activeClassName='route--active' to='/choiceas/session'>
          Choice As Session
        </Link>
      )).to.be.true
    })
  })
})
