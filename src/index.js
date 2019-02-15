import * as validate from './validate'
import _acl from './acl'
import _token from './token'
import compose from './compose'
import AuthError from './AuthError'

export {AuthError as AuthTheWallError}

export default (config) => {

	if (!validate.hasOwnProperties(config, ['expiresIn', 'privateKey', 'roles'])) {
		throw new TypeError('Invalid options! Pass role, privateKey and expiresIn by parameter')
	}

	if (!validate.isString(config.expiresIn)) {
		throw new TypeError('Invalid options! expiresIn must be string')
	}

	if (!validate.isString(config.privateKey)) {
		throw new TypeError('Invalid options! privateKey must be string')
	}

	if (!validate.isArray(config.roles) && validate.isEmpty(config.roles)) {
		throw new TypeError('Invalid options! roles must be array')
	}

	config.roles = [...config.roles, 'guest']

	const acl = _acl(config)
	const token = _token(config)

	const middleware = async function(req, res, next) {
		try {

			let user = {
				id: null,
				role: 'guest'
			}

			if (req.headers.authorization) {
				user = token.get(req.headers.authorization)
			}

			req.user = user

			const path = acl.normalizePath(req.route.path, req.originalUrl, req.params)
			const aclRule = acl.find(path, req.method)

			if (aclRule) {
				const hasPermission = acl.hasPermission(user.role, aclRule.roles)
				if (aclRule.rules) {
					await compose(...aclRule.rules)({req, res, next})
				}

				return next()
			}

			throw new AuthError('Permission denied', 403)

		} catch(e) {
			const {statusCode, message, content} = e
			//next({statusCode, message, content})
			res.status(statusCode || 500).send({message, content})
		}
	}

	return {
		middleware,
		acl,
		token
	}
}
