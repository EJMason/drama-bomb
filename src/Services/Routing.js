// import React from 'react'
import React, { Component } from 'react'
import { Router, Route, Redirect } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'

import Dashboard from '../Containers/Dashboard'
import App from '../App'

const history = createBrowserHistory()

const buildAppComponent = () => (<App stuff="yaaaaa" />)

class Routing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      temp: null,
      loggedIn: false,
    }
  }

  renderCorrectPage() {
    return this.state.loggedIn ? (<Dashboard />) : (<Redirect to="/" />)
  }

  render() {
    return (
      <Router history={history}>
        <div>
          <Route exact path="/" render={buildAppComponent} />
          <Route exact path="/demon" render={this.renderCorrectPage.bind(this)} />
        </div>
      </Router>
    )
  }
}

export default Routing
