import * as validate from './validate'
import AuthError from './AuthError'

export default (...funcs) => input => funcs.reduce((chain, func) => chain.then(func), Promise.resolve(input))
