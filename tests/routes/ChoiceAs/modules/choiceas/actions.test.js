import * as actionsDirect from 'routes/ChoiceAs/modules/choiceas/actions'
import {
  constants,
  actions
} from 'routes/ChoiceAs/modules/choiceas'

it('Should export the actions from the actions file', () => {
  expect(actions).to.deep.equal(actionsDirect, 'objects are equal')
})

describe('(Action Creator) testRun', () => {
  it('Should be exported as a function.', () => {
    expect(actions.testRun).to.be.a('function')
  })
  it('Should return an action with type "TEST_RUN".', () => {
    const action = actions.testRun()
    expect(action).to.have.property('type', constants.TEST_RUN)
    expect(action.type).to.not.equal(undefined, 'action type has a value')
  })
  it('Should assign the first argument to the "payload" property.', () => {
    expect(actions.testRun(5)).to.have.property('payload', 5)
  })
})

describe('(Action Creator) keyClick', () => {
  it('Should be exported as a function.', () => {
    expect(actions.keyClick).to.be.a('function')
  })
  it('Should return an action with type "KEY_CLICK".', () => {
    const action = actions.keyClick()
    expect(action).to.have.property('type', constants.KEY_CLICK)
    expect(action.type).to.not.equal(undefined, 'action type has a value')
  })
  it('Should assign the first argument to the "payload" property.', () => {
    expect(actions.keyClick(5)).to.have.property('payload', 5)
  })
})
