export const setFilters = filters => ({
  type: 'SET_FILTERS',
  payload: filters
})

export const resetFilters = () => ({
  type: 'RESET_FILTERS'
})