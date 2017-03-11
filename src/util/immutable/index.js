import { Iterable } from 'immutable'

export const toMapWithOrderedSets = (key, value) =>
      Iterable.isIndexed(value) ? value.toOrderedSet() : value.toMap()
