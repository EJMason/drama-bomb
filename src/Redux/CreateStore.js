import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'

export default (rootReducer, rootSaga) => {
   /* ------------- Redux Configuration ------------- */
  let plugins = []

  if (process.env.NODE_ENV !== 'production') {
    plugins = [...plugins,
      logger(),
    ]
  }

  const sagaMiddleware = createSagaMiddleware()
  plugins.push(sagaMiddleware)

    /* ------------- Logger Middleware --------------- */

    /* ------------- Assemble Middleware ------------- */

  const middleware = applyMiddleware(...plugins)

  /* ------------- AutoRehydrate Enhancer ------------- */

  const store = createStore(rootReducer, middleware)
  sagaMiddleware.run(rootSaga)

  return store
}
