const importTest = (name, path) => {
  describe(name, () => {
    // use evaluated string to stop the webpack warning
    // 'the request of a dependency is an expression'
    require(`${path}`)
  })
}

describe('(Redux Module) ChoiceAs', () => {
  importTest('(Util)', './util.test.js')
  importTest('(Constants)', './constants.test.js')
  importTest('(Actions)', './actions.test.js')
  importTest('(Reducer)', './reducer.test.js')
  importTest('(Sagas)', './sagas.test.js')
})
