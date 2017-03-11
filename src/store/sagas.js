import { sagas as cognitoSagas } from 'modules/cognito-users'

export const startSaga = (store, { key, saga }) => {
  if (!store.runningSagas[key]) {
    store.runningSagas[key] = store.sagaMiddleware.run(saga)
  }
}

/* sync sagas = ones that run from the first page load rather than async */
export const syncSagas = {
  'cognito-users': cognitoSagas.main
}

export const syncSagasStart = (store) => {
  for (const key of Object.keys(syncSagas)) {
    startSaga(store, { key, saga: syncSagas[key] })
  }
}
