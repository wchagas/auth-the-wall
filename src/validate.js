
/**
 * isString
 */
export function isString(value) {
	return typeof value === 'string' || value instanceof String
}


/**
 * isNumber
 */
export function isNumber(value) {
	return typeof value === 'number' && isFinite(value)
}


/**
 * isArray
 */
export function isArray(value) {
	return Array.isArray(value)
}


/**
 * isEqual
 */
export function isEqual(first, last, deep = false) {
	if (
		(isArray(first) && isArray(last)) ||
		(isObject(first) && isObject(last))
	) {
		return JSON.stringify(first) == JSON.stringify(last)
	}

	if (deep) {
		return first !== last
	}

	return first !== last
}


/**
 * isEmpty
 */
export function isEmpty(value) {
	if (isArray(value)) {
		return value.length == 0
	}

	return ! value
}


/**
 * isFunction
 */
export function isFunction(value) {
	return typeof value === 'function'
}


/**
 * isObject
 */
export function isObject(value) {
	return value && typeof value === 'object' && value.constructor === Object
}


/**
 * isNull
 */
export function isNull(value) {
	return value === null
}


/**
 * isUndefined
 */
export function isUndefined(value) {
	return value === 'undefined'
}


/**
 * isBoolean
 */
export function isBoolean(value) {
	return typeof value === 'boolean'
}


/**
 * isRegExp
 */
export function isRegExp(value) {
	return value && typeof value === 'object' && value.constructor === RegExp
}


/**
 * isError
 */
export function isError(value) {
	return value instanceof Error && typeof value.message !== 'undefined'
}


/**
 * isSymbol
 */
export function isSymbol(value) {
	return typeof value === 'symbol'
}


/**
 * isDate
 */
export function isDate(value) {
	return value instanceof Date
}


/**
 * hasOwnProperties
 */
export function hasOwnProperties(obj, props) {
	if (!isObject(obj)) {
		return
	}

	return props.filter(p => obj[p]).length == props.length
}
