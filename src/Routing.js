// import React from 'react'
import React, { Component } from 'react'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
// import createHistory from 'history/createBrowserHistory'

import Dashboard from './Containers/Dashboard'
import Login from './Containers/Login'
import Homepage from './Containers/Homepage'
import Auth from './Components/Auth'
import './Styles/css/App.css'

// export const history = createHistory()

class Routing extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
    }
    this.buildHomeComponent = this.buildHomeComponent.bind(this)
    this.loginChecker = this.loginChecker.bind(this)
  }

  buildHomeComponent(props) {
    return (<Homepage {...props} />)
  }

  loginChecker(props) {
    return (localStorage.getItem('id_token')) ? (<Dashboard {...props} />) : (<Redirect to="/" />)
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={this.buildHomeComponent} />
          <Route path="/dashboard" render={this.loginChecker} />
          <Route path="/post" component={Auth} />
          <Route path="/login" component={Login} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default Routing
