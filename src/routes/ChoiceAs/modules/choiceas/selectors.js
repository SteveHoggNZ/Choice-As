import { createSelector } from 'reselect'
import { STATE_PATH } from './constants'

const _getConditions = (state) =>
  state[STATE_PATH].getIn(['entities', 'conditions'])

const _getKeys = (state) =>
  state[STATE_PATH].getIn(['entities', 'keys'])

export const getConditionsAndKeys = createSelector(
  _getConditions,
  _getKeys,
  (_conditions, _keys) => {
    const conditions = _conditions.toJS()
    const keys = _keys.toJS()
    return {
      conditions,
      keys
    }
  })

// const _getTestResult = (state) =>
//   state.getIn([STATE_PATH, 'test'])
//
// export const getTestResult = createSelector(
//   _getTestResult,
//   (_test) => {
//     const test = _test.toJS()
//     return { test }
//   }
// )
