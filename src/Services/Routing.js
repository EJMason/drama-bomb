// import React from 'react'
import React, { Component } from 'react'
import { Router, Route, Redirect } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'

import Dashboard from '../Containers/Dashboard'
import App from '../App'

const history = createBrowserHistory()

history.listen((location, action) => {
  console.log(`The current URL is ${location.pathname}${location.search}${location.hash}`)
  console.log(`The last navigation action was ${action}`)
})

const loggedIn = true

const renderCorrectPage = () => { return loggedIn ? (<Dashboard />) : (<Redirect to="/" />) }
const buildAppComponent = () => (<App stuff="yaaaaa" />)

class Routing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      temp: null,
    }
  }

  render() {
    return (
      <Router history={history}>
        <div>
          <Route exact path="/" render={buildAppComponent} />
          <Route exact path="/demon" render={renderCorrectPage} />
        </div>
      </Router>
    )
  }
}

export default Routing
