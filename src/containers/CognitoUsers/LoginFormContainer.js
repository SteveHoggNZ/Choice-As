import { connect } from 'react-redux'
import { actions, selectors } from 'modules/cognito-users'
import LoginForm from 'components/CognitoUsers/LoginForm'

const mapDispatchToProps = (dispatch) => ({
  formModeSet: (mode) =>
    dispatch(actions.creators.formModeSet(mode)),
  sessionCheck: () =>
    dispatch(actions.creators.cognitoSessionCheck()),
  signup: (email, password, studentid) =>
    dispatch(actions.creators.signupRequest(email, password, studentid)),
  signupCodeRequest: (email) =>
    dispatch(actions.creators.signupCodeRequest(email)),
  confirm: (email, code) =>
    dispatch(actions.creators.confirmRequest(email, code)),
  forgotCodeRequest: (email, password) =>
    dispatch(actions.creators.forgotCodeRequest(email, password)),
  forgotConfirmRequest: (email, password, code) =>
    dispatch(actions.creators.forgotConfirmRequest(email, password, code)),
  login: (email, password) =>
    dispatch(actions.creators.loginRequest(email, password)),
  logout: () =>
    dispatch(actions.creators.logoutRequest())
})

const mapStateToProps = (state) => ({
  mode: selectors.getFormMode(state),
  session: selectors.getSession(state),
  requestInProgress: selectors.getRequestInProgress(state),
  message: selectors.getMessage(state),
  errorMessage: selectors.getErrorMessage(state),
  signUpState: selectors.getSignUpState(state),
  forgotState: selectors.getForgotState(state),
  token: selectors.getToken(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
