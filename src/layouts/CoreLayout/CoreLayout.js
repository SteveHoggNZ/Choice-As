import React from 'react'
import HeaderContainer from 'containers/HeaderContainer'
import './CoreLayout.scss'
import '../../styles/core.scss'

export const CoreLayout = ({ children, location, debugSet }) => (
  <div className='container'>
    <HeaderContainer location={location} debugSet={debugSet} />
    <div className='core-layout__viewport'>
      {children}
    </div>
  </div>
)

CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired,
  location : React.PropTypes.object.isRequired,
  debugSet : React.PropTypes.func.isRequired
}

export default CoreLayout
