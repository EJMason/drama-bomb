import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'

// import AuthService from './Services/AuthServices'
import Routing from './Routing'
import createStore from './Redux/Reducers'
import './index.css'

const history = createHistory()
// const auth = new AuthService()

const root = document.getElementById('root')
const store = createStore(history)

const reduxProvider = (
  <Provider store={store}>
    <Routing history={history} />
  </Provider>
)

ReactDOM.render(reduxProvider, root)
