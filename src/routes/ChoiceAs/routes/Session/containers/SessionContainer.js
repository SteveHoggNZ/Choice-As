import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { selectors as loginSelectors } from 'modules/cognito-users'
import { actions, selectors } from '../modules/session'
import { selectors as selectorsChoiceAs } from '../../../modules/choiceas'

import ChoiceAsSession from 'components/ChoiceAs/ChoiceAsSession'

const mapStateToProps = (state, ownProps) => ({
  sessionID: selectors.getCurrentSessionID(state),
  session: selectors.getSession(state),
  correctCount: selectors.getCorrectCount(state),
  entities: selectorsChoiceAs.getSession(state),
  debug: loginSelectors.getDebugMode(state)
})

const mapActionCreators = (dispatch) => ({
  startClick: bindActionCreators(actions.creators.start, dispatch),
  keyClick: bindActionCreators(actions.creators.keyClick, dispatch)
})

// export default connect(makeMapStateToProps, mapActionCreators)(ChoiceAsSession)
export default connect(mapStateToProps, mapActionCreators)(ChoiceAsSession)
