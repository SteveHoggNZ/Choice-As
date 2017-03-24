// import { takeEvery, call, put, fork, select } from 'redux-saga/effects'
import { select } from 'redux-saga/effects'
import * as constants from './constants'
// import * as actions from './actions'
import * as selectors from './selectors'
import sagaUtil from 'util/sagas'

// export const checkRequire = (require, action, actionpath = []) => {
//   const formatpath = (p1, p2) => p1.length === 0 ? p2 : `${p1.join('.')}.${p2}`
//   for (let key of Object.keys(require)) {
//     if (!action[key]) {
//       throw new Error(`expected action.${formatpath(actionpath, key)} to exist`)
//     }
//
//     if (require[key] instanceof RegExp && !action[key].match(require[key])) {
//       throw new Error(`expected action.${formatpath(actionpath, key)} ` +
//         `to match ${require[key].toString()}`)
//     } else if (typeof require[key] === 'object') {
//       checkRequire(require[key], action[key], [...actionpath, key])
//     }
//   }
// }
//
// export const wrapHandler = ({
//   handler, errorHandler, require, checker = checkRequire
// }) =>
//   function * wrappedHandler (action) {
//     try {
//       if (require) {
//         checker(require, action)
//       }
//
//       yield * handler(action)
//     } catch (error) {
//       console.error('got wrapped error', error)
//       yield put(errorHandler(error.toString()))
//     }
//   }

export const errorHandler = (error) => {
  return {
    type: constants.ERROR,
    payload: new Error(error)
  }
}

export const handlers = {
  [constants.TEST_RUN]: {
    // require: {payload: {steve: ''}},
    handler: function * (action) {
      const { conditions, keys } = yield select(selectors.getSession)
      console.log('called test_run')
      console.log(conditions, keys)

      // yield call(console.log, ['Got state', conditions, keys])
      yield 22
      // yield call(console.log, 'running handler')
    },
    errorHandler
  }
}

const sagaMain = sagaUtil.makeSagaMain({ handlers })

export default sagaMain

// export default function * ({hldrs = handlers, wrapper = wrapHandler} = {}) {
//   // fork a monitor for each defined handler
//   const makeMonitor = (name) =>
//     function * () {
//       yield takeEvery(name, wrapper({...hldrs[name]}))
//     }
//
//   const forks = Object.keys(hldrs)
//     .map((name) => fork(makeMonitor(name)))
//
//   yield forks
// }
