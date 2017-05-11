import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Routing from './Routing'
import createStore from './Redux/Reducers'
import './Styles/css/index.css'

const root = document.getElementById('root')

// redux store
const store = createStore(history)

const reduxProvider = (
  <Provider store={store}>
    <Routing />
  </Provider>
)

ReactDOM.render(reduxProvider, root)
