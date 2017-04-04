import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import rootSaga from '../Sagas'
import configureStore from './CreateStore'

import temp from './temp'
import login from './Login'

export default history => {
  const rootReducer = combineReducers({
    temp,
    login,
    router: routerReducer,
  })
  return configureStore(rootReducer, rootSaga, history)
}
