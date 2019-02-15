import jwt from 'jsonwebtoken'
import * as validate from './validate'
import AuthTheWallError from './AuthTheWallError'

export default (config) => {

	/**
	* set
	* @param {Object} data
	*/
	const set = (data) => {
		return jwt.sign(data, config.privateKey, {
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
			//throw new AuthTheWallError('Token not found', 400)
		}

		try {

			return jwt.verify(token.substr(token.indexOf(' ') + 1), config.privateKey)

		} catch (err) {

			if (err.name == 'JsonWebTokenError' && err.message == 'jwt malformed') {
				throw new AuthTheWallError('Token malformed', 401)
			}

			throw new AuthTheWallError('Invalid token', 401)
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
