const constExistsIn = ({ name, constants, prefix, value }) => {
  const constant = constants[name]
  const expectation = `${name} is defined`
  const actual = `(actual value '${constant}')`

  expect(constant).to.not.equal(undefined, expectation + ' ' + actual)

  if (value !== undefined) {
    expect(constant === value).to.equal(true,
      `${expectation} and equals ${value} ${actual}`)
  } else if (prefix !== undefined) {
    expect(constant.startsWith(prefix)).to.equal(true,
      `${expectation} and starts with ${prefix} ${actual}`)
  }
}

const allConstExistIn = ({ list, ...other }) => {
  for (let name of list) {
    constExistsIn({ name, ...other })
  }
}

export default {
  constExistsIn,
  allConstExistIn
}
