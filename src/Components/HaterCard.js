import React, { Component } from 'react'
import { Motion, spring } from 'react-motion'

import './Styles/css/HaterCard.css'

class HaterCard extends Component {
  constructor(props) {
    super(props)
    this.state = { open: false }
  }

  handleMouseDown = () => {
    this.setState({ open: !this.state.open })
  }

  handleTouchStart = e => {
    e.preventDefault()
    this.handleMouseDown()
  }

  render() {
    return (
      <div>
        <button
          onMouseDown={this.handleMouseDown}
          onTouchStart={this.handleTouchStart}
        >
          Toggle
        </button>
        <Motion
          style={{
            x: spring(this.state.open ? 35 : 0),
            y: spring(this.state.open ? 0 : 3),
            z: spring(this.state.open ? 105 : 70),
          }}
        >
          {({ x, y, z }) =>
            <div
              className="card-container"
              style={{
                height: `${z}px`,
              }}
            >
              {x}
              <div
                className="button-container"
              >
              yar
              </div>
              <div
                className="color-container"
                style={{
                  borderRadius: `3px 3px ${y}px ${y}px`,
                }}
              >
                .
              </div>
            </div>
          }
        </Motion>
      </div>
    )
  }
}

export default HaterCard
