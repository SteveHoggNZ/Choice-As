const MAX_DEPTH = 20
const DEPTH = 10

const VALUE_DIFF_PREFIX = 'diff-'
const VALUE_CREATED = VALUE_DIFF_PREFIX + 'created'
const VALUE_UPDATED = VALUE_DIFF_PREFIX + 'updated'
const VALUE_DELETED = VALUE_DIFF_PREFIX + 'deleted'
const VALUE_UNCHANGED = VALUE_DIFF_PREFIX + 'unchanged'

export const expandedLog = (item) => {
  const depth = DEPTH

  if (depth > MAX_DEPTH || typeof item === 'string') {
    console.log(item)
    return
  }

  for (let key in item) {
    let itemType = typeof item[key]

    if (itemType === 'object') {
      itemType = Array.isArray(item[key]) ? 'array' : itemType
      console.group(key + ' : ' + itemType)
      expandedLog(item[key], depth + 1)
      console.groupEnd()
    } else if (itemType === 'function') {
      console.log(key + ': ' + item[key].name + '()')
    } else {
      if (
        key === 'type' &&
        item[key].indexOf(VALUE_DIFF_PREFIX) === 0 &&
        item[key] !== VALUE_UNCHANGED
      ) {
        console.warn(key + ': ' + item[key])
      } else {
        console.log(key + ': ' + item[key])
      }
    }
  }
}

const isFunction = (obj) => {
  return {}.toString.apply(obj) === '[object Function]'
}

const isArray = (obj) => {
  return {}.toString.apply(obj) === '[object Array]'
}

const isObject = (obj) => {
  return {}.toString.apply(obj) === '[object Object]'
}

const isValue = (obj) => {
  return !isObject(obj) && !isArray(obj)
}

const compareValues = (value1, value2) => {
  if (value1 === value2) {
    return VALUE_UNCHANGED
  }
  if (typeof value1 === 'undefined') {
    return VALUE_CREATED
  }
  if (typeof value2 === 'undefined') {
    return VALUE_DELETED
  }

  return VALUE_UPDATED
}

export const deepDiffMapper = (obj1, obj2) => {
  if (isFunction(obj1) || isFunction(obj2)) {
    throw Error('Invalid argument. Function given, object expected.')
  }
  if (isValue(obj1) || isValue(obj2)) {
    return {type: compareValues(obj1, obj2), data: obj1 || obj2}
  }

  let diff = {}
  let key
  for (key in obj1) {
    if (isFunction(obj1[key])) {
      continue
    }

    let value2
    if (typeof obj2[key] !== 'undefined') {
      value2 = obj2[key]
    }

    diff[key] = deepDiffMapper(obj1[key], value2)
  }
  for (key in obj2) {
    if (isFunction(obj2[key]) || (typeof diff[key] !== 'undefined')) {
      continue
    }

    diff[key] = deepDiffMapper(undefined, obj2[key])
  }

  return diff
}
