import * as storeSaga from 'store/sagas'
import { sagas as cognitoSagas } from 'modules/cognito-users'

describe('(Store) Sagas', () => {
  it('should export a startSaga function', () => {
    expect(typeof storeSaga.startSaga).to.equal('function', 'is a function')
  })

  it('should export a syncSagas object', () => {
    expect(typeof storeSaga.syncSagas)
      .to.equal('object', 'is an object')
    expect(storeSaga.syncSagas)
      .to.deep.equal({
        'cognito-users': cognitoSagas.main
      }, 'expected sync sagas are set')
  })

  it('should run the saga when the key is not present', () => {
    const store = {
      runningSagas: {},
      sagaMiddleware: { run: (cb) => cb() }
    }
    const options = { key: 'testkey', saga: sinon.stub().returns(true) }
    storeSaga.startSaga(store, options)

    expect(options.saga.called).to.equal(true, 'saga called')
  })

  it('should NOT run the saga when the key is present', () => {
    const store = {
      runningSagas: { testkey: 'I am a running saga' },
      sagaMiddleware: { run: (cb) => cb() }
    }
    const options = { key: 'testkey', saga: sinon.stub().returns(true) }
    storeSaga.startSaga(store, options)

    expect(options.saga.called).to.equal(false, 'saga not called')
  })
})
