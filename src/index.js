import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import Routing from './Services/Routing'
import createStore from './Redux/Reducers'
import './index.css'

const root = document.getElementById('root')
const store = createStore()

const reduxProvider = (
  <Provider store={store}>
    <Routing />
  </Provider>
)

ReactDOM.render(reduxProvider, root)
