import { connect } from 'react-redux'
import { selectors } from 'modules/cognito-users'
import HomeView from 'routes/Home/components/HomeView'

const mapStateToProps = (state, ownProps) => ({
  userSession: selectors.getSession(state)
})

const mapActionCreators = (dispatch) => ({})

// export default connect(makeMapStateToProps, mapActionCreators)(ChoiceAsSession)
export default connect(mapStateToProps, mapActionCreators)(HomeView)
