import Immutable from 'immutable'
import { createSelector } from 'reselect'
import uuid from 'uuid-v4'
import { browserHistory } from 'react-router'
import { call, put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import sagaUtil from 'util/sagas'
import { selectors as cognitoUsersSelectors } from 'modules/cognito-users'
import {
  selectors as selectorsChoiceAs,
  util as utilChoiceAs
} from '../../../../modules/choiceas'

import { sessionTrialInit, sessionTrialInsert } from 'api/dynamodb'

/* constants */
const STATE_PATH = 'session'
const ROUTE_PATH = STATE_PATH

const PREFIX = 'choiceas/session/'

const ERROR = `${PREFIX}ERROR`

const START = `${PREFIX}START`
const INIT = `${PREFIX}INIT`
const STOP = `${PREFIX}STOP`
const LOG = `${PREFIX}LOG`
const KEY_CLICK = `${PREFIX}KEY_CLICK`
const SESSION_LOCK = `${PREFIX}SESSION_LOCK`
const TRIGGER_REVEAL1 = `${PREFIX}TRIGGER_REVEAL1`
const TRIGGER_REVEAL2 = `${PREFIX}TRIGGER_REVEAL2`
/* TODO, remove TRIAL_UPDATE */
const TRIAL_UPDATE = `${PREFIX}TRIAL_UPDATE`
const TRIAL_RECORD = `${PREFIX}TRIAL_RECORD`
const TRIAL_SHIFT_CURSOR = `${PREFIX}TRIAL_SHIFT_CURSOR`

export const constants = {
  STATE_PATH,
  ROUTE_PATH,
  PREFIX,
  ERROR,
  START,
  INIT,
  STOP,
  LOG,
  KEY_CLICK,
  SESSION_LOCK,
  TRIGGER_REVEAL1,
  TRIGGER_REVEAL2,
  TRIAL_UPDATE,
  TRIAL_RECORD,
  TRIAL_SHIFT_CURSOR
}

/* actions */
/* - action creators */
const start = (conditionID) => {
  return {
    type: constants.START,
    payload: {
      conditionID
    }
  }
}

const init = (conditionID, sessionID) => {
  return {
    type: constants.INIT,
    payload: {
      conditionID,
      sessionID
    }
  }
}

const keyClick = (sessionID, keyID) => {
  return {
    type: constants.KEY_CLICK,
    payload: {
      sessionID,
      keyID
    }
  }
}

const sessionLock = (sessionID) => {
  return {
    type: constants.SESSION_LOCK,
    payload: sessionID
  }
}

const trialReveal1 = (sessionID, cursor) => {
  return {
    type: constants.TRIGGER_REVEAL1,
    payload: {
      sessionID,
      cursor
    }
  }
}

const trialReveal2 = (sessionID, cursor) => {
  return {
    type: constants.TRIGGER_REVEAL2,
    payload: {
      sessionID,
      cursor
    }
  }
}

const trialUpdate = (
  sessionID,
  cursor,
  cursorNext,
  record
) => {
  return {
    type: constants.TRIAL_UPDATE,
    payload: {
      sessionID,
      cursor,
      cursorNext,
      record
    }
  }
}

const trialRecord = (sessionID, cursor, record) => {
  return {
    type: constants.TRIAL_RECORD,
    payload: {
      sessionID,
      cursor,
      record
    }
  }
}

const trialShiftCursor = (sessionID, cursorNext) => {
  return {
    type: constants.TRIAL_SHIFT_CURSOR,
    payload: {
      sessionID,
      cursorNext
    }
  }
}

const stop = () => {
  return {
    type: constants.STOP
  }
}

const log = (sessionID: string, msg: string) => {
  return {
    type: constants.LOG,
    payload: {
      sessionID,
      msg
    }
  }
}

const ACTION_CREATORS = {
  start,
  init,
  stop,
  log,
  keyClick,
  sessionLock,
  trialReveal1,
  trialReveal2,
  trialUpdate,
  trialRecord,
  trialShiftCursor
}

/* - action handlers */
const ACTION_HANDLERS = {
  [constants.INIT]: (state, action) => {
    return state.set(action.payload.sessionID,
      Immutable.fromJS({
        conditionID: action.payload.conditionID,
        locked: false,
        cursor: {
          trialCount: 0,
          keyStageID: 0
        },
        trials: [],
        log: []
      }))
  },
  [constants.SESSION_LOCK]: (state, action) => {
    const sessionID = action.payload
    return state.setIn([sessionID, 'locked'], true)
  },
  [constants.TRIGGER_REVEAL1]: (state, action) => {
    const { sessionID, cursor } = action.payload
    return state.updateIn(
      [sessionID, 'trials', cursor.trialCount, cursor.keyStageID], (stage) => {
        return stage.set('reveal1', true)
      })
  },
  [constants.TRIGGER_REVEAL2]: (state, action) => {
    const { sessionID, cursor } = action.payload
    return state.updateIn(
      [sessionID, 'trials', cursor.trialCount, cursor.keyStageID], (stage) => {
        return stage.set('reveal2', true)
      })
  },
  [constants.TRIAL_RECORD]: (state, action) => {
    const { sessionID, cursor, record } = action.payload
    return state.updateIn(
      [sessionID, 'trials', cursor.trialCount], (trial) => {
        return trial
          ? trial.push(Immutable.fromJS(record)) : Immutable.fromJS([record])
      })
  },
  [constants.TRIAL_SHIFT_CURSOR]: (state, action) => {
    const { sessionID, cursorNext } = action.payload
    return state.withMutations((s) => {
      return s.setIn([sessionID, 'locked'], false)
        .setIn([sessionID, 'cursor'], Immutable.fromJS(cursorNext))
    })
  },
  [constants.TRIAL_UPDATE]: (state, action) => {
    const {
      sessionID,
      cursor,
      cursorNext,
      record
    } = action.payload
    return state.withMutations((s) => {
      s.setIn([sessionID, 'cursor'], Immutable.fromJS(cursorNext))

      s.updateIn([sessionID, 'trials', cursor.trialCount], (trial) => {
        return trial
          ? trial.push(Immutable.fromJS(record)) : Immutable.fromJS([record])
      })

      return s
    })
  },
  [constants.LOG]: (state, action) => {
    return state.updateIn([action.payload.sessionID, 'log'], (val) =>
      val.unshift(action.payload.msg)) /* unshift, newest item to the top */
  }
}

export const actions = {
  creators: ACTION_CREATORS,
  handlers: ACTION_HANDLERS
}

/* reducer */
export const initialState = Immutable.fromJS({})
export const reducer = (
  state = initialState,
  action,
  handlers = actions.handlers
): number => {
  const handler = handlers[action.type]

  return handler ? handler(state, action) : state
}

/* selectors */
const _getSessionState = (state, props) => {
  console.warn('got props in selector', props)
  // return state.getIn([constants.STATE_PATH])
  return state[constants.STATE_PATH]
}

const getSessionState = createSelector(
  _getSessionState,
  (_result) => _result.toJS()
)

const _getSession = (state, props) => {
  return state[constants.STATE_PATH].getIn([props.sessionID]) || undefined
}

const makeGetSession = () => createSelector(
  [ _getSession ],
  (session) => {
    // count all keys that were clicked on that had the reinforcer
    // TODO, test correctCount
    const correctCount = session && session.get('trials')
      .reduce((acc, trial) => acc + trial
        .reduce((acc2, stage) => {
          return acc2 +
            (stage.get('clickedKey') === stage.get('reinforcerKey') ? 1 : 0)
        }, 0 /* acc2 */), 0 /* acc */) || 0
    // console.info('really getting session')
    return session && { ...session.toJS(), correctCount }
  }
)

export const selectors = {
  getSessionState,
  makeGetSession
}

/* sagas */
const sagaErrorHandler = (error) => {
  return {
    type: constants.ERROR,
    payload: new Error(error)
  }
}

const SAGA_UTIL = {
  arrayShuffle: (array) => {
    let currentIndex = array.length
    let temporaryValue
    let randomIndex

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      // And swap it with the current element.
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }

    return array
  }
}

const SAGA_HANDLERS = {
  [constants.KEY_CLICK]: {
    require: { payload: { sessionID: '', keyID: '' } },
    handler: function * (action) {
      const { sessionID, keyID } = action.payload
      const userSession = yield select(cognitoUsersSelectors.getSession)
      const sessionIDFull = userSession.identityID + ':' + sessionID

      sessionTrialInsert(sessionIDFull, 'hello world!')

      // *** TODO, cache this result somewhere?
      const getSession = selectors.makeGetSession()

      const session = yield select(getSession, { sessionID })

      yield put(actions.creators
        .log(sessionID, '-----------------------------------------------'))

      yield put(actions.creators
        .log(sessionID, `Key click ${keyID}`))

      yield put(actions.creators.sessionLock(sessionID))

      const { conditions, keys } =
        yield select(selectorsChoiceAs.getConditionsAndKeys)

      const condition = conditions[session.conditionID]

      const { keyStageID, trialCount } = session.cursor

      const keyStage = condition.keys[session.cursor.keyStageID]

      const keyStageFull = keyStage
        .reduce((acc, key) => ({
          ...acc,
          [key]: keys[key].probability
        }), {})

      yield put(actions.creators
        .log(sessionID, `Trial: ${trialCount + 1},
          Stage: ${keyStageID + 1}, Possible Keys: ${keyStage.join(', ')}`))

      /* reinforcer can be L* R* STAY_* or SWITCH_* */
      const reinforcer = utilChoiceAs.weightedRandomSelect(keyStageFull)

      /* loop nextStageID around to 0 if we go past the end of the array */
      const nextKeyStageID = (keyStageID + 1) % condition.keys.length
      let nextTrialCount = nextKeyStageID === 0
        ? trialCount + 1 : trialCount

      let previousKey = 'none'
      /* reinforcerKey will be L* or R* */
      let reinforcerKey
      if (reinforcer.startsWith('STAY_')) {
        /* previousKey from the same trial but the previous stage */
        previousKey = session.trials[trialCount][keyStageID - 1].reinforcerKey
        reinforcerKey = previousKey
      } else if (reinforcer.startsWith('SWITCH_')) {
        /* previousKey from the same trial but the previous stage */
        previousKey = session.trials[trialCount][keyStageID - 1].reinforcerKey
        // get the first of the previous stage's keys that doesn't match
        // the previous key
        reinforcerKey = condition.keys[session.cursor.keyStageID - 1]
          .filter((id) => id !== previousKey)[0]
      } else {
        reinforcerKey = reinforcer
      }

      yield put(actions.creators.log(sessionID,
        `Reinforcer Location: ${reinforcerKey}
          ${reinforcer !== reinforcerKey ? ' (' + reinforcer + ')' : ''}`))

      const cursor = { trialCount, keyStageID }
      const cursorNext = { trialCount: nextTrialCount, keyStageID: nextKeyStageID }
      const record = { clickedKey: keyID, reinforcerKey, reinforcer, previousKey }

      yield put(actions.creators.trialRecord(sessionID, cursor, record))
      yield put(actions.creators.trialReveal1(sessionID, cursor))

      const revealDelay = 1500
      yield call(delay, revealDelay)

      yield put(actions.creators.trialReveal2(sessionID, cursor))

      if (condition.iti && condition.iti !== 0) {
        yield put(actions.creators.log(sessionID,
          `ITI pause ${condition.iti} seconds`))

        yield call(delay, condition.iti * 1000 - revealDelay)

        yield put(actions.creators.log(sessionID,
          'ITI wake up'))
      }

      yield put(actions.creators.trialShiftCursor(sessionID, cursorNext))
    },
    errorHandler: sagaErrorHandler
  },
  [constants.START]: {
    handler: function * (action) {
      const { conditionID } = action.payload
      const sessionID = yield call(uuid)
      const userSession = yield select(cognitoUsersSelectors.getSession)
      const sessionIDFull = userSession.identityID + ':' + sessionID

      sessionTrialInit(sessionIDFull)

      const { conditions } =
        yield select(selectorsChoiceAs.getConditionsAndKeys)

      yield put(yield call(actions.creators.init, conditionID, sessionID))

      yield put(actions.creators.log(sessionID,
        `Initalised Condition ${conditionID}, Session ${sessionID}`))

      /* flatmap array of arrays then convert into a string */
      const keyString = conditions[conditionID].keys
        .reduce((acc, v) =>
          [...acc, ...v.reduce((acc2, v2) => [...acc2, v2], [])], [])
            .join(', ')

      yield put(actions.creators.log(sessionID, `Condition key sequence: ${keyString}`))

      /* absolute path required to stop not-found route */
      yield call(browserHistory.push, `/choiceas/${ROUTE_PATH}/${sessionID}`)
    },
    errorHandler: sagaErrorHandler
  }
}

const sagaMain = sagaUtil.makeSagaMain({ handlers: SAGA_HANDLERS })

export const sagas = {
  errorHandler: sagaErrorHandler,
  util: SAGA_UTIL,
  handlers: SAGA_HANDLERS,
  sagaMain
}
