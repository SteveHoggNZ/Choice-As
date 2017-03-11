import { take, call, put, select } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import Immutable from 'immutable'
import * as immutableUtil from 'util/immutable'
import { createSelector } from 'reselect'
import { createReducer } from 'util/reducers'
import {
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails
} from 'amazon-cognito-identity-js'
import sagaUtil from 'util/sagas'
import config from 'config/cognito-users.js'

const cognitoUserPool = new CognitoUserPool({
  UserPoolId: config['user-pool-id'],
  ClientId: config['user-pool-app-client-id']
})

const STATE_PATH = 'cognito-users'
const PREFIX = `${STATE_PATH}/`

const constants = {
  STATE_PATH,
  PREFIX,

  FORM_MODE_SET: `${PREFIX}FORM_MODE_SET`,

  COGNITO_SESSION_CHECK: `${PREFIX}COGNITO_SESSION_CHECK`,
  COGNITO_SESSION_SET: `${PREFIX}COGNITO_SESSION_SET`,
  COGNITO_REQUEST: `${PREFIX}COGNITO_REQUEST`,
  COGNITO_RECEIVE: `${PREFIX}COGNITO_RECEIVE`,
  COGNITO_FAILURE: `${PREFIX}COGNITO_FAILURE`,

  SIGNUP_REQUEST: `${PREFIX}SIGNUP_REQUEST`,
  SIGNUP_RECEIVE: `${PREFIX}SIGNUP_RECEIVE`,

  SIGNUP_CODE_REQUEST: `${PREFIX}SIGNUP_CODE_REQUEST`,
  SIGNUP_CODE_RECEIVE: `${PREFIX}SIGNUP_CODE_RECEIVE`,

  CONFIRM_REQUEST: `${PREFIX}CONFIRM_REQUEST`,
  CONFIRM_RECEIVE: `${PREFIX}CONFIRM_RECEIVE`,

  FORGOT_CODE_REQUEST: `${PREFIX}FORGOT_CODE_REQUEST`,
  FORGOT_CODE_RECEIVE: `${PREFIX}FORGOT_CODE_RECEIVE`,
  FORGOT_CONFIRM_REQUEST: `${PREFIX}FORGOT_CONFIRM_REQUEST`,
  FORGOT_CONFIRM_RECEIVE: `${PREFIX}FORGOT_CONFIRM_RECEIVE`,

  LOGIN_REQUEST: `${PREFIX}LOGIN_REQUEST`,
  LOGIN_RECEIVE: `${PREFIX}LOGIN_RECEIVE`,

  LOGOUT_REQUEST: `${PREFIX}LOGOUT_REQUEST`,
  LOGOUT_RECEIVE: `${PREFIX}LOGOUT_RECEIVE`
}

/* action creators */
const creators = {
  formModeSet: (mode) => ({
    type: constants.FORM_MODE_SET,
    payload: mode
  }),
  cognitoSessionCheck: () => ({
    type: constants.COGNITO_SESSION_CHECK
  }),
  cognitoSessionSet: (loggedIn) => ({
    type: constants.COGNITO_SESSION_SET,
    payload: loggedIn
  }),
  cognitoRequest: (email, password, studentid) => ({
    type: constants.COGNITO_REQUEST
  }),
  cognitoReceive: (message) => ({
    type: constants.COGNITO_RECEIVE,
    payload: message
  }),
  cognitoFailure: (error) => ({
    type: constants.COGNITO_FAILURE,
    payload: error
  }),

  signupRequest: (email, password, studentid) => ({
    type: constants.SIGNUP_REQUEST,
    payload: {
      email,
      password,
      studentid
    }
  }),
  signupReceive: (email) => ({
    type: constants.SIGNUP_RECEIVE,
    payload: email
  }),

  signupCodeRequest: (email) => ({
    type: constants.SIGNUP_CODE_REQUEST,
    payload: email
  }),
  signupCodeReceive: () => ({
    type: constants.SIGNUP_CODE_RECEIVE
  }),

  confirmRequest: (email, code) => ({
    type: constants.CONFIRM_REQUEST,
    payload: {
      email,
      code
    }
  }),
  confirmReceive: () => ({
    type: constants.CONFIRM_RECEIVE
  }),

  forgotCodeRequest: (email, password) => ({
    type: constants.FORGOT_CODE_REQUEST,
    payload: {
      email,
      password
    }
  }),
  forgotCodeReceive: () => ({
    type: constants.FORGOT_CODE_RECEIVE
  }),
  forgotConfirmRequest: (email, password, code) => ({
    type: constants.FORGOT_CONFIRM_REQUEST,
    payload: {
      email,
      password,
      code
    }
  }),
  forgotConfirmReceive: () => ({
    type: constants.FORGOT_CONFIRM_RECEIVE
  }),

  loginRequest: (email, password) => ({
    type: constants.LOGIN_REQUEST,
    payload: {
      email,
      password
    }
  }),
  loginReceive: (token) => ({
    type: constants.LOGIN_RECEIVE,
    payload: token
  }),

  logoutRequest: () => ({
    type: constants.LOGOUT_REQUEST
  }),
  logoutReceive: () => ({
    type: constants.LOGOUT_RECEIVE
  })
}

/* action handlers */
const handlers = {
  [constants.FORM_MODE_SET]: (state, action) =>
    state.set('mode', action.payload)
      .set('message', '')
      .set('errorMessage', ''),
  [constants.COGNITO_SESSION_SET]: (state, action) =>
    state.setIn(['session', 'loggedIn'], action.payload)
      .setIn(['session', 'loggedInCheck'], false),
  [constants.COGNITO_REQUEST]: (state, action) =>
    state.set('requestInProgress', true)
      .set('errorMessage', ''),
  [constants.COGNITO_RECEIVE]: (state, action) =>
    state.set('message', action.payload)
      .set('requestInProgress', false),
  [constants.COGNITO_FAILURE]: (state, action) =>
    state.set('requestInProgress', false)
      .set('errorMessage', action.payload),
  [constants.SIGNUP_REQUEST]: (state, action) =>
    state.setIn(['signUp', 'email'], action.payload.email)
      .setIn(['signUp', 'password'], action.payload.password),
  [constants.SIGNUP_RECEIVE]: (state, action) =>
    state.setIn(['signUp', 'status'], 'pending'),
  [constants.SIGNUP_CODE_REQUEST]: (state, action) =>
    state.setIn(['signUp', 'codeSending'], true),
  [constants.SIGNUP_CODE_RECEIVE]: (state, action) =>
    state.setIn(['signUp', 'codeSending'], false),
  [constants.CONFIRM_RECEIVE]: (state, action) =>
    state.setIn(['signUp', 'email'], '')
      .setIn(['signUp', 'status'], ''),
  [constants.FORGOT_CODE_REQUEST]: (state, action) =>
    state.setIn(['forgot', 'email'], action.payload.email)
      .setIn(['forgot', 'password'], action.payload.password),
  [constants.FORGOT_CODE_RECEIVE]: (state, action) =>
    state.setIn(['forgot', 'status'], 'pending'),
  [constants.FORGOT_CONFIRM_RECEIVE]: (state, action) =>
    state.setIn(['forgot', 'email'], '')
      .setIn(['forgot', 'password'], '')
      .setIn(['forgot', 'status'], ''),
  [constants.LOGIN_RECEIVE]: (state, action) =>
    state.set('token', action.payload),
  [constants.LOGOUT_RECEIVE]: (state, action) =>
    state.set('token', '')
}

const actions = {
  creators,
  handlers
}

/* reducer */
const initialState = Immutable.fromJS({
  mode: 'signup',
  requestInProgress: false,
  message: '',
  errorMessage: '',
  token: '',
  signUp: {
    email: '',
    password: '',
    status: '',
    codeSending: false
  },
  forgot: {
    email: '',
    password: '',
    status: ''
  },
  session: {
    loggedIn: false,
    loggedInCheck: true
  }
}, immutableUtil.toMapWithOrderedSets)

const reducer = {
  initialState,
  main: createReducer(initialState, actions.handlers)
}

/* selectors */
const _getFormMode = (state) =>
  state[constants.STATE_PATH].get('mode')

const getFormMode = createSelector(
  _getFormMode,
  (mode) => mode
)

const _getRequestInProgress = (state) =>
  state[constants.STATE_PATH].get('requestInProgress')

const getRequestInProgress = createSelector(
  _getRequestInProgress,
  (requestInProgress) => requestInProgress
)

const _getMessage = (state) =>
  state[constants.STATE_PATH].get('message')

const getMessage = createSelector(
  _getMessage,
  (message) => message
)

const _getErrorMessage = (state) =>
  state[constants.STATE_PATH].get('errorMessage')

const getErrorMessage = createSelector(
  _getErrorMessage,
  (errorMessage) => errorMessage
)

const _getSignUpState = (state) =>
  state[constants.STATE_PATH].get('signUp')

const getSignUpState = createSelector(
  _getSignUpState,
  (signUp) => signUp.toJS()
)

const _getForgotState = (state) =>
  state[constants.STATE_PATH].get('forgot')

const getForgotState = createSelector(
  _getForgotState,
  (forgot) => forgot.toJS()
)

const _getToken = (state) =>
  state[constants.STATE_PATH].get('token')

const getToken = createSelector(
  _getToken,
  (token) => token
)

const _getSession = (state) =>
  state[constants.STATE_PATH].get('session')

const getSession = createSelector(
  _getSession,
  (session) => session.toJS()
)

// const _getIsLoggedIn = () => {
//   const cognitoUser = cognitoUserPool.getCurrentUser()
//   if (cognitoUser === null) {
//     return false
//   }
//
//   return cognitoUserPool
// }

const selectors = {
  _getFormMode,
  getFormMode,
  _getRequestInProgress,
  getRequestInProgress,
  _getMessage,
  getMessage,
  _getErrorMessage,
  getErrorMessage,
  _getSignUpState,
  getSignUpState,
  _getForgotState,
  getForgotState,
  _getToken,
  getToken,
  _getSession,
  getSession
}

/* sagas */
const errorHandler = (error) => [
  sagaUtil.defaultErrorHandler(error)
]

const sagaHandlers = {
  [constants.COGNITO_SESSION_CHECK]: {
    errorHandler,
    takeType: 'takeLatest',
    handler: function * (action) {
      const cognitoUser = cognitoUserPool.getCurrentUser()

      if (cognitoUser === null) {
        yield put(yield call(actions.creators.cognitoSessionSet, false))
      } else {
        const createSessionCheckChannel = () => {
          return eventChannel((emit) => {
            // setTimeout is used as the callback returns too quickly
            setTimeout(() => {
              cognitoUser.getSession(function (error, session) {
                if (error) {
                  emit({ error: error.message })
                } else {
                  emit({ success: { isValid: session.isValid() } })
                }
              })
            }, 0)

            const unsubscribe = () => {}
            return unsubscribe
          })
        }

        const sessionCheckChannel = yield call(createSessionCheckChannel)
        try {
          let result = yield take(sessionCheckChannel)
          if (result.success) {
            yield put(
              yield call(
                actions.creators.cognitoSessionSet, result.success.isValid))
          } else if (result.error) {
            yield put(yield call(actions.creators.cognitoFailure, result.error))
            yield put(yield call(actions.creators.cognitoSessionSet, false))
          }
        } catch (error) {
          sessionCheckChannel.close()
          yield put(yield call(actions.creators.cognitoFailure, error.message))
          yield put(yield call(actions.creators.cognitoSessionSet, false))
        }
      }
    }
  },
  [constants.SIGNUP_REQUEST]: {
    errorHandler,
    takeType: 'takeLatest',
    handler: function * (action) {
      yield put(yield call(actions.creators.cognitoRequest))

      let attributeList = []

      const dataEmail = {
        Name: 'email',
        Value: action.payload.email
      }

      const dataStudentID = {
        Name: 'custom:student-id',
        Value: action.payload.studentid
      }

      let attributeEmail = new CognitoUserAttribute(dataEmail)
      let attributeStudentID = new CognitoUserAttribute(dataStudentID)

      attributeList.push(attributeEmail)
      attributeList.push(attributeStudentID)

      const createSignupChannel = () => {
        return eventChannel((emit) => {
          cognitoUserPool.signUp(
            action.payload.email,
            action.payload.password,
            attributeList,
            null,
            function (error, result) {
              if (error) {
                emit({ error: error.message })
              } else {
                const cognitoUser = result.user
                emit({ success: cognitoUser.getUsername() })
              }
            })

          const unsubscribe = () => {}
          return unsubscribe
        })
      }

      const signupChannel = yield call(createSignupChannel)
      try {
        let result = yield take(signupChannel)
        yield put(yield call(actions.creators.cognitoReceive))
        if (result.success) {
          yield put(yield call(actions.creators.signupReceive, result.success))
        } else if (result.error) {
          yield put(yield call(actions.creators.cognitoFailure, result.error))
        }
      } catch (error) {
        signupChannel.close()
        yield put(yield call(actions.creators.cognitoFailure, error.message))
      }
    }
  },
  [constants.SIGNUP_CODE_REQUEST]: {
    errorHandler,
    takeType: 'takeLatest',
    handler: function * (action) {
      yield put(yield call(actions.creators.cognitoRequest))

      const userData = {
        Username : action.payload,
        Pool : cognitoUserPool
      }

      const createSignupCodeChannel = () => {
        return eventChannel((emit) => {
          const cognitoUser = new CognitoUser(userData)
          if (cognitoUser === null) {
            emit({ error: 'Current user unknown' })
          } else {
            cognitoUser.resendConfirmationCode(function (error, result) {
              if (error) {
                emit({ error: error.message })
              } else {
                emit({ success: true })
              }
            })
          }

          const unsubscribe = () => {}
          return unsubscribe
        })
      }

      const signupCodeChannel = yield call(createSignupCodeChannel)

      try {
        let result = yield take(signupCodeChannel)
        if (result.success) {
          yield put(yield call(actions.creators.cognitoReceive,
            'Please check your inbox for a new confirmation code'))
          yield put(yield call(actions.creators.signupCodeReceive))
        } else if (result.error) {
          yield put(yield call(actions.creators.cognitoReceive))
          yield put(yield call(actions.creators.cognitoFailure, result.error))
        }
      } catch (error) {
        signupCodeChannel.close()
        yield put(yield call(actions.creators.cognitoReceive))
        yield put(yield call(actions.creators.cognitoFailure, error.message))
      }
    }
  },
  [constants.CONFIRM_REQUEST]: {
    errorHandler,
    takeType: 'takeLatest',
    handler: function * (action) {
      yield put(yield call(actions.creators.cognitoRequest))

      const userData = {
        Username : action.payload.email,
        Pool : cognitoUserPool
      }

      const cognitoUser = new CognitoUser(userData)

      const createConfirmChannel = () => {
        return eventChannel((emit) => {
          cognitoUser.confirmRegistration(action.payload.code, true, function (error, result) {
            if (error) {
              emit({ error: error.message })
            } else {
              emit({ success: result })
            }
          })

          const unsubscribe = () => {}
          return unsubscribe
        })
      }

      const confirmChannel = yield call(createConfirmChannel)
      try {
        let result = yield take(confirmChannel)
        yield put(yield call(actions.creators.cognitoReceive))
        if (result.success) {
          const signUpState = yield select(selectors.getSignUpState)
          yield put(yield call(actions.creators.confirmReceive, result.success))
          if (signUpState.email !== '' && signUpState.password !== '') {
            // automatically login
            yield put(
              yield call(actions.creators.formModeSet, 'login'))
            yield put(yield call(actions.creators.cognitoReceive,
              'Your login has been verified. Logging in...'))
            yield put(
              yield call(actions.creators.loginRequest,
                signUpState.email, signUpState.password))
          } else {
            // ask the user to manually login
            yield put(
              yield call(actions.creators.formModeSet, 'login'))
            yield put(
              yield call(actions.creators.cognitoReceive,
                'Your login has been verified. Please login with the email and password you selected.'))
          }
        } else if (result.error) {
          yield put(yield call(actions.creators.cognitoFailure, result.error))
        }
      } catch (error) {
        confirmChannel.close()
        yield put(yield call(actions.creators.cognitoFailure, error.message))
      }
    }
  },
  [constants.FORGOT_CODE_REQUEST]: {
    errorHandler,
    takeType: 'takeLatest',
    handler: function * (action) {
      yield put(yield call(actions.creators.cognitoRequest))

      const userData = {
        Username : action.payload.email,
        Pool : cognitoUserPool
      }

      const cognitoUser = new CognitoUser(userData)

      const createForgotChannel = () => {
        return eventChannel((emit) => {
          cognitoUser.forgotPassword({
            onSuccess: function (result) {
              emit({ success: true })
            },
            onFailure: function (error) {
              emit({ error: error.message })
            }
          })

          const unsubscribe = () => {}
          return unsubscribe
        })
      }

      const forgotChannel = yield call(createForgotChannel)
      try {
        let result = yield take(forgotChannel)
        yield put(yield call(actions.creators.cognitoReceive))
        if (result.success) {
          yield put(yield call(actions.creators.forgotCodeReceive, result.success))
        } else if (result.error) {
          yield put(yield call(actions.creators.cognitoFailure, result.error))
        }
      } catch (error) {
        forgotChannel.close()
        yield put(yield call(actions.creators.cognitoFailure, error.message))
      }
    }
  },
  [constants.FORGOT_CONFIRM_REQUEST]: {
    errorHandler,
    takeType: 'takeLatest',
    handler: function * (action) {
      yield put(yield call(actions.creators.cognitoRequest))

      const userData = {
        Username : action.payload.email,
        Pool : cognitoUserPool
      }

      const cognitoUser = new CognitoUser(userData)

      const createForgotConfirmChannel = () => {
        return eventChannel((emit) => {
          cognitoUser.confirmPassword(
            action.payload.code,
            action.payload.password,
            {
              onSuccess: function (result) {
                console.debug('changed password to', action.payload.password)
                emit({ success: true })
              },
              onFailure: function (error) {
                emit({ error: error.message })
              }
            })

          const unsubscribe = () => {}
          return unsubscribe
        })
      }

      const forgotConfirmChannel = yield call(createForgotConfirmChannel)
      try {
        let result = yield take(forgotConfirmChannel)
        yield put(yield call(actions.creators.cognitoReceive))
        if (result.success) {
          const forgotState = yield select(selectors.getForgotState)
          yield put(yield call(actions.creators.forgotConfirmReceive, result.success))
          if (forgotState.email !== '' && forgotState.password !== '') {
            // automatically login
            yield put(
              yield call(actions.creators.formModeSet, 'login'))
            yield put(yield call(actions.creators.cognitoReceive,
              'Your password has been changed. Logging in...'))
            yield put(
              yield call(actions.creators.loginRequest,
                forgotState.email, forgotState.password))
          } else {
            // ask the user to manually login
            yield put(
              yield call(actions.creators.formModeSet, 'login'))
            yield put(
              yield call(actions.creators.cognitoReceive,
                'Your password has been changed. Please login with the email and password you selected.'))
          }
        } else if (result.error) {
          yield put(yield call(actions.creators.cognitoFailure, result.error))
        }
      } catch (error) {
        forgotConfirmChannel.close()
        yield put(yield call(actions.creators.cognitoFailure, error.message))
      }
    }
  },
  [constants.LOGIN_REQUEST]: {
    errorHandler,
    takeType: 'takeLatest',
    handler: function * (action) {
      yield put(yield call(actions.creators.cognitoRequest))

      const userData = {
        Username : action.payload.email,
        Pool : cognitoUserPool
      }

      const cognitoUser = new CognitoUser(userData)

      const authenticationData = {
        Username: action.payload.email,
        Password: action.payload.password
      }
      const authenticationDetails = new AuthenticationDetails(authenticationData)

      // authenticateUser uses callbacks, so to use this within a saga an
      // eventChannel needs to be used as an intermediary; the callbacks emit
      // to the channel and a subsequent yield reads from the channel.
      const createAuthenticateChannel = () => {
        return eventChannel((emit) => {
          cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
              emit(result.getAccessToken().getJwtToken())

              //     // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
              //     //   IdentityPoolId : '...', // your identity pool id here
              //     //   Logins : {
              //     //     // Change the key below according to the specific region your user pool is in.
              //     //     'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>' : result.getIdToken().getJwtToken()
              //     //   }
              //     // })
              //
              //     // Instantiate aws sdk service objects now that the credentials have been updated.
              //     // example: var s3 = new AWS.S3();
            },
            onFailure: function (err) {
              emit(err)
            }
          })

          const unsubscribe = () => {}
          return unsubscribe
        })
      }

      const authChannel = yield call(createAuthenticateChannel)
      try {
        let token = yield take(authChannel)
        yield put(yield call(actions.creators.cognitoReceive))
        yield put(yield call(actions.creators.loginReceive, token))
        yield put(yield call(actions.creators.cognitoSessionCheck))
      } catch (error) {
        authChannel.close()
        yield put(yield call(actions.creators.cognitoFailure, error.message))
      }
    }
  },
  [constants.LOGOUT_REQUEST]: {
    errorHandler,
    takeType: 'takeLatest',
    handler: function * (action) {
      const cognitoUser = cognitoUserPool.getCurrentUser()
      yield call([cognitoUser, cognitoUser.signOut])

      yield put(yield call(actions.creators.logoutReceive))
      yield put(yield call(actions.creators.cognitoSessionCheck))
    }
  }
}

const sagas = {
  handlers: sagaHandlers,
  main: sagaUtil.makeSagaMain({ handlers: sagaHandlers })
}

/* export */
export {
  constants,
  actions,
  reducer,
  selectors,
  sagas
}

export default reducer.main
