//Mario Barrientos - 13039
//Falta hacer separacion de modulos
import { createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import deepFreeze from 'deep-freeze';
import expect from 'expect';
import v4 from 'uuid-v4';
import '../styles/style.scss';
import { todos } from './reducers/todos';
import { elements } from './reducers/elements';
import { visibilityFilterElements } from './reducers/visibility';
import { configurations } from './reducers/configurations';

const { Component } = React;
const todoApp = combineReducers({
  elements,
  visibilityFilterElements,
  configurations
});

const loadState = () => {
  try{
    let result = JSON.parse(localStorage.getItem('state'));
    return result ? result : undefined;
  }
  catch(err){
    return undefined;
  }
}

const saveState = (state) => {
  try{
    localStorage.setItem('state',JSON.stringify(state));
  }
  catch(err){

  }
}

const store = createStore(todoApp, loadState());
const Header = ({element, onUpdateTitle}) => {
  let input;
  return (
    <div>
      <input
        class="header"
        placeholder='Título'
        defaultValue={ element.title }
        ref={ node => input = node }
        onChange={ () => onUpdateTitle(element.id, input.value) }
      />

    </div>
  );
}

const GeneralFooter = ({ currentVisibilityFilter, onFilterClicked }) => (
  <div
    class="general-footer"
  >
    Filtrar Por:
    <FilterLink
      visibilityFilter="SHOW_ALL_ELEMENTS"
      currentVisibilityFilter={ currentVisibilityFilter }
      onFilterClicked={ onFilterClicked }>Todos</FilterLink>
    {' '}
    <FilterLink
      visibilityFilter="SHOW_NOTES"
      currentVisibilityFilter={ currentVisibilityFilter }
      onFilterClicked={ onFilterClicked }>Notas</FilterLink>
    {' '}
    <FilterLink
      visibilityFilter="SHOW_TODOS"
      currentVisibilityFilter={ currentVisibilityFilter }
      onFilterClicked={ onFilterClicked }>To-Do</FilterLink>
  </div>
);

const AddElement = ({ onAddTodoList, onAddNote }) => {
  let input;
  return (
    <div>
      <h2 class="title">Bienvenido a Chapin Keep</h2>
      <div class="new-element">
        <input 
          type="text" 
          placeholder={ 'Escribe una nota' }
          ref={ node => input = node } 
          onKeyDown={
            (event) => {
              if(event.keyCode === 13){
                onAddNote(input.value);
                input.value = "";
              }
            }
          }
        />
      </div>
      <div class="sub-container">
        <button class="btn"
          onClick={
            () => { 
              onAddNote(input.value);
              input.value = "";
            }
          }
        >Nueva Nota</button>
        <button
          class="btn"
          onClick={
            () => { 
              onAddTodoList();
            }
          }
        >Nuevo To-Do</button>
      </div>
    </div>
  );
}

const getSearchedElements = (elements, configurations) => {
  if ( typeof configurations.search !== "undefined" )
    if ( configurations.search !== "" )
      return elements.filter(
        element => {
          if (typeof element.title !== "undefined")
              if (element.title.toUpperCase().includes(configurations.search))
                return true;
          if (element.isNote){
            if (typeof element.text !== "undefined")
              if (element.text.toUpperCase().includes(configurations.search))
                return true;
          }
          if (!element.isNote){
            let val = false;
            for(var i = 0; i < element.todolist.length; i++) {
              if (element.todolist[i].text.toUpperCase().includes(configurations.search)) {
                  val = true;
              }
            }
            
            return val;
          }
        }
      );
  return elements;
}

const getVisibleElements = (elements, visibilityFilter, configurations) => {
  elements = getSearchedElements(elements, configurations);
  if(visibilityFilter === 'SHOW_ALL_ELEMENTS')
    return elements.filter(t => !t.archived);

  if(visibilityFilter === 'SHOW_NOTES')
    return elements.filter(t => t.isNote).filter(t => !t.archived);
  
  if(visibilityFilter === 'SHOW_TODOS')
    return elements.filter(t => !t.isNote).filter(t => !t.archived);
}

const ElementList = ({ elements, colors }) => (
  <div>
    {
      elements.map(element => (
        <Element
          key={ element.id }
          element={ element }
          colors={ colors }
        />
        
      ))
    }
  </div>
);

const Element = ({ element, colors}) => {
  let value;
  switch(element.isNote) {
    case true:
      value =
        <Note
          note={ element }
          onUpdateNote={
            (elementId, text) => {
              store.dispatch({
                type: 'UPDATE_NOTE',
                payload: {
                  elementId,
                  text
                }
              });
            }
          }
        />
      break;
    default:
      value = <TodosApp
        todos={ element.todolist }
        visibilityFilter={ element.visibilityFilter }
        elementId={ element.id }
        />
      break;
  }
  return (
    <div
      style={{
      background: element.color
      }}
      class="element"
    >
      <Header
        element={ element }
        onUpdateTitle={
          (elementId, text) => {
            store.dispatch({
              type: 'UPDATE_TITLE',
              payload: {
                elementId,
                text
              }
            });
          }
        } 
      />
      <button
        class="archivate"
        onClick={ 
          () => {
            store.dispatch({
              type: 'ARCHIVE_ELEMENT',
              payload: {
                elementId: element.id
              }
            });
          } 
        }
      >X</button>
      { value }
      <div>
        <p class="inline-text">Creado: {element.create_date} </p>
      </div>
      <div>
        <p class="inline-text">Ult. vez modificado: {element.modified_date}</p>
      </div>
      <div class="colors">
        {colors.map(color => (
          <button
            class="color"
            key={ colors.indexOf(color) }
            style={{ background: color }}
            onClick={
              () => {
                store.dispatch({
                  type: 'CHANGE_COLOR',
                  payload: {
                    elementId: element.id,
                    color
                  }
                })
              }
            }
            ></button>
          ))
        }
      </div>
    </div>
  );
}

const Note = ({ note, onUpdateNote }) => {
  let input;
  return (
    <input
      class="note"
      defaultValue={ note.text }
      ref={ node => input = node }
      onChange={ () => onUpdateNote(note.id, input.value) }
    />
  );
}

const SearchElement = ({onSearchElement, configurations}) => {
  let input;
  return (
    <div class="head">
      <img class="logo" src="./media/logo.png" height="120px" width="120px"/>
      <div class="navbar">
        <input
          placeholder={ 'Busca aquí lo que quieras.' }
          defaultValue= { configurations.search }
          ref={ node => input = node }
          onChange={ () => onSearchElement(input.value) }
          onKeyDown={
            (event) => {
              if(event.keyCode === 27){
                input.value = "";
                onSearchElement(input.value);
              }
            }
          } 
        />
        <img class="icon" src="./media/lupa.png" height="25px" width="25px"/>
        </div>
    </div>

  );

}

const ElementsApp = ({ elements, visibilityFilterElements, configurations }) => (
  <div>
    <SearchElement
      configurations={ configurations }
      onSearchElement={
        (text) => {
          store.dispatch({
            type: 'SEARCH_ELEMENT',
            payload: {
              text
            }
          })
        }
      }
    />
    <div class="container">
      <AddElement
        onAddNote={
          (text) => {
            store.dispatch({
              type: 'ADD_NOTE',
              payload: {
                id: v4(),
                text,
                color: configurations.colors[0]
              }
            });
          }
        }
        onAddTodoList={
          () => {
            store.dispatch({
              type: 'ADD_TODO_LIST',
              payload: {
                id: v4(),
                color: configurations.colors[0]       
              }
            });
          }
        }
        />

        <ElementList
        elements={ getVisibleElements(elements, visibilityFilterElements, configurations) }
        colors={ configurations.colors }
        />
      </div>
      <GeneralFooter
      currentVisibilityFilter={ visibilityFilterElements }
      onFilterClicked={
        (filter) => {
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER_ELEMENTS',
            payload: { visibilityFilter: filter }
          });
        }
      } />

  </div>
);

const FilterLink = ({ visibilityFilter, currentVisibilityFilter, onFilterClicked, children }) => {

  if(visibilityFilter === currentVisibilityFilter){
    return <strong>{ children }</strong>;
  }

  return <a
    href="#"
    onClick={
      (e) => {
        e.preventDefault();
        onFilterClicked(visibilityFilter);
      }
    }>
    { children }</a>
}

const getVisibleTodos = (todos, visibilityFilter) => {
  if(visibilityFilter === 'SHOW_ALL'){
    return todos;
  }

  if(visibilityFilter === 'SHOW_COMPLETED'){
    return todos.filter(t => t.completed);
  }

  if(visibilityFilter === 'SHOW_ACTIVE'){
    return todos.filter(t => !t.completed);
  }
}

const Todo = ({ todo, onTodoClicked, onRemoveTodo, onUpdateTodo}) => {
  let input;
  return (
    <div class="todo">
      <input type='checkbox'
        defaultChecked={ todo.completed }
        onClick={ onTodoClicked }
      />
      <input type="text"
        style={{
        textDecoration: todo.completed ? 'line-through' : 'none'
        }}
        defaultValue={ todo.text }
        ref={ node => input = node }
        onChange={ () => onUpdateTodo(todo, input.value) }
      />
      <button class="remove"
          onClick={ onRemoveTodo }
      >Remove</button>
    </div>
  );
}

const TodoList = ({ todos, onTodoClicked, onRemoveTodo, onUpdateTodo }) => (
  <div>
    {
      todos.map(todo => {
        return(
        <Todo
          key={ todo.id }
          todo={ todo }
          onTodoClicked={ () => onTodoClicked(todo) }
          onRemoveTodo={ () => onRemoveTodo(todo) }
          onUpdateTodo={ onUpdateTodo }
        />
        );
    })
    }
  </div>
);

const AddTodo = ({ onAddTodo, children }) => {
  let input;

  return (
    <div class="new-todo">
      <input type="text" 
        ref={ node => input = node } 
        placeholder="Nuevo To-Do"
        onKeyDown={
          (event) => {
            if(event.keyCode === 13){
              onAddTodo(input.value);
              input.value = "";
            }
          }
        } 
      />
    </div>
  );
}

const Footer = ({ currentVisibilityFilter, onFilterClicked }) => (
  <div class="footer">
    Filtra Por:
    <FilterLink
      visibilityFilter="SHOW_ALL"
      currentVisibilityFilter={ currentVisibilityFilter }
      onFilterClicked={ onFilterClicked }>Todos</FilterLink>
    {' '}
    <FilterLink
      visibilityFilter="SHOW_COMPLETED"
      currentVisibilityFilter={ currentVisibilityFilter }
      onFilterClicked={ onFilterClicked }>Completados</FilterLink>
    {' '}
    <FilterLink
      visibilityFilter="SHOW_ACTIVE"
      currentVisibilityFilter={ currentVisibilityFilter }
      onFilterClicked={ onFilterClicked }>Activos</FilterLink>
  </div>
);

const TodosApp = ({ todos, visibilityFilter, elementId }) => (
  <div>
    <AddTodo
      class="element"
      onAddTodo={
        (text) => {
          store.dispatch({
            type: 'ADD_TODO',
            payload: {
              id: v4(),
              text,
              elementId
            }
          });
        }
      }>+</AddTodo>

    <TodoList
      todos={ getVisibleTodos(todos, visibilityFilter) }
      onTodoClicked={
        (todo) => {
          store.dispatch({
            type: 'TOGGLE_TODO',
            payload: {
              id: todo.id,
              elementId
            }
          });
        }
      }
      onRemoveTodo={
        (todo) => {
          store.dispatch({
            type: 'REMOVE_TODO',
            payload: {
              id: todo.id,
              elementId
            }
          });
        }
      }
      onUpdateTodo={
        (todo, text) => {
          store.dispatch({
            type: 'UPDATE_TODO',
            payload: {
              id: todo.id,
              elementId,
              text
            }
          })
        }
      }
       />
  
    <Footer
      currentVisibilityFilter={ visibilityFilter }
      onFilterClicked={
        (filter) => {
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            payload: { 
              visibilityFilter: filter, 
              elementId }
          });
        }
      } />
      
  </div>
);

const render = () => {
  ReactDOM.render(
     <ElementsApp
      { ...store.getState() } />,
    document.getElementById('root')
  );
};
render();
store.subscribe(render);
store.subscribe( () => {
  saveState(store.getState());
});