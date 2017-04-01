import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './App'
import createStore from './Redux/Reducers'
import './index.css'

const root = document.getElementById('root')
const store = createStore()
const reduxProvider = (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render(reduxProvider, root)
