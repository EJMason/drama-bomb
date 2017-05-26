import { combineReducers } from 'redux'

import rootSaga from '../Sagas'
import configureStore from './CreateStore'

import login from './Duck.Login'
import user from './Duck.User'

export default history => {
  const rootReducer = combineReducers({
    login,
    user,
  })
  return configureStore(rootReducer, rootSaga, history)
}
