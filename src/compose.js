import * as validate from './validate'
import AuthTheWallError from './AuthTheWallError'

export default (...funcs) => input => funcs.reduce((chain, func) => chain.then(func), Promise.resolve(input))
