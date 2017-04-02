import React from 'react'
import { Router, Route } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'

import App from '../App'

const history = createBrowserHistory()

history.listen((location, action) => {
  console.log(`The current URL is ${location.pathname}${location.search}${location.hash}`)
  console.log(`The last navigation action was ${action}`)
})

export default (
  <Router history={history}>
    <Route path="/" component={App} />
  </Router>
)
