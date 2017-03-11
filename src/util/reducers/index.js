/* generic reducer that applies handers to state or returns it un-changed */

export const createReducer = (initialState, handlers) =>
  (state = initialState, action) => {
    const type = action && action.type || ''
    const handler = handlers[type]
    return handler ? handler(state, action) : state
  }

export const createPaginationActionCreators = () => {

}
