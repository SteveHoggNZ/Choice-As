import Immutable from 'immutable'
import { createSelector } from 'reselect'
import { call, put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import sagaUtil from 'util/sagas'
import {
  selectors as selectorsChoiceAs,
  util as utilChoiceAs
} from '../../../../modules/choiceas'

/* constants */
const STATE_PATH = 'test'

const PREFIX = 'choiceas/test/'

const ERROR = `${PREFIX}ERROR`

const RUN_REQUEST = `${PREFIX}RUN_REQUEST`
const RUN_START = `${PREFIX}RUN_START`
const RUN_RETURN = `${PREFIX}RUN_STOP`

export const constants = {
  STATE_PATH, PREFIX, ERROR, RUN_REQUEST, RUN_START, RUN_RETURN
}

/* actions */
/* - action creators */
const runRequest = (iterations: number) => {
  return {
    type: constants.RUN_REQUEST,
    payload: iterations
  }
}

const runStart = () => {
  return {
    type: constants.RUN_START
  }
}

const runReturn = (counts) => {
  return {
    type: constants.RUN_RETURN,
    payload: counts
  }
}

const ACTION_CREATORS = {
  runRequest,
  runStart,
  runReturn
}

/* - action handlers */
const ACTION_HANDLERS = {
  [constants.RUN_REQUEST]: (state, action) =>
    state.set('iterations', action.payload),
  [constants.RUN_START]: (state, action) =>
    state.set('running', true),
  [constants.RUN_RETURN]: (state, action) =>
    state.withMutations(
      (s) => s.set('running', false)
        .set('counts', Immutable.fromJS(action.payload)))
}

export const actions = {
  creators: ACTION_CREATORS,
  handlers: ACTION_HANDLERS
}

/* reducer */
export const initialState = Immutable.fromJS({
  running: false,
  lastrun: undefined,
  iterations: 100,
  counts: {}
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
const _getTestResults = (state) => {
  return state[constants.STATE_PATH]
}

const getTestResults = createSelector(
  _getTestResults,
  (_result) => _result.toJS()
)

export const selectors = {
  getTestResults
}

/* sagas */
const sagaErrorHandler = (error) => {
  return {
    type: constants.ERROR,
    payload: new Error(error)
  }
}

const SAGA_UTIL = {}

const SAGA_HANDLERS = {
  [constants.RUN_REQUEST]: {
    handler: function * (action) {
      yield put(yield call(actions.creators.runStart))

      /*
        yield a delay to allow state change to propagate
        i.e. running the jobs is a busy wait that causes new state
        to be not picked-up on.
      */
      yield call(delay, 1)

      const { conditions, keys } =
        yield select(selectorsChoiceAs.getConditionsAndKeys)

      const iterations = action.payload || 1000

      /* create an object that has a counter for each key stage and key */
      let testCounts = Object.keys(conditions)
        .reduce((acc, conditionID) => {
          return {
            ...acc,
            [conditionID]: conditions[conditionID].keys
              .map((stages) => stages.reduce((acc, keyID) => (
                { ...acc, [keyID]: 0 }
              ), {}))
          }
        }, {})

      for (let conditionID of Object.keys(conditions)) {
        const condition = conditions[conditionID]

        /* stages, successive sets of keys, are limited to 2 */
        let [ keyStage1, keyStage2 ] = condition.keys

        for (let i = 0; i < iterations; i++) {
          const job1 = keyStage1.reduce((acc, keyID) => ({
            ...acc,
            [keyID]: keys[keyID].probability
          }), {})

          const result1 = utilChoiceAs.weightedRandomSelect(job1)
          testCounts[conditionID][0][result1]++

          const job2 = keyStage2.reduce((acc, keyID) => ({
            ...acc,
            [keyID]: keys[keyID].probability
          }), {})

          const result2 = utilChoiceAs.weightedRandomSelect(job2)
          testCounts[conditionID][1][result2]++
        }
      }

      yield put(yield call(actions.creators.runReturn, testCounts))
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

export default reducer
