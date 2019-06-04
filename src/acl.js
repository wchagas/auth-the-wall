const validate = require('./validate')

module.exports = (options) => {


	/**
	* @var {Array} acl
	*/
	let data = []



	/**
	 * add
	 * @param {Array} acl
	 * @return {Array} all
	 */
	const add = (acl) => {

		if (!validate.isArray(acl) || validate.isEmpty(acl)) {
			throw new TypeError('Invalid route! Pass an array by parameter')
		}

		const normalizeRoutes = acl => {

			if (!validate.hasOwnProperties(acl, ['routes', 'methods', 'roles'])) {
				throw new TypeError('Invalid options! Pass routes, methods and roles in acl object')
			}

			acl.methods = acl.methods.map(m => m.toUpperCase())
			acl.routes = !validate.isArray(acl.routes) ? [acl.routes] : acl.routes
			acl.rules = acl.rules || null
			acl.rules = validate.isFunction(acl.rules) ? [acl.rules] : acl.rules

			return acl
		}

		data = [
			...data,
			...acl.map(normalizeRoutes)
		]

		return data
	}



	/**
	 * getRoutes
	 */
	const get = () => {
		return data
	}


	/**
	 * find
	 * @param {String} route
	 * @param {String} method
	 * @return {Object|Boolean}
	 */
	const find = (req) => {

		const route = normalizePath(req.route.path, req.originalUrl, req.params, req.query)
		const method = req.method.toUpperCase()

		const acl = data.filter(acl => {
			return acl.routes.indexOf(route) !== -1
				&& acl.methods.indexOf(method) !== -1
		})

		return acl
	}



	/**
	 * hasPermission
	 * @param {String} role
	 * @param {Array} roles
	 * @return {Boolean}
	 */
	const hasPermission = (aclRule, role, roles) => {

		const notFound = role => options.roles.indexOf(role) == -1

		if (notFound(role) || roles.some(notFound)) {
			throw new TypeError('Role not found in config.roles')
		}

		const useHierarchy = () => {
			const roleIndex = options.roles.indexOf(role)
			return roles.some(role => options.roles.indexOf(role) >= roleIndex)
		}

		if (aclRule.hasOwnProperty('hierarchy')) {
			return aclRule.hierarchy ? useHierarchy() : roles.includes(role)
		}

		return options.hierarchy ? useHierarchy() : roles.includes(role)
	}



	/**
	*
	* TODO: Another option?
	* If using Router() so req.route.path will not be able to read the path
	*
	* @param {String} url 		/:id
	* @param {String} fullUrl 	/posts/1
	* @param {Object} params
	* @return {String}	 		/posts/:id
	*/
	const normalizePath = (url, fullUrl, params, query) => {

		if (!url && !fullUrl) {
			return ''
		}

		if (!fullUrl || fullUrl == url) {
			return url
		}

		if (validate.isObject(params)) {
			params = Object.keys(params).filter(i => params[i] !== undefined).length
		}

		// remove query
		fullUrl = fullUrl.replace(/\?.*/, '')

		const split = value => value.split("/").filter(s => s != "")

		fullUrl = split(fullUrl)
		let urlSplit = split(url)

		fullUrl = fullUrl.filter(fu => !urlSplit.some(f => f == fu) )

		if (params > 0) {
			fullUrl.splice(-params)
		}

		let path = fullUrl.join('/') + url

		if (path[0] != '/') {
			path = '/' + path
		}

		return path
	}



	/**
	 * return
	 */
	return Object.freeze({
		add,
		get,
		find,
		hasPermission,
		normalizePath
	})
}
