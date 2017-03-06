import { injectReducer } from 'store/reducers'
import { startSaga } from 'store/sagas'

export default (store) => ({
  path: 'session',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Session = require('./containers/SessionContainer').default
      const { reducer, sagas } = require('./modules/session')

      /*  Add the reducer to the store on key 'choiceas'  */
      injectReducer(store, { key: 'session', reducer })

      /*  Start running the Saga  */
      startSaga(store, { key: 'session', saga: sagas.sagaMain })

      /*  Return getComponent   */
      cb(null, Session)
    /* Webpack named bundle   */
    }, 'choiceas-session')
  },
  childRoutes: [ { path: '*' } ]
})
