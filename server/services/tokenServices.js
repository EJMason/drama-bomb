const jwtDecode = require('jwt-decode')

const getTokenExpirationDate = token => {
  if (token === undefined) return null
  const dcd = jwtDecode(token)
  if (!dcd.exp) return null

  const date = new Date(0) // The 0 here is the key, which sets the date to the epoch
  date.setUTCSeconds(dcd.exp)
  return date
}

process.env.checkIfWebTokenIsExpired = token => {
  if (token === undefined) return true
  const date = getTokenExpirationDate(token)
  const offsetSeconds = 0
  if (date === null) {
    return false
  }
  return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)))
}
