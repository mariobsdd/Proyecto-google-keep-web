import React from 'react';
import ReactDOM from 'react-dom';
import FilterLink from './filterLink';
import TodosApp from './todosApp';

const { Component } = React;
console.log(TodosApp);
//-------------------------

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
    Show:
    <FilterLink
      visibilityFilter="SHOW_ALL_ELEMENTS"
      currentVisibilityFilter={ currentVisibilityFilter }
      onFilterClicked={ onFilterClicked }>All</FilterLink>
    {' '}
    <FilterLink
      visibilityFilter="SHOW_NOTES"
      currentVisibilityFilter={ currentVisibilityFilter }
      onFilterClicked={ onFilterClicked }>Notes</FilterLink>
    {' '}
    <FilterLink
      visibilityFilter="SHOW_TODOS"
      currentVisibilityFilter={ currentVisibilityFilter }
      onFilterClicked={ onFilterClicked }>Todos</FilterLink>
  </div>
);

const AddElement = ({ onAddTodoList, onAddNote }) => {
  let input;

  return (
    <div
      class="add-element"
    >
      <input 
        type="text" 
        placeholder={ 'Nueva Nota' }
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
      <button
        class="add-element b1"
        onClick={
          () => { 
            onAddNote(input.value);
            input.value = "";
          }
        }
      >Nueva Nota</button>
      <button
        class="add-element b2"
        onClick={
          () => { 
            onAddTodoList();
          }
        }
      >Nuevo Todo</button>
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
      { value }
      <button
        class="archivar"
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
      >Archivar</button>
      <div
        class="colors"
      >
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
    <div
      class="search-bar"
    >
      <input
        placeholder={ 'Búsqueda' }
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
      <button
        onClick={
          () => { 
            input.value = "";
            onSearchElement(input.value);
          }
        }
      >X</button>
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
    <div
      class="container"
    >
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

export default ElementsApp;