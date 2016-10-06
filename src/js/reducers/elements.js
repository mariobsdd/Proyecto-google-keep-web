import { todos } from './todos';
import { visibilityFilter } from './visibility';

const element = (state = {}, action) => {
  switch(action.type) {
    case 'ADD_TODO_LIST':
      return {
        ...action.payload,
        todolist: todos(undefined,action),
        isNote: false,
        visibilityFilter: visibilityFilter(undefined, action),
        create_date: new Date().toLocaleString(),
        archived: false
      };
    case 'ADD_NOTE':
      return {
        ...action.payload,
        isNote: true,
        create_date: new Date().toLocaleString(),
        archived: false
      };
    case 'ADD_TODO':
      if(state.id === action.payload.elementId){
        state.todolist= todos(state.todolist, action);
        state.modified_date = new Date().toLocaleString();
        state.update_date = new Date().toLocaleString();
        return { ...state };
      }
    case 'TOGGLE_TODO':
      if(state.id === action.payload.elementId){
        state.todolist= todos(state.todolist, action);
        state.modified_date = new Date().toLocaleString();
        state.update_date = new Date().toLocaleString();
        return { ...state };
      }
    case 'UPDATE_TITLE':
      if(state.id === action.payload.elementId){
        state.title= action.payload.text;
        state.update_date = new Date().toLocaleString();
        return { ...state };
      }
    case 'UPDATE_TODO':
      if(state.id === action.payload.elementId){
        state.todolist= todos(state.todolist, action);
        state.modified_date = new Date().toLocaleString();
        state.update_date = new Date().toLocaleString();
        return { ...state };
      }
    case 'CHANGE_COLOR':
      if(state.id === action.payload.elementId){
        state.color = action.payload.color;
        state.update_date = new Date().toLocaleString();
        return { ...state };
      }
    case 'UPDATE_NOTE':
      if(state.id === action.payload.elementId){
        state.text = action.payload.text;
        state.update_date = new Date().toLocaleString();
        return { ...state };
      }
    case 'ARCHIVE_ELEMENT':
      if(state.id === action.payload.elementId){
        state.archived = true;
        state.update_date = new Date().toLocaleString();
        return { ...state };
      }
    case 'REMOVE_TODO':
      if(state.id === action.payload.elementId){
        state.todolist= todos(state.todolist, action);
        state.update_date = new Date().toLocaleString();
        return { ...state };
      }
    case 'SET_VISIBILITY_FILTER':
      if(state.id === action.payload.elementId){
        state.visibilityFilter= visibilityFilter(undefined, action);
        state.update_date = new Date().toLocaleString();
        return { ...state };
      }
    default:
      return state;
  }
}

const elements = (state = [], action) => {
  switch (action.type){
    case 'ADD_TODO_LIST':
      return [
        element(undefined, action),
        ...state      
      ];

    case 'ADD_NOTE':
      if ( action.payload.text !== "" ){
        return [
          element(undefined, action),
          ...state     
        ];
      }
      return state;

    case 'ADD_TODO':
      return state.map(e => element(e, action)); 
    case 'TOGGLE_TODO':
      return state.map(e => element(e, action));
    case 'UPDATE_TITLE':
      return state.map(e => element(e, action));
    case 'UPDATE_TODO':
      return state.map(e => element(e, action));
    case 'CHANGE_COLOR':
      return state.map(e => element(e, action));
    case 'UPDATE_NOTE':
      return state.map(e => element(e, action));
    case 'ARCHIVE_ELEMENT':
      return state.map(e => element(e, action));    
    case 'REMOVE_TODO':
      return state.map(e => element(e, action));
    case 'SET_VISIBILITY_FILTER':
      return state.map(e => element(e, action));
    default:
      return state;
  }
}

export { elements };