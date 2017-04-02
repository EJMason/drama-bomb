// import React from 'react'
import React, { Component } from 'react'
import { Router, Route, Redirect } from 'react-router'
import { connect } from 'react-redux'
import createBrowserHistory from 'history/createBrowserHistory'

import Dashboard from '../Containers/Dashboard'
import App from '../App'

const history = createBrowserHistory()
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
      <Router history={history}>
        <div>
          <Route exact path="/" render={buildAppComponent} />
          <Route exact path="/demon" render={this.renderCorrectPage.bind(this)} />
        </div>
      </Router>
    )
  }
}

const mapStateToProps = state => ({
  history: state.login.history,
})

const mapDispatchToProps = dispatch => ({
  dispatchMount: () => dispatch(tempActions.dispatchMountAction()),
})

export const hist = history
export default connect(mapStateToProps, mapDispatchToProps)(Routing)
