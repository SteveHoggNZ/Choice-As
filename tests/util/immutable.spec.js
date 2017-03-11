import immutable, { OrderedSet } from 'immutable'
import * as immutableUtil from 'util/immutable'

describe('(Util) Immutable', () => {
  it('should export a toMapWithOrderedSets function', () => {
    expect(typeof immutableUtil.toMapWithOrderedSets)
      .to.equal('function', 'is a function')
  })

  it('should convert object literals to Maps and arrays to OrderSets', () => {
    const testMap = immutable.fromJS(
      { one: 1, two: [4, 7, 3] },
      immutableUtil.toMapWithOrderedSets)
    expect(OrderedSet.isOrderedSet(testMap.get('two')))
      .to.equal(true, 'array coverts to an OrderedSet')
  })
})
