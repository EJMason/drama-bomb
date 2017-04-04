// import React from 'react'
import React, { Component } from 'react'
import { Route, Redirect } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'

import Dashboard from '../Containers/Dashboard'
import App from '../App'
import Login from '../Components/Login'

export const history = createHistory()
const buildAppComponent = () => (<App />)

class Routing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      temp: null,
      loggedIn: false,
    }

    this.renderCorrectPage = this.renderCorrectPage.bind(this)
  }

  renderCorrectPage() {
    return (localStorage.getItem('id_token')) ? (<Dashboard />) : (<Redirect to="/" />)
  }

  render() {
    return (
      <ConnectedRouter history={history}>
        <div>
          <Route exact path="/" render={buildAppComponent} />
          <Route path="/demon" render={this.renderCorrectPage} />
          <Route path="/login" component={Login} />
        </div>
      </ConnectedRouter>
    )
  }
}

export default Routing
