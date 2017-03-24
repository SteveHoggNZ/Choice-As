import React from 'react'
import HeaderContainer from 'containers/HeaderContainer'
import './CoreLayout.scss'
import '../../styles/core.scss'

export const CoreLayout = ({ children, location }) => (
  <div className='container'>
    <HeaderContainer location={location} />
    <div className='core-layout__viewport'>
      {children}
    </div>
  </div>
)

CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired,
  location : React.PropTypes.object.isRequired
}

export default CoreLayout
