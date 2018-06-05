import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { Map } from 'immutable'
import { Provider } from 'react-redux'
import { Sagas } from './store/react-redux-saga'
import configureStore from './store/configureStore'

import createSagaMiddleware from 'redux-saga'

const sagaMiddleware = createSagaMiddleware({
  onError: (error) => {
    console.error(error)
  }
})

const initialState = Map()
const store = configureStore(initialState, sagaMiddleware)

ReactDOM.render(
  <Sagas middleware={sagaMiddleware}>
    <Provider store={store}>
      <App />
    </Provider>
  </Sagas>,
  document.getElementById('root')
);
