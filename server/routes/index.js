
const sample = () => 'sample'
module.exports = app => {
  app.use('/sample', sample)
}
