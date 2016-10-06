const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch(action.type){
    case 'SET_VISIBILITY_FILTER':
      return action.payload.visibilityFilter;
    default:
      return state;
  }
}

const visibilityFilterElements = (state = 'SHOW_ALL_ELEMENTS', action) => {
  switch(action.type){
    case 'SET_VISIBILITY_FILTER_ELEMENTS':
      return action.payload.visibilityFilter;
    default:
      return state;
  }
}

export { visibilityFilter, visibilityFilterElements };