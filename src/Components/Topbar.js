import React from 'react'

import tweet from '../../public/tweet.svg'
import './Styles/css/Dashboard.css'

const Topbar = ({ image, logout }) => {
  image = 'http://staging1.dima.co.nz/wp-content/uploads/2016/07/4.jpg'
  return (
    <div className="topbar-container">
      <img
        className="tweet-logo"
        src={tweet}
        alt="logo"
      />
      <div className="profile-container see">
        <div className="profile-text-container">
          <div className="handle">@myHandle</div>
          <div className="username">Eliot M</div>
        </div>
        <input
          type="image"
          src={image}
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
