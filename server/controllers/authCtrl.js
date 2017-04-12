const Users = require('../database/models/Users')

const example = (req, res) => {
  res.status(200).send('Hello, Auth!')
}

const initLoginSequence = async (req, res) => {
  
}

module.exports = { example, initLoginSequence }
