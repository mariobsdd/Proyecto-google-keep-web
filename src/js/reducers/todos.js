const todo = (state = {}, action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return {
        ...action.payload,
        completed: false
      };
    case 'TOGGLE_TODO':
      if(state.id === action.payload.id){
        return {
          ...state,
          completed: !state.completed
        };
      }
    case 'UPDATE_TODO':
      if(state.id === action.payload.id){
        return {
          ...state,
          text: action.payload.text
        };
      }
    default:
      return state;
  }
}

const todos = (state = [], action) => {
  switch (action.type){
    case 'ADD_TODO':
      if ( action.payload.text !== ""){
        return [
          todo(undefined, action),
          ...state
        ];
      }
      return state;
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    case 'REMOVE_TODO':
      return state.filter( t => t.id != action.payload.id);
    case 'UPDATE_TODO':
      return state.map( t => todo(t,action));
    default:
      return state;
  }
}

export { todos };