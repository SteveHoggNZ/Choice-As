import { connect } from 'react-redux'
import { actions, selectors } from '../modules/test'

import ChoiceAsTest from 'components/ChoiceAs/ChoiceAsTest'

const mapStateToProps = (state, ownProps) => ({
  results: selectors.getTestResults(state)
})

const mapActionCreators = {
  run: () => actions.creators.runRequest(1000000)
}

export default connect(mapStateToProps, mapActionCreators)(ChoiceAsTest)
