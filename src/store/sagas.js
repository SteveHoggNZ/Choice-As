export const startSaga = (store, { key, saga }) => {
  if (!store.runningSagas[key]) {
    store.runningSagas[key] = store.sagaMiddleware.run(saga)
  }
}
