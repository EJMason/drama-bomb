
process.on('unhandledRejection', reason => {
  console.error('------------- Unhandled Promise Rejection ---------------------')
  Object.keys(reason).forEach(val => console.error(`${val}: ${reason[val]}`))
})
