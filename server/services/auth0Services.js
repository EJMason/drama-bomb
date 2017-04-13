const jwtDecode = require('jwt-decode')

const generateManagmentOptions = () => {
  const url = `${process.env.AUTH0_DOMAIN}/oauth/token`
  const headers = { 'content-type': 'application/json' }

  const clientId = `{"client_id":"${process.env.AUTH0_CLIENT_ID}",`
  const clientSecret = `"client_secret":"${process.env.AUTH0_CLIENT_SECRET}",`
  const audience = `"audience":"${process.env.AUTH0_DOMAIN}/api/v2/",`
  const grantType = '"grant_type":"client_credentials"}'

  const body = `${clientId}${clientSecret}${audience}${grantType}`
  return { method: 'POST', url, headers, body }
}


const getTokenExpirationDate = token => {
  if (token === undefined) return null
  const dcd = jwtDecode(token)
  if (!dcd.exp) return null

  const date = new Date(0) // The 0 here is the key, which sets the date to the epoch
  date.setUTCSeconds(dcd.exp)
  return date
}

const checkIfWebTokenIsExpired = token => {
  if (token === undefined) return true
  const date = getTokenExpirationDate(token)
  const offsetSeconds = 0
  if (date === null) {
    return false
  }
  return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)))
}

module.exports = { generateManagmentOptions, checkIfWebTokenIsExpired }
