import React from 'react';
import ReactDOM from 'react-dom';
import FilterLink from './filterLink';

const { Component } = React;

//--------------------------------------

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
    <div
      class="todo"
    >
      <input
        type='checkbox'
        defaultChecked={ todo.completed }
        onClick={ onTodoClicked }
      />
      <input
        type="text"
        style={{
        textDecoration: todo.completed ? 'line-through' : 'none'
        }}
        defaultValue={ todo.text }
        ref={ node => input = node }
        onChange={ () => onUpdateTodo(todo, input.value) }
      />
      
      <button
          onClick={ onRemoveTodo }
      >X</button>
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
    <div
      class="add-todo"
    >
      <input 
        type="text" 
        ref={ node => input = node } 
        placeholder="Nuevo Todo"
        onKeyDown={
          (event) => {
            if(event.keyCode === 13){
              onAddTodo(input.value);
              input.value = "";
            }
          }
        }  
      />
      <button
        onClick={
          () => { 
            onAddTodo(input.value);
            input.value = "";
          }
        }
      >{ children }</button>
    </div>
  );
}

const Footer = ({ currentVisibilityFilter, onFilterClicked }) => (
  <div
    class="footer"
  >
    Show:
    <FilterLink
      visibilityFilter="SHOW_ALL"
      currentVisibilityFilter={ currentVisibilityFilter }
      onFilterClicked={ onFilterClicked }>All</FilterLink>
    {' '}
    <FilterLink
      visibilityFilter="SHOW_COMPLETED"
      currentVisibilityFilter={ currentVisibilityFilter }
      onFilterClicked={ onFilterClicked }>Completed</FilterLink>
    {' '}
    <FilterLink
      visibilityFilter="SHOW_ACTIVE"
      currentVisibilityFilter={ currentVisibilityFilter }
      onFilterClicked={ onFilterClicked }>Active</FilterLink>
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

export default TodosApp;