import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions, selectors } from '../modules/session'
import { selectors as selectorsChoiceAs } from '../../../modules/choiceas'

import ChoiceAsSession from 'components/ChoiceAs/ChoiceAsSession'

// const makeMapStateToProps = () => {
//   /*
//     creates private copy of getSessionTrial for each sessionID
//     https://github.com/reactjs/reselect#sharing-selectors-with-props-across-multiple-components
//   */
//   const getSession = selectors.makeGetSession()
//   return (state, ownProps) => {
//     const sessionIDMatcher = new RegExp(`/${constants.ROUTE_PATH}/(.+)`)
//     const sessionIDMatches = ownProps && ownProps.location &&
//       ownProps.location.pathname &&
//       ownProps.location.pathname.match(sessionIDMatcher) || []
//     const sessionID = sessionIDMatches[1] || undefined
//
//     return {
//       sessionID,
//       // sessionState: selectors.getSessionState(state, {test: true}), // *** TODO, remove ***
//       session: getSession(state, { sessionID }),
//       entities: selectorsChoiceAs.getSession(state)
//     }
//   }
// }

const mapStateToProps = (state, ownProps) => ({
  sessionID: selectors.getCurrentSessionID(state),
  session: selectors.getSession(state),
  correctCount: selectors.getCorrectCount(state),
  entities: selectorsChoiceAs.getSession(state)
})

const mapActionCreators = (dispatch) => ({
  startClick: bindActionCreators(actions.creators.start, dispatch),
  keyClick: bindActionCreators(actions.creators.keyClick, dispatch)
})

// export default connect(makeMapStateToProps, mapActionCreators)(ChoiceAsSession)
export default connect(mapStateToProps, mapActionCreators)(ChoiceAsSession)
