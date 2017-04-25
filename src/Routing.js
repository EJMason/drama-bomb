// import React from 'react'
import React, { Component } from 'react'
import { Route, Redirect } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'

import Dashboard from './Containers/Dashboard'
import Login from './Containers/Login'
import Homepage from './Containers/Homepage'

export const history = createHistory()

class Routing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
    }
    this.buildAppComponent = this.buildAppComponent.bind(this)
    this.renderCorrectPage = this.renderCorrectPage.bind(this)
  }

  buildAppComponent(props) {
    return (<Homepage {...props} />)
  }

  renderCorrectPage(props) {
    return (localStorage.getItem('id_token')) ? (<Dashboard {...props} />) : (<Redirect to="/" />)
  }

  render() {
    return (
      <ConnectedRouter history={history}>
        <div>
          <Route exact path="/" render={this.buildAppComponent} />
          <Route path="/demon" render={this.renderCorrectPage} />
          <Route path="/login" component={Login} />
        </div>
      </ConnectedRouter>
    )
  }
}

export default Routing
