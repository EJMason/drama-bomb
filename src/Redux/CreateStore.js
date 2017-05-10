import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'
import { routerMiddleware } from 'react-router-redux'

export default (rootReducer, rootSaga, history) => {
   /* ------------- Redux Configuration ------------- */
  let plugins = []

  if (process.env.NODE_ENV !== 'production') {
    plugins = [
      ...plugins,
      logger,
    ]
  }

  const sagaMiddleware = createSagaMiddleware()
  plugins.push(sagaMiddleware)

  const reduxRouterMiddleware = routerMiddleware(history)
  plugins.push(reduxRouterMiddleware)
    /* ------------- Assemble Middleware ------------- */

  const middleware = applyMiddleware(...plugins)

  /* ------------- AutoRehydrate Enhancer ------------- */

  const store = createStore(rootReducer, middleware)
  sagaMiddleware.run(rootSaga)

  return store
}
