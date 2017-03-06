import * as constantsDirect from 'routes/ChoiceAs/modules/choiceas/constants'
import { constants } from 'routes/ChoiceAs/modules/choiceas'

const util = {
  hasConst: (name) => {
    expect(constants[name]).to.not.equal(undefined, `constants.${name} exists`)
    expect(constants[name].indexOf(constants.PREFIX))
      .to.equal(0, `${constants[name]} starts with ${constants.PREFIX}`)
  }
}

it('Should export the constants from the constants file', () => {
  expect(constants).to.deep.equal(constantsDirect, 'objects are equal')
})

it('Should export a PREFIX constant', () => {
  expect(constants.PREFIX).to.not.equal(undefined)
})

it('Should export required constants', () => {
  util.hasConst('CONDITION_START')
  util.hasConst('CONDITION_END')
  util.hasConst('TRIAL_START')
  util.hasConst('TRIAL_END')
  util.hasConst('KEY_CLICK')
})
