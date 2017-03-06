import { injectReducer } from 'store/reducers'
import { startSaga } from 'store/sagas'

export default (store) => ({
  path: 'test',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Test = require('./containers/TestContainer').default
      const { reducer, sagas } = require('./modules/test')

      /*  Add the reducer to the store on key 'choiceas'  */
      injectReducer(store, { key: 'test', reducer })

      /*  Start running the Saga  */
      startSaga(store, { key: 'test', saga: sagas.sagaMain })

      /*  Return getComponent   */
      cb(null, Test)
    /* Webpack named bundle   */
    }, 'choiceas-test')
  }
})
