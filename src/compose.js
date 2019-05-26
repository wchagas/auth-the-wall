const validate = require('./validate')
const AuthTheWallError = require('./AuthTheWallError')

module.exports = (...funcs) => input => funcs.reduce((chain, func) => chain.then(func), Promise.resolve(input))
