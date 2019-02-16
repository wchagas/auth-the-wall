import * as validate from './validate'

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
			throw new TypeError('Invalid resource! Pass an array by parameter')
		}

		const normalizeRoutes = acl => {

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
	 * @param {String} resource
	 * @param {String} method
	 * @return {Object|Boolean}
	 */
	const find = (resource, method) => {

		method = method.toUpperCase()

		const acl = data.find(acl => {
			return acl.routes.indexOf(resource) !== -1
				&& acl.methods.indexOf(method) !== -1
		})

		return acl || false
	}



	/**
	 * hasPermission
	 * @param {String} role
	 * @param {Array} roles
	 * @return {Boolean}
	 */
	const hasPermission = (role, roles) => {

		const notFound = role => options.roles.indexOf(role) == -1

		if (notFound(role) || roles.some(notFound)) {
			throw new TypeError('Role not found in config.roles')
		}

		const roleIndex = options.roles.indexOf(role)

		return roles.some(role => options.roles.indexOf(role) >= roleIndex)
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
	const normalizePath = (url, fullUrl, params) => {

		if (!url && !fullUrl) {
			return ''
		}

		if (!fullUrl || fullUrl == url) {
			return url
		}

		if (validate.isObject(params)) {
			params = Object.keys(params).filter(i => params[i] !== undefined).length
		}

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
