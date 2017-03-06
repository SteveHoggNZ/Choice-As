import { takeEvery, fork, put } from 'redux-saga/effects'

const checkRequire = (require, action, actionpath = []) => {
  const formatpath = (p1, p2) => p1.length === 0 ? p2 : `${p1.join('.')}.${p2}`
  for (let key of Object.keys(require)) {
    if (!action[key]) {
      throw new Error(`expected action.${formatpath(actionpath, key)} to exist`)
    }

    if (require[key] instanceof RegExp && !action[key].match(require[key])) {
      throw new Error(`expected action.${formatpath(actionpath, key)} ` +
        `to match ${require[key].toString()}`)
    } else if (typeof require[key] === 'object') {
      checkRequire(require[key], action[key], [...actionpath, key])
    }
  }
}

const wrapHandler = ({
  handler, errorHandler, require, checker = checkRequire
}) =>
  function * wrappedHandler (action) {
    try {
      if (require) {
        checker(require, action)
      }

      yield * handler(action)
    } catch (error) {
      console.error('got wrapped error', error)
      yield put(errorHandler(error.toString()))
    }
  }

const makeSagaMain = ({ handlers }) =>
  function * sagaMain ({ wrapper = wrapHandler } = {}) {
    // fork a monitor for each defined handler
    const makeMonitor = (name) => {
      return function * () {
        yield takeEvery(name, wrapper({ ...handlers[name] }))
      }
    }

    const forks = Object.keys(handlers)
      .map((name) => fork(makeMonitor(name)))

    yield forks
  }

export default {
  checkRequire,
  wrapHandler,
  makeSagaMain
}
