import SessionRoute from './Session'
import TestRoute from './Test'

/* export child routes */
export default (store) => [
  { path: 'debug' },
  SessionRoute(store),
  TestRoute(store)
]
