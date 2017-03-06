import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { constants, actions, selectors } from '../modules/session'
import { selectors as selectorsChoiceAs } from '../../../modules/choiceas'

import ChoiceAsSession from 'components/ChoiceAs/ChoiceAsSession'

/* TODO, rename sessionID to sessionID? */

const makeMapStateToProps = () => {
  /*
    creates private copy of getSessionTrial for each sessionID
    https://github.com/reactjs/reselect#sharing-selectors-with-props-across-multiple-components
  */
  const getSession = selectors.makeGetSession()
  return (state, ownProps) => {
    const sessionIDMatcher = new RegExp(`/${constants.ROUTE_PATH}/(.+)`)
    const sessionIDMatches = ownProps && ownProps.location &&
      ownProps.location.pathname &&
      ownProps.location.pathname.match(sessionIDMatcher) || []
    const sessionID = sessionIDMatches[1] || undefined

    return {
      sessionID,
      // sessionState: selectors.getSessionState(state, {test: true}), // *** TODO, remove ***
      session: getSession(state, { sessionID }),
      entities: selectorsChoiceAs.getConditionsAndKeys(state)
    }
  }
}

// const mapStateToProps = (state, ownProps) => {
//   const sessionIDMatcher = new RegExp(`/${constants.ROUTE_PATH}/(.+)`)
//   const sessionIDMatches = ownProps && ownProps.location &&
//     ownProps.location.pathname &&
//     ownProps.location.pathname.match(sessionIDMatcher) || []
//
//   return {
//     sessionID: sessionIDMatches[1] || undefined,
//     trialState: selectors.getTrialState(state, {test: true})
//   }
// }

const mapActionCreators = (dispatch) => ({
  startClick: bindActionCreators(actions.creators.start, dispatch),
  keyClick: bindActionCreators(actions.creators.keyClick, dispatch)
})

export default connect(makeMapStateToProps, mapActionCreators)(ChoiceAsSession)
