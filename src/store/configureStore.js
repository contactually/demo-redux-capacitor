import { applyMiddleware, createStore, compose } from 'redux'
import { Map } from 'immutable'
import thunk from 'redux-thunk'
import rootSaga from './root'

import { combineReducers } from 'redux-immutable'
import EntitiesModule from 'redux-capacitor/module'

const rootReducer = combineReducers({
  [EntitiesModule.MODULE_NAME]: EntitiesModule.rootReducer
})

const initStore = (initialState, sagaMiddleware) => {
  const middleware = [sagaMiddleware, thunk]

  const enhancers = []
  const devToolsExtension = window.devToolsExtension
  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }

  const store = createStore(
    rootReducer,
    Map(),
    compose(applyMiddleware(...middleware), ...enhancers)
  )

  sagaMiddleware.run(rootSaga)

  return store
}

export default initStore
