const configurations = (
  state = {
    colors: ["white", "#FA8072","#FF8C00","#FFFF00","#A9A9A9","#6495ED","#40E0D0","#ADFF2F"],
    search: ""}, action) => {
  switch (action.type){
    case 'SEARCH_ELEMENT':
      state.search = action.payload.text.toUpperCase();
      return state;
    default:
      return state;
    
  }
}

export { configurations };