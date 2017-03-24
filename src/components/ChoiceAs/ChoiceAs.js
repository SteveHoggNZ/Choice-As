import React from 'react'

export const ChoiceAs = (props) => {
  return <div>
    {props.userSession.loggedIn &&
      props.children}
  </div>
}

ChoiceAs.propTypes = {
  userSession: React.PropTypes.object.isRequired,
  children: React.PropTypes.object.isRequired
}

export default ChoiceAs
