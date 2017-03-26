import Immutable, { Iterable } from 'immutable'
import { constants, actions, reducer, selectors, sagas }
  from 'modules/cognito-users'
import helpers from '../../helpers'

const expectedConstants = [
  'STATE_PATH',
  'PREFIX',

  'FORM_MODE_SET',

  'COGNITO_SESSION_CHECK',
  'COGNITO_SESSION_SET',
  'COGNITO_REQUEST',
  'COGNITO_RECEIVE',
  'COGNITO_FAILURE',

  'SIGNUP_REQUEST',
  'SIGNUP_RECEIVE',

  'SIGNUP_CODE_REQUEST',
  'SIGNUP_CODE_RECEIVE',

  'CONFIRM_REQUEST',
  'CONFIRM_RECEIVE',

  'FORGOT_CODE_REQUEST',
  'FORGOT_CODE_RECEIVE',
  'FORGOT_CONFIRM_REQUEST',
  'FORGOT_CONFIRM_RECEIVE',

  'LOGIN_REQUEST',
  'LOGIN_RECEIVE',

  'LOGOUT_REQUEST',
  'LOGOUT_RECEIVE'
]

describe('(Redux Module) Cognito Users', () => {
  it('Should export users constants.', () => {
    helpers.allConstExistIn({
      list: expectedConstants, constants
    })
  })

  /* action creators */
  describe('(Action Creators)', () => {
    it('should have a formModeSet action', () => {
      expect(typeof actions.creators.formModeSet)
        .to.equal('function', 'is a function')
      expect(actions.creators.formModeSet('mock-mode'))
        .to.deep.equal({
          type: constants.FORM_MODE_SET,
          payload: 'mock-mode'
        }, 'action and payload are set correctly')
    })

    it('should have a cognitoSessionCheck action', () => {
      expect(typeof actions.creators.cognitoSessionCheck)
        .to.equal('function', 'is a function')
      expect(actions.creators.cognitoSessionCheck())
        .to.deep.equal({
          type: constants.COGNITO_SESSION_CHECK
        }, 'action and payload are set correctly')
    })

    it('should have a cognitoSessionSet action', () => {
      expect(typeof actions.creators.cognitoSessionSet)
        .to.equal('function', 'is a function')
      expect(actions.creators.cognitoSessionSet(
          'mock-logged-in', 'mock-token', 'mock-identity-id', 'mock-student-id'))
        .to.deep.equal({
          type: constants.COGNITO_SESSION_SET,
          payload: {
            loggedIn: 'mock-logged-in',
            token: 'mock-token',
            identityID: 'mock-identity-id',
            studentID: 'mock-student-id'
          }
        }, 'action and payload are set correctly')
    })

    it('should have a cognitoRequest action', () => {
      expect(typeof actions.creators.cognitoRequest)
        .to.equal('function', 'is a function')
      expect(actions.creators.cognitoRequest())
        .to.deep.equal({
          type: constants.COGNITO_REQUEST
        }, 'action and payload are set correctly')
    })

    it('should have a cognitoReceive action', () => {
      expect(typeof actions.creators.cognitoReceive)
        .to.equal('function', 'is a function')
      expect(actions.creators.cognitoReceive('mock-message'))
        .to.deep.equal({
          type: constants.COGNITO_RECEIVE,
          payload: 'mock-message'
        }, 'action and payload are set correctly')
    })

    it('should have a cognitoFailure action', () => {
      expect(typeof actions.creators.cognitoFailure)
        .to.equal('function', 'is a function')
      expect(actions.creators.cognitoFailure('the-message'))
        .to.deep.equal({
          type: constants.COGNITO_FAILURE,
          payload: 'the-message'
        }, 'action and payload are set correctly')
    })

    it('should have a signupRequest action', () => {
      expect(typeof actions.creators.signupRequest)
        .to.equal('function', 'is a function')
      expect(actions.creators.signupRequest('test-email', 'test-password', 'test-studentid'))
        .to.deep.equal({
          type: constants.SIGNUP_REQUEST,
          payload: {
            email: 'test-email',
            password: 'test-password',
            studentID: 'test-studentid'
          }
        }, 'action and payload are set correctly')
    })

    it('should have a signupReceive action', () => {
      expect(typeof actions.creators.signupReceive)
        .to.equal('function', 'is a function')
      expect(actions.creators.signupReceive('mock-email'))
        .to.deep.equal({
          type: constants.SIGNUP_RECEIVE,
          payload: 'mock-email'
        }, 'action and payload are set correctly')
    })

    it('should have a signupCodeRequest action', () => {
      expect(typeof actions.creators.signupCodeRequest)
        .to.equal('function', 'is a function')
      expect(actions.creators.signupCodeRequest('test-email'))
        .to.deep.equal({
          type: constants.SIGNUP_CODE_REQUEST,
          payload: 'test-email'
        }, 'action and payload are set correctly')
    })

    it('should have a signupCodeReceive action', () => {
      expect(typeof actions.creators.signupCodeReceive)
        .to.equal('function', 'is a function')
      expect(actions.creators.signupCodeReceive())
        .to.deep.equal({
          type: constants.SIGNUP_CODE_RECEIVE
        }, 'action and payload are set correctly')
    })

    it('should have a confirmRequest action', () => {
      expect(typeof actions.creators.confirmRequest)
        .to.equal('function', 'is a function')
      expect(actions.creators.confirmRequest('test-email', 'test-code'))
        .to.deep.equal({
          type: constants.CONFIRM_REQUEST,
          payload: {
            email: 'test-email',
            code: 'test-code'
          }
        }, 'action and payload are set correctly')
    })

    it('should have a confirmReceive action', () => {
      expect(typeof actions.creators.confirmReceive)
        .to.equal('function', 'is a function')
      expect(actions.creators.confirmReceive())
        .to.deep.equal({
          type: constants.CONFIRM_RECEIVE
        }, 'action and payload are set correctly')
    })

    it('should have a forgotCodeRequest action', () => {
      expect(typeof actions.creators.forgotCodeRequest)
        .to.equal('function', 'is a function')
      expect(actions.creators.forgotCodeRequest('mock-email', 'mock-password'))
        .to.deep.equal({
          type: constants.FORGOT_CODE_REQUEST,
          payload: {
            email: 'mock-email',
            password: 'mock-password'
          }
        }, 'action and payload are set correctly')
    })

    it('should have a forgotCodeReceive action', () => {
      expect(typeof actions.creators.forgotCodeReceive)
        .to.equal('function', 'is a function')
      expect(actions.creators.forgotCodeReceive())
        .to.deep.equal({
          type: constants.FORGOT_CODE_RECEIVE
        }, 'action and payload are set correctly')
    })

    it('should have a forgotConfirmRequest action', () => {
      expect(typeof actions.creators.forgotConfirmRequest)
        .to.equal('function', 'is a function')
      expect(actions.creators.forgotConfirmRequest('mock-email', 'mock-password', 'mock-code'))
        .to.deep.equal({
          type: constants.FORGOT_CONFIRM_REQUEST,
          payload: {
            email: 'mock-email',
            password: 'mock-password',
            code: 'mock-code'
          }
        }, 'action and payload are set correctly')
    })

    it('should have a forgotConfirmReceive action', () => {
      expect(typeof actions.creators.forgotConfirmReceive)
        .to.equal('function', 'is a function')
      expect(actions.creators.forgotConfirmReceive())
        .to.deep.equal({
          type: constants.FORGOT_CONFIRM_RECEIVE
        }, 'action and payload are set correctly')
    })

    it('should have a loginRequest action', () => {
      expect(typeof actions.creators.loginRequest)
        .to.equal('function', 'is a function')
      expect(actions.creators.loginRequest('the-user', 'the-password'))
        .to.deep.equal({
          type: constants.LOGIN_REQUEST,
          payload: {
            email: 'the-user',
            password: 'the-password'
          }
        }, 'action and payload are set correctly')
    })

    it('should have a loginReceive action', () => {
      expect(typeof actions.creators.loginReceive)
        .to.equal('function', 'is a function')
      expect(actions.creators.loginReceive('abc', 'efg'))
        .to.deep.equal({
          type: constants.LOGIN_RECEIVE
        }, 'action and payload are set correctly')
    })

    it('should have a logoutRequest action', () => {
      expect(typeof actions.creators.logoutRequest)
        .to.equal('function', 'is a function')
      expect(actions.creators.logoutRequest())
        .to.deep.equal({
          type: constants.LOGOUT_REQUEST
        }, 'action and payload are set correctly')
    })

    it('should have a logoutReceive action', () => {
      expect(typeof actions.creators.logoutReceive)
        .to.equal('function', 'is a function')
      expect(actions.creators.logoutReceive())
        .to.deep.equal({
          type: constants.LOGOUT_RECEIVE
        }, 'action and payload are set correctly')
    })
  })

  /* action handlers */
  describe('(Action Handlers)', () => {
    describe('FORM_MODE_SET', () => {
      it('should handle the FORM_MODE_SET action', () => {
        expect(typeof actions.handlers[constants.FORM_MODE_SET])
          .to.equal('function', 'handler is defined')
      })

      it('should set mode', () => {
        const state1 = Immutable.fromJS({
          mode: '',
          message: 'mock-message',
          errorMessage: 'mock-error'
        })

        const action1 = { type: 'mock', payload: 'mock-mode' }

        const state2 =
          actions.handlers[constants.FORM_MODE_SET](state1, action1)

        const state2JS = state2.toJS()

        expect(state2JS.mode)
          .to.equal('mock-mode', 'mode is set correctly')
        expect(state2JS.message)
          .to.equal('', 'message is unset')
        expect(state2JS.errorMessage)
          .to.equal('', 'errorMessage is unset')
      })
    })

    describe('COGNITO_SESSION_SET', () => {
      it('should handle the COGNITO_SESSION_SET action', () => {
        expect(typeof actions.handlers[constants.COGNITO_SESSION_SET])
          .to.equal('function', 'handler is defined')
      })

      it('should set session.loggedIn and session.loggedInCheck', () => {
        const state1 = Immutable.fromJS({
          session: {
            token: '',
            identityID: '',
            loggedIn: false,
            loggedInCheck: true
          }
        })

        const action1 = {
          type: 'mock',
          payload: {
            loggedIn: true,
            token: 'mock-token',
            identityID: 'mock-identity-id'
          }
        }

        const state2 =
          actions.handlers[constants.COGNITO_SESSION_SET](state1, action1)

        const session = state2.toJS().session

        expect(session.token)
          .to.equal('mock-token', 'session.token is set correctly')
        expect(session.identityID)
          .to.equal('mock-identity-id', 'session.identityID is set correctly')
        expect(session.loggedIn)
          .to.equal(true, 'session.loggedIn is set to true')
        expect(session.loggedInCheck)
          .to.equal(false, 'session.loggedInCheck is set to false')
      })
    })

    describe('COGNITO_REQUEST', () => {
      it('should handle the COGNITO_REQUEST action', () => {
        expect(typeof actions.handlers[constants.COGNITO_REQUEST])
          .to.equal('function', 'handler is defined')
      })

      it('should set requestInProgress', () => {
        const state1 = Immutable.fromJS({
          requestInProgress: false,
          errorMessage: 'mock-error'
        })

        const action1 = { type: 'mock', payload: 'mock' }

        const state2 =
          actions.handlers[constants.COGNITO_REQUEST](state1, action1)

        const state2JS = state2.toJS()

        expect(state2JS.requestInProgress)
          .to.equal(true, 'requestInProgress is set to true')
        expect(state2JS.errorMessage)
          .to.equal('', 'errorMessage is removed')
      })
    })

    describe('COGNITO_RECEIVE', () => {
      it('should handle the COGNITO_RECEIVE action', () => {
        expect(typeof actions.handlers[constants.COGNITO_RECEIVE])
          .to.equal('function', 'handler is defined')
      })

      it('should set message and requestInProgress', () => {
        const state1 = Immutable.fromJS({
          message: '',
          requestInProgress: true
        })

        const action1 = { type: 'mock', payload: 'mock-message' }

        const state2 =
          actions.handlers[constants.COGNITO_RECEIVE](state1, action1)

        const state2JS = state2.toJS()

        expect(state2JS.message)
          .to.equal('mock-message', 'message is set to correctly')
        expect(state2JS.requestInProgress)
          .to.equal(false, 'requestInProgress is set to false')
      })
    })

    describe('COGNITO_FAILURE', () => {
      it('should handle the COGNITO_FAILURE action', () => {
        expect(typeof actions.handlers[constants.COGNITO_FAILURE])
          .to.equal('function', 'handler is defined')
      })

      it('should set requestInProgress', () => {
        const state1 = Immutable.fromJS({
          requestInProgress: true,
          errorMessage: ''
        })

        const action1 = { type: 'mock', payload: 'mock-error' }

        const state2 =
          actions.handlers[constants.COGNITO_FAILURE](state1, action1)

        const state2JS = state2.toJS()

        expect(state2JS.requestInProgress)
          .to.equal(false, 'requestInProgress is set to false')
        expect(state2JS.errorMessage)
          .to.equal('mock-error', 'errorMessage is set correctly')
      })
    })

    describe('SIGNUP_REQUEST', () => {
      it('should handle the SIGNUP_REQUEST action', () => {
        expect(typeof actions.handlers[constants.SIGNUP_REQUEST])
          .to.equal('function', 'handler is defined')
      })

      it('should set signUp email and password', () => {
        const state1 = Immutable.fromJS({
          signUp: {
            email: '',
            password: ''
          }
        })

        const action1 = { type: 'mock',
          payload: { email: 'mock-email', password: 'mock-password' } }

        const state2 =
          actions.handlers[constants.SIGNUP_REQUEST](state1, action1)

        const state2JS = state2.toJS()

        expect(state2JS.signUp.email)
          .to.equal('mock-email', 'email is set correctly')
        expect(state2JS.signUp.password)
          .to.equal('mock-password', 'password is set correctly')
      })
    })

    describe('SIGNUP_RECEIVE', () => {
      it('should handle the SIGNUP_RECEIVE action', () => {
        expect(typeof actions.handlers[constants.SIGNUP_RECEIVE])
          .to.equal('function', 'handler is defined')
      })

      it('should set signUp values', () => {
        const state1 = Immutable.fromJS({
          signUp: {
            status: ''
          }
        })

        const action1 = { type: 'mock' }

        const state2 =
          actions.handlers[constants.SIGNUP_RECEIVE](state1, action1)

        const state2JS = state2.toJS()

        expect(state2JS.signUp.status)
          .to.equal('pending', 'signup status is set correctly')
      })
    })

    describe('SIGNUP_CODE_REQUEST', () => {
      it('should handle the SIGNUP_CODE_REQUEST action', () => {
        expect(typeof actions.handlers[constants.SIGNUP_CODE_REQUEST])
          .to.equal('function', 'handler is defined')
      })

      it('should set signUp.codeSending value', () => {
        const state1 = Immutable.fromJS({
          signUp: {
            codeSending: false
          }
        })

        const action1 = { type: 'mock', payload: 'mock-payload' }

        const state2 =
          actions.handlers[constants.SIGNUP_CODE_REQUEST](state1, action1)

        expect(state2.toJS().signUp.codeSending)
          .to.equal(true, 'codeSending is set to true')
      })
    })

    describe('SIGNUP_CODE_RECEIVE', () => {
      it('should handle the SIGNUP_CODE_RECEIVE action', () => {
        expect(typeof actions.handlers[constants.SIGNUP_CODE_RECEIVE])
          .to.equal('function', 'handler is defined')
      })

      it('should set signUp.codeSending value', () => {
        const state1 = Immutable.fromJS({
          signUp: {
            codeSending: true
          }
        })

        const action1 = { type: 'mock', payload: 'mock-payload' }

        const state2 =
          actions.handlers[constants.SIGNUP_CODE_RECEIVE](state1, action1)

        expect(state2.toJS().signUp.codeSending)
          .to.equal(false, 'codeSending is set to false')
      })
    })

    describe('CONFIRM_RECEIVE', () => {
      it('should handle the CONFIRM_RECEIVE action', () => {
        expect(typeof actions.handlers[constants.CONFIRM_RECEIVE])
          .to.equal('function', 'handler is defined')
      })

      it('should set signUp values', () => {
        const state1 = Immutable.fromJS({
          signUp: {
            email: 'test-email',
            status: 'pending'
          }
        })

        const action1 = { type: 'mock' }

        const state2 =
          actions.handlers[constants.CONFIRM_RECEIVE](state1, action1)

        const state2JS = state2.toJS()

        expect(state2JS.signUp.email)
          .to.equal('', 'email is unset')
        expect(state2JS.signUp.status)
          .to.equal('', 'signup status unset')
      })
    })

    describe('FORGOT_CODE_REQUEST', () => {
      it('should handle the FORGOT_CODE_REQUEST action', () => {
        expect(typeof actions.handlers[constants.FORGOT_CODE_REQUEST])
          .to.equal('function', 'handler is defined')
      })

      it('should set forgot email and password', () => {
        const state1 = Immutable.fromJS({
          forgot: {
            email: '',
            password: ''
          }
        })

        const action1 = { type: 'mock',
          payload: { email: 'mock-email', password: 'mock-password' } }

        const state2 =
          actions.handlers[constants.FORGOT_CODE_REQUEST](state1, action1)

        const state2JS = state2.toJS()

        expect(state2JS.forgot.email)
          .to.equal('mock-email', 'email is set correctly')
        expect(state2JS.forgot.password)
          .to.equal('mock-password', 'password is set correctly')
      })
    })

    describe('FORGOT_CODE_RECEIVE', () => {
      it('should handle the FORGOT_CODE_RECEIVE action', () => {
        expect(typeof actions.handlers[constants.FORGOT_CODE_RECEIVE])
          .to.equal('function', 'handler is defined')
      })

      it('should set forgot values', () => {
        const state1 = Immutable.fromJS({
          forgot: {
            status: ''
          }
        })

        const action1 = { type: 'mock' }

        const state2 =
          actions.handlers[constants.FORGOT_CODE_RECEIVE](state1, action1)

        const state2JS = state2.toJS()

        expect(state2JS.forgot.status)
          .to.equal('pending', 'forgot status is set correctly')
      })
    })

    describe('FORGOT_CONFIRM_RECEIVE', () => {
      it('should handle the FORGOT_CONFIRM_RECEIVE action', () => {
        expect(typeof actions.handlers[constants.FORGOT_CONFIRM_RECEIVE])
          .to.equal('function', 'handler is defined')
      })

      it('should unset forgot values', () => {
        const state1 = Immutable.fromJS({
          forgot: {
            email: 'mock-email',
            password: 'mock-password',
            status: 'mock-status'
          }
        })

        const action1 = { type: 'mock' }

        const state2 =
          actions.handlers[constants.FORGOT_CONFIRM_RECEIVE](state1, action1)

        const state2JS = state2.toJS()

        expect(state2JS.forgot.email)
          .to.equal('', 'forgot email is set correctly')
        expect(state2JS.forgot.password)
          .to.equal('', 'forgot password is set correctly')
        expect(state2JS.forgot.status)
          .to.equal('', 'forgot status is set correctly')
      })
    })

    describe('LOGOUT_RECEIVE', () => {
      it('should handle the LOGOUT_RECEIVE action', () => {
        expect(typeof actions.handlers[constants.LOGOUT_RECEIVE])
          .to.equal('function', 'handler is defined')
      })

      it('should unset token and identityID', () => {
        const state1 = Immutable.fromJS({
          session: { token: 'mock-token', identityID: 'mock-identity-id' }
        })

        const action1 = { type: 'mock', payload: 'mock-token' }

        const state2 =
          actions.handlers[constants.LOGOUT_RECEIVE](state1, action1)

        const state2JS = state2.toJS()

        expect(state2JS.session.token)
          .to.equal('', 'token is unset correctly')
        expect(state2JS.session.identityID)
          .to.equal('', 'identityID is unset correctly')
      })
    })
  })

  /* reducer */
  describe('(Reducer)', () => {
    it('reducer.initialState is exported', () => {
      expect(typeof reducer.initialState).to.equal('object', 'is an object')
      expect(Iterable.isIterable(reducer.initialState))
        .to.equal(true, 'is an Immutable.js Iterable')
    })

    it('reducer.initialState is the correct shape', () => {
      expect(reducer.initialState.toJS())
        .to.deep.equal({
          debug: false,
          mode: 'signup',
          requestInProgress: false,
          message: '',
          errorMessage: '',
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
            token: '',
            identityID: '',
            loggedIn: false,
            loggedInCheck: true
          }
        }, 'shape is correct')
    })
  })

  /* selectors */
  describe('(Selectors)', () => {
    describe('getFormMode', () => {
      const _state = {
        [constants.STATE_PATH]: Immutable.fromJS({
          mode: 'mock-mode'
        })
      }

      it('should have a _getFormMode function', () => {
        expect(typeof selectors._getFormMode)
          .to.equal('function', 'is a function')

        expect(selectors._getFormMode(_state))
          .to.equal('mock-mode', 'returns correct mode')
      })

      it('should have a getFormMode function', () => {
        expect(typeof selectors.getFormMode)
          .to.equal('function', 'is a function')

        expect(selectors.getFormMode(_state))
          .to.equal('mock-mode', 'returns correct mode')
      })
    })

    describe('getRequestInProgress', () => {
      const _state = {
        [constants.STATE_PATH]: Immutable.fromJS({
          requestInProgress: true
        })
      }

      it('should have a _getRequestInProgress function', () => {
        expect(typeof selectors._getRequestInProgress)
          .to.equal('function', 'is a function')

        expect(selectors._getRequestInProgress(_state))
          .to.equal(true, 'returns true')
      })

      it('should have a getRequestInProgress function', () => {
        expect(typeof selectors.getRequestInProgress)
          .to.equal('function', 'is a function')

        expect(selectors.getRequestInProgress(_state))
          .to.equal(true, 'returns true')
      })
    })

    describe('getMessage', () => {
      const _state = {
        [constants.STATE_PATH]: Immutable.fromJS({
          message: 'hello message'
        })
      }

      it('should have a _getMessage function', () => {
        expect(typeof selectors._getMessage)
          .to.equal('function', 'is a function')

        expect(selectors._getMessage(_state))
          .to.equal('hello message', 'returns correct message')
      })

      it('should have a getMessage function', () => {
        expect(typeof selectors.getMessage)
          .to.equal('function', 'is a function')

        expect(selectors.getMessage(_state))
          .to.equal('hello message', 'returns correct message')
      })
    })

    describe('getErrorMessage', () => {
      const _state = {
        [constants.STATE_PATH]: Immutable.fromJS({
          errorMessage: 'hello error'
        })
      }

      it('should have a _getErrorMessage function', () => {
        expect(typeof selectors._getErrorMessage)
          .to.equal('function', 'is a function')

        expect(selectors._getErrorMessage(_state))
          .to.equal('hello error', 'returns correct error')
      })

      it('should have a getErrorMessage function', () => {
        expect(typeof selectors.getErrorMessage)
          .to.equal('function', 'is a function')

        expect(selectors.getErrorMessage(_state))
          .to.equal('hello error', 'returns correct error')
      })
    })

    describe('getSignUpState', () => {
      const _state = {
        [constants.STATE_PATH]: Immutable.fromJS({
          signUp: {
            email: 'mock-email',
            status: 'mock-status'
          }
        })
      }

      it('should have a _getSignUpState function', () => {
        expect(typeof selectors._getSignUpState)
          .to.equal('function', 'is a function')

        expect(selectors._getSignUpState(_state))
          .to.equal(_state[constants.STATE_PATH]
            .get('signUp'), 'returns signUp state')
      })

      it('should have a getSignUpState function', () => {
        expect(typeof selectors.getSignUpState)
          .to.equal('function', 'is a function')

        expect(selectors.getSignUpState(_state))
          .to.deep.equal({ email: 'mock-email', status: 'mock-status' },
            'returns signUp state')
      })
    })

    describe('getForgotState', () => {
      const _state = {
        [constants.STATE_PATH]: Immutable.fromJS({
          forgot: {
            email: 'mock-email',
            password: 'mock-password',
            status: ''
          }
        })
      }

      it('should have a _getForgotState function', () => {
        expect(typeof selectors._getForgotState)
          .to.equal('function', 'is a function')

        expect(selectors._getForgotState(_state))
          .to.equal(_state[constants.STATE_PATH]
            .get('forgot'), 'returns forgot state')
      })

      it('should have a getForgotState function', () => {
        expect(typeof selectors.getForgotState)
          .to.equal('function', 'is a function')

        expect(selectors.getForgotState(_state))
          .to.deep.equal({ email: 'mock-email', password: 'mock-password', status: '' },
            'returns forgot state')
      })
    })

    describe('getToken', () => {
      const _state = {
        [constants.STATE_PATH]: Immutable.fromJS({
          session: { token: 'mock-token' }
        })
      }

      it('should have a _getToken function', () => {
        expect(typeof selectors._getToken)
          .to.equal('function', 'is a function')

        expect(selectors._getToken(_state))
          .to.equal('mock-token', 'returns token')
      })

      it('should have a getToken function', () => {
        expect(typeof selectors.getToken)
          .to.equal('function', 'is a function')

        expect(selectors.getToken(_state))
          .to.equal('mock-token', 'returns token')
      })
    })

    describe('getSession', () => {
      const _state = {
        [constants.STATE_PATH]: Immutable.fromJS({
          session: {
            loggedIn: 'mock-loggedIn',
            loggedInCheck: 'mock-loggedInCheck'
          }
        })
      }

      it('should have a _getSession function', () => {
        expect(typeof selectors._getSession)
          .to.equal('function', 'is a function')

        expect(selectors._getSession(_state))
          .to.equal(_state[constants.STATE_PATH]
            .get('session'), 'returns session')
      })

      it('should have a getSession function', () => {
        expect(typeof selectors.getSession)
          .to.equal('function', 'is a function')

        expect(selectors.getSession(_state))
          .to.deep.equal({
            loggedIn: 'mock-loggedIn', loggedInCheck: 'mock-loggedInCheck'
          }, 'returns token')
      })
    })
  })

  /* sagas */
  describe('(Sagas)', () => {
    it('should export a sagas.main function', () => {
      expect(typeof sagas.main).to.equal('function', 'is a function')
    })

    it('should export handlers', () => {
      expect(typeof sagas.handlers).to.equal('object', 'is an object')
    })

    describe('LOGIN_REQUEST', () => {})
  })
})
