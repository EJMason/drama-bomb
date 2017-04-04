// import React from 'react'
import React, { Component } from 'react'
import { Route, Redirect } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'

import Dashboard from '../Containers/Dashboard'
import App from '../App'

export const history = createHistory()
const buildAppComponent = () => (<App stuff="tester" />)

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
      <ConnectedRouter history={history}>
        <div>
          <Route exact path="/" render={buildAppComponent} />
          <Route exact path="/demon" render={this.renderCorrectPage.bind(this)} />
        </div>
      </ConnectedRouter>
    )
  }
}

export default Routing
