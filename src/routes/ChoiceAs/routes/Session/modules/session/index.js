import Immutable from 'immutable'
import { createSelector } from 'reselect'
import uuid from 'uuid-v4'
import { call, put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import sagaUtil from 'util/sagas'
import {
  actions as cognitoUserActions,
  selectors as cognitoUsersSelectors
} from 'modules/cognito-users'
import {
  selectors as selectorsChoiceAs,
  util as utilChoiceAs
} from '../../../../modules/choiceas'

import {
  sessionTrialInit,
  sessionTrialClose,
  sessionTrialInsert
} from 'api/dynamodb'

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
const start = () => {
  return {
    type: constants.START
  }
}

const init = (conditionOrder, conditionID, sessionID, startTime) => {
  return {
    type: constants.INIT,
    payload: {
      conditionOrder,
      conditionID,
      sessionID,
      startTime
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

const stop = (sessionID) => {
  return {
    type: constants.STOP,
    payload: {
      sessionID
    }
  }
}

const log = (sessionID, msg) => {
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
    const sessionState = {
      startTime: action.payload.startTime,
      locked: false,
      finished: false,
      cursor: {
        conditionID: action.payload.conditionID,
        trialCount: 0,
        keyStageID: 0
      },
      trials: [],
      log: []
    }

    return state
      .set('currentSession', action.payload.sessionID)
      .set(action.payload.sessionID, Immutable.fromJS(sessionState))
  },
  [constants.STOP]: (state, action) => {
    const { sessionID } = action.payload
    return state.setIn([sessionID, 'finished'], true)
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
export const initialState = Immutable.fromJS({
  currentSession: ''
})
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
  return state[constants.STATE_PATH]
}

const getSessionState = createSelector(
  _getSessionState,
  (_result) => _result.toJS()
)

const getCurrentSessionID = createSelector(
  _getSessionState,
  (_result) => _result.get('currentSession')
)

const getSession = createSelector(
  _getSessionState,
  getCurrentSessionID,
  (sessionState, currentSessionID) => {
    // get the session values for items in the currentSession key position
    const currentSession = sessionState.get(currentSessionID)
    return currentSession && currentSession.toJS() || {}
  }
)

const getCorrectCount = createSelector(
  getSession,
  (session) => {
    return session && session.trials && session.trials
      .reduce((acc, trial) => acc + trial
        .reduce((acc2, stage) => {
          return acc2 +
            (stage.clickedKey === stage.reinforcerKey ? 1 : 0)
        }, 0 /* acc2 */), 0 /* acc */) || 0
  }
)

export const selectors = {
  getSessionState,
  getCurrentSessionID,
  getSession,
  getCorrectCount
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

      const clickData = {
        'key': keyID
      }

      const session = yield select(selectors.getSession)

      clickData.conditionID = session.cursor.conditionID
      clickData.clickTime = Date.now() - session.startTime

      yield put(actions.creators
        .log(sessionID, '-----------------------------------------------'))

      yield put(actions.creators
        .log(sessionID, `Key click ${keyID}`))

      yield put(actions.creators.sessionLock(sessionID))

      const { order: conditionOrder, conditions, keys } =
        yield select(selectorsChoiceAs.getSession)

      const { conditionID, keyStageID, trialCount } = session.cursor

      const condition = conditions[conditionID]

      const keyStage = condition.keys[session.cursor.keyStageID]

      const keyStageFull = keyStage
        .reduce((acc, key) => ({
          ...acc,
          [key]: keys[key].probability
        }), {})

      clickData.info = `Condition: ${conditionID}, Trial: ${trialCount + 1}, ` +
        `Stage: ${keyStageID + 1}, Possible Keys: ${keyStage.join(', ')}, ` +
        `ITI: ${condition.iti} seconds`

      yield put(actions.creators.log(sessionID, clickData.info))

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

      clickData.reinforcer = reinforcerKey

      yield put(actions.creators.log(sessionID,
        `Reinforcer Location: ${reinforcerKey}
          ${reinforcer !== reinforcerKey ? ' (' + reinforcer + ')' : ''}`))

      const cursor = { conditionID, trialCount, keyStageID }

      const record = { conditionID, clickedKey: keyID, reinforcerKey, reinforcer, previousKey }
      yield put(actions.creators.trialRecord(sessionID, cursor, record))

      // work out the sum of the trials for the current condition and all the
      // conditions that proceeded it
      const sumTrialCount = conditionOrder
        .slice(0, conditionOrder.indexOf(conditionID) + 1)
        .reduce((sum, cID) => sum + conditions[cID].trials, 0)

      let cursorNext
      let sessionEnd = false
      if (nextTrialCount >= sumTrialCount) {
        // we need to move to the next condition
        if (conditionOrder[conditionOrder.length - 1] === conditionID) {
          // we're on the last condition, so end the session
          sessionEnd = true
        } else {
          // change to the next condition
          const conditionNext = conditionOrder[conditionOrder.indexOf(conditionID) + 1]
          cursorNext = { conditionID: conditionNext, trialCount: nextTrialCount, keyStageID: nextKeyStageID }
        }
      } else {
        // change to the next trial and stage
        cursorNext = { conditionID, trialCount: nextTrialCount, keyStageID: nextKeyStageID }
      }

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

      yield call(sessionTrialInsert, sessionIDFull, session.startTime, clickData)

      if (sessionEnd) {
        yield call(sessionTrialClose, sessionIDFull, session.startTime)
        yield put(yield call(actions.creators.stop, sessionID))
      } else {
        yield put(actions.creators.trialShiftCursor(sessionID, cursorNext))
      }
    },
    errorHandler: sagaErrorHandler
  },
  [constants.START]: {
    handler: function * (action) {
      // TO DO: if there is a delay between login and starting the trial
      // the user login session may have expired. cognitoSessionCheck below
      // will fix this, but only after its corresponding cognitoSessionSet
      // finishes. There is a race condition between the set and the
      // sessionTrialInit call below; if the sessionTrialInit runs before the
      // set then DynamoDB writes will get a permission denied.
      // If this is a problem in the future then getting sessionTrialInit to wait
      // on cognitoSessionSet is a potential fix.
      yield put(yield call(cognitoUserActions.creators.cognitoSessionCheck))

      const sessionID = yield call(uuid)
      const userSession = yield select(cognitoUsersSelectors.getSession)

      const sessionIDFull = userSession.identityID + ':' + sessionID

      const { name: projectName, order: conditionOrder, conditions } =
        yield select(selectorsChoiceAs.getSession)

      const startTime = Date.now()

      // initialise the session with the first condition in the list
      const conditionID = conditionOrder[0]

      yield call(sessionTrialInit, sessionIDFull,
        startTime, projectName, conditionOrder, conditions, userSession.studentID)

      yield put(yield call(actions.creators.init,
        conditionOrder, conditionID, sessionID, startTime))

      yield put(actions.creators.log(sessionID,
        `Initalised Condition ${conditionID}, Session ${sessionID}`))

      /* flatmap array of arrays then convert into a string */
      const keyString = conditions[conditionID].keys
        .reduce((acc, v) =>
          [...acc, ...v.reduce((acc2, v2) => [...acc2, v2], [])], [])
            .join(', ')

      yield put(actions.creators.log(sessionID, `Condition key sequence: ${keyString}`))
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
