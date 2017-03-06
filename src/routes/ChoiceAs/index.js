import { injectReducer } from '../../store/reducers'
import { startSaga } from '../../store/sagas'
import childRoutes from './routes'

export default (store) => ({
  path: 'choiceas',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const ChoiceAs = require('./containers/ChoiceAsContainer').default
      const { reducer, sagamain } = require('./modules/choiceas')

      /*  Add the reducer to the store on key 'choiceas'  */
      injectReducer(store, { key: 'choiceas', reducer })

      /*  Start running the Saga  */
      startSaga(store, { key: 'choiceas', saga: sagamain })

      /*  Return getComponent   */
      cb(null, ChoiceAs)
    /* Webpack named bundle   */
    }, 'choiceas')
  },
  childRoutes: childRoutes(store)
})
