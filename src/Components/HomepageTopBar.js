import React from 'react'
import '../Styles/Tools.css'


const HomepageTopBar = ({ auth }) => {
  return (
    <div className="outline">
      <button onClick={() => auth.login()}>Hello</button>
    </div>
  )
}

export default HomepageTopBar
