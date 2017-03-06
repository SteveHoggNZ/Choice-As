import * as constants from './constants'

export const testRun = (iterations) => {
  return {
    type: constants.TEST_RUN,
    payload: iterations
  }
}

export const keyClick = (keyID) => {
  return {
    type: constants.KEY_CLICK,
    payload: keyID
  }
}
