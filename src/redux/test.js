import { createStore, combineReducers } from './index';

const counter = (state = 0, action) => {
  if (action.type === 'add_counter') {
    return state + action.payload;
  }
  if (action.type === 'subtract_counter') {
    return state - action.payload;
  }
  return state;
}

const todos = (state = [], action) => {
  if (action.type === 'add_todos') {
    return state.concat(action.payload);
  }
  if (action.type === 'subtract_todos') {
    return state.filter(text => text !== action.payload);
  }
  return state;
}

const store = createStore(
  combineReducers({
    counter,
    todos
  }),
  {
    counter: 0,
    todos: []
  }
);

store.subscribe(() => {
  console.log('currentState', store.getState());
});

store.dispatch({
  type: 'add_counter',
  payload: 2
});

store.dispatch({
  type: 'add_counter',
  payload: 200
});

store.dispatch({
  type: 'add_todos',
  payload: 100
});

store.dispatch({
  type: 'add_todos',
  payload: 20
});

store.dispatch({
  type: 'subtract_todos',
  payload: 20
});
