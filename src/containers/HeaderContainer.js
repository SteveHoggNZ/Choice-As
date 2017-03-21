import { connect } from 'react-redux'
import {
  actions as loginActions,
  selectors as loginSelectors } from 'modules/cognito-users'
import Header from 'components/Header'

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(loginActions.creators.logoutRequest())
})

const mapStateToProps = (state) => ({
  loginSession: loginSelectors.getSession(state),
  requestInProgress: loginSelectors.getRequestInProgress(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
