const validate = require('./validate')
const _acl = require('./acl')
const _token = require('./token')
const compose = require('./compose')
const AuthTheWallError = require('./AuthTheWallError')

module.exports = (config = {}) => {

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

	const configDefault = {
		hierarchy: true
	}

	config = {
		...configDefault,
		...config
	}

	config.roles = [...config.roles, 'guest']

	const acl = _acl(config)
	const token = _token(config)

	if (validate.isArray(config.acl) && !validate.isEmpty(config.acl)) {
		acl.add(config.acl)
	}

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

			const aclRule = acl.find(req)

			if (aclRule) {
				const hasPermission = acl.hasPermission(aclRule, user.role, aclRule.roles)

				if (!hasPermission) {
					throw new AuthTheWallError('Permission denied', 403)
				}

				if (aclRule.rules) {
					await compose(...aclRule.rules)({req, res, next})
				}

				return next()
			}

			throw new AuthTheWallError('Permission denied', 403)

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
