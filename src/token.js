import jwt from 'jsonwebtoken'
import * as validate from './validate'
import AuthError from './AuthError'

export default (config) => {

	/**
	* set
	* @param {Object} data
	*/
	const set = (data) => {
		return jwt.sign(data, config.secret, {
			expiresIn: config.expiresIn
		})
	}


	/**
	* get
	* @param {String} token
	*/
	const get = (token) => {

		if (!token) {
			return null
			//throw new AuthError('Token not found', 400)
		}

		try {

			return jwt.verify(token.substr(token.indexOf(' ') + 1), config.secret)

		} catch (err) {

			if (err.name == 'JsonWebTokenError' && err.message == 'jwt malformed') {
				throw new AuthError('Token malformed', 401)
			}

			throw new AuthError('Invalid token', 401)
		}
	}



	/**
	 * return
	 */
	return Object.freeze({
		set,
		get,
	})
}
