
// 没做入参兼容的redux
const createStore = (reducer, initialState) => {
  let currentState = initialState || {};
  let currentListeners = [];
  const currentReducer = reducer;

  function getState() {
    return currentState;
  }

  function dispatch(action) {
    currentState = currentReducer(currentState, action);
    currentListeners.forEach(l => {
      l();
    });
  }

  function subscribe(listener) {
    currentListeners.push(listener);
    return () => {
      currentListeners = currentListeners.filter(l => l !== listener);
    }
  }

  return {
    getState,
    dispatch,
    subscribe
  };
};

const combineReducers = mappingReducer => {
  const reducerKeys = Object.keys(mappingReducer);
  return (state, action) => {
    const nextState = state;
    reducerKeys.forEach(key => {
      const reducer = mappingReducer[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      if (nextStateForKey !== previousStateForKey) {
        nextState[key] = nextStateForKey;
      }
    });
    return nextState;
  };
};

export {
  createStore,
  combineReducers
};

