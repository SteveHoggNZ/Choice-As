import React from 'react'
import DuckImage from '../assets/Duck.jpg'
import './HomeView.scss'

export const HomeView = ({ userSession }) => (
  <div>
    <h2>Welcome to Choice As</h2>
    <br />
    {userSession.loggedIn &&
      <span>
        <h5>Please click the "Session" link above to start a session</h5>
        <br />
      </span>}
    <img
      alt='This is a duck'
      className='duck'
      src={DuckImage} />
  </div>
)

HomeView.propTypes = {
  userSession: React.PropTypes.object.isRequired
}

export default HomeView
