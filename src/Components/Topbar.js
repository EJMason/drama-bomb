import React from 'react'

import tweet from '../../public/tweet.svg'
import './Styles/css/Dashboard.css'

const Topbar = ({ logout, picture, name, screen }) => {
  const names = name.split(' ')
  const fName = names[0]
  const lName = names[1] ? names[1].charAt(0) : ''
  return (
    <div className="topbar-container">
      <img
        className="tweet-logo"
        src={tweet}
        alt="logo"
      />
      <div className="profile-container">
        <div className="profile-text-container">
          <div className="handle">@{screen}</div>
          <div className="username">{fName} {lName}.</div>
        </div>
        <input
          type="image"
          src={picture}
          className="userImage"
          onClick={logout}
        />
      </div>
      <div className="test" />
    </div>
  )
}

export default Topbar

// { image, first_name, family_name, screen_name }
