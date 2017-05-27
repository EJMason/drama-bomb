import React, { Component } from 'react'
import './Styles/css/App.css'

import Homepage from './Containers/Homepage'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      temp: null,
    }
    console.log(window.location.href)
  }

  render() {
    return (<div className="App"><Homepage /></div>)
  }
}

export default App
