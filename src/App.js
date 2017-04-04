import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

import Homepage from './Containers/Homepage'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      temp: null,
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <Homepage />
      </div>
    )
  }
}

export default App
