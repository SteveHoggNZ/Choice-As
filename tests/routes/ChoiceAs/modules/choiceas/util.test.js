import { util } from 'routes/ChoiceAs/modules/choiceas'

describe('weightedRandomSelect', () => {
  it('Should be exported as a function.', () => {
    expect(util.weightedRandomSelect).to.be.a('function')
  })

  it('Throws an error if no values are supplied.', () => {
    expect(() => util.weightedRandomSelect())
      .to.throw(Error, 'Expected value in the form')
    expect(() => util.weightedRandomSelect([]))
        .to.throw(Error, 'Expected non-empty object')
    expect(() => util.weightedRandomSelect({}))
        .to.throw(Error, 'Expected non-empty object')
  })

  it('Throws an error if any of the weights are not decimals.', () => {
    expect(() => util.weightedRandomSelect({ key1: 'a' }))
      .to.throw(Error, 'Expected all weights to be numbers')
    expect(() => util.weightedRandomSelect({ key1: 0.3, key2: [] }))
      .to.throw(Error, 'Expected all weights to be numbers')
  })

  it('Throws an error if the weights do not sum to 1.', () => {
    const sumError = 'Expected the weights for all keys to sum to 1'
    const expectPrefix = 'Expect no exception when weights sum to'
    expect(() => util.weightedRandomSelect({ key1: 0.2 }))
      .to.throw(Error, sumError, `${expectPrefix} 0.2`)

    expect(() => util.weightedRandomSelect({ key1: 0.2, key2: 0.1, key3: 0.3 }))
      .to.throw(Error, sumError, `${expectPrefix} 0.6`)

    expect(() => util.weightedRandomSelect({ key1: 0.4, key2: 0.5, key3: 0.2 }))
      .to.throw(Error, sumError, `${expectPrefix} 1.1`)

    expect(() => util.weightedRandomSelect({ key1: 0.1, key2: 0.9 }))
      .to.not.throw(Error, sumError, 'Expect no exception with weight sum = 1')
  })

  describe('Selection Distribution', () => {
    const confirmSelectWeights = ({
      spec,
      loopCount,
      errorMargin
    }) => {
      let testCounts = Object.keys(spec)
        .reduce((acc, key) => {
          return {
            ...acc,
            [key]: 0
          }
        }, {})

      for (let i = 0; i < loopCount; i++) {
        testCounts[util.weightedRandomSelect(spec)]++
      }

      for (let key of Object.keys(spec)) {
        const weight = spec[key]
        const weightActual = testCounts[key] / loopCount
        const weightDiff = Math.abs(weight - weightActual)
        // console.log('key', key, 'expected', weight,
        //   'actual', weightActual, 'diff', weightDiff)
        expect(weightDiff <= errorMargin).is.equal(
          true,
          `Should have a weight ${weight} +- ${errorMargin} ` +
          `but got ${weightActual} with a diff ${weightDiff}`)
      }
    }

    const errorMargin = 0.002
    const loopCount = 500000

    it(`Should distribute 0.5 and 0.5 equally +- ${errorMargin} for ` +
      `${loopCount} selections.`,
      () => {
        confirmSelectWeights({
          spec: { key1: 0.5, key2: 0.5 },
          loopCount,
          errorMargin
        })
      })

    it(`Should distribute 0.1 and 0.9 properly +- ${errorMargin} for ` +
      `${loopCount} selections.`,
      () => {
        confirmSelectWeights({
          spec: { key1: 0.1, key2: 0.9 },
          loopCount,
          errorMargin
        })
      })

    it(`Should distribute 0.9 and 0.1 properly +- ${errorMargin} for ` +
      `${loopCount} selections.`,
      () => {
        confirmSelectWeights({
          spec: { key1: 0.9, key2: 0.1 },
          loopCount,
          errorMargin
        })
      })

    it(`Should distribute 0.2, 0.4, 0.1, 0.3 properly +- ${errorMargin} for ` +
      `${loopCount} selections.`,
      () => {
        confirmSelectWeights({
          spec: { key1: 0.2, key2: 0.4, key3: 0.1, key4: 0.3 },
          loopCount,
          errorMargin
        })
      })
  })
})
