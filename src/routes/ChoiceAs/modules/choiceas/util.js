// Reference:
// http://stackoverflow.com/questions/8435183/generate-a-weighted-random-number
export const weightedRandomSelect = (spec: { [key: string]: number }) => {
  if (spec === undefined) {
    throw new Error('Expected value in the form {key: weight, ...}')
  } else if (typeof spec !== 'object' || Object.keys(spec).length === 0) {
    throw new Error('Expected non-empty object as the first argument')
  }

  let returnVal
  let sum = 0
  const r = Math.random()

  for (let key of Object.keys(spec)) {
    const weight = parseFloat(spec[key])
    if (isNaN(weight)) {
      throw new Error('Expected all weights to be numbers but ' +
        `${key} was set to "${spec[key]}"`)
    }
    sum += weight
    if (returnVal === undefined && r <= sum) {
      // we don't break the loop here as we want to verify the sum value below
      returnVal = key
    }
  }

  if (sum !== 1) {
    throw new Error('Expected the weights for all keys ' +
      'to sum to 1 instead of ' + sum)
  }

  if (returnVal === undefined) {
    throw new Error('Expected a return value to return but it is undefined')
  }

  return returnVal
}
