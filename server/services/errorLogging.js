
module.export.socketError = (err, file, dir, method, type, added = {}) => {
  return Object.create(added, {
    error: err,
    file,
    dir,
    type,
    channel,
  })
}
