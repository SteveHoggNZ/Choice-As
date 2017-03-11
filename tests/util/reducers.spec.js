import Immutable from 'immutable'
import { createReducer, createPaginationActionCreators } from 'util/reducers'

describe('(Reducer Util)', () => {
  describe('createReducer function', () => {
    it('should be a factory function', () => {
      expect(typeof createReducer).to.equal('function', 'is a function')
      expect(typeof createReducer()).to.equal('function',
        'invocation returns a function')
    })

    describe('reducer actions', () => {
      const _initialState = Immutable.fromJS({})
      let _testReducer
      const _testHandlers = { 'test-action': (state, action) => 'test successful' }
      const _testState = { test: true }

      beforeEach(() => {
        _testReducer = createReducer(_initialState, _testHandlers)
      })

      it('returns the inital state', () => {
        expect(_testReducer())
          .to.deep.equal(_initialState,
            'the inital state is set when no state is provided')
      })

      it('returns the current state when it gets an invalid action', () => {
        expect(_testReducer(_testState))
          .to.deep.equal(_testState, 'un-changed with no action')

        expect(_testReducer(_testState, 'invalid-action'))
          .to.deep.equal(_testState, 'un-changed state with invalid action')

        expect(_testReducer(_testState, { type: 'invalid-action' }))
          .to.deep.equal(_testState,
            'un-changed state with correct action shape but invalid type')
      })

      it('returns the correct state with a valid action', () => {
        expect(_testReducer(_testState, { type: 'test-action' }))
          .to.equal('test successful', 'reduced state is correct')
      })
    })
  })

  describe('createPaginationActionCreators fucntion', () => {
    it('should be a function', () => {
      expect(typeof createPaginationActionCreators)
        .to.equal('function', 'is a function')
    })
  })
})
