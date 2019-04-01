// src/js/store/index.js
import { createStore, applyMiddleware } from 'redux';
import rootReducer from "./reducers";
import { loadState, saveState } from "./localStorage";
import thunk from 'redux-thunk';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

store.subscribe(() => {
  saveState({
    adInsights: store.getState().adInsights,
    overview: store.getState().overview,
  })
});

export default store;