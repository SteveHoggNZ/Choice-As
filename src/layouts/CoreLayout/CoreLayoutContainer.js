import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions } from 'modules/cognito-users'
import CoreLayout from 'layouts/CoreLayout'

const mapStateToProps = (state, ownProps) => ({})

const mapActionCreators = (dispatch) => ({
  debugSet: bindActionCreators(actions.creators.debugSet, dispatch)
})

// export default connect(makeMapStateToProps, mapActionCreators)(ChoiceAsSession)
export default connect(mapStateToProps, mapActionCreators)(CoreLayout)
