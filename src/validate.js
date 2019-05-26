
/**
 * isString
 */
function isString(value) {
	return typeof value === 'string' || value instanceof String
}


/**
 * isNumber
 */
function isNumber(value) {
	return typeof value === 'number' && isFinite(value)
}


/**
 * isArray
 */
function isArray(value) {
	return Array.isArray(value)
}


/**
 * isEqual
 */
function isEqual(first, last, deep = false) {
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
function isEmpty(value) {
	if (isArray(value)) {
		return value.length == 0
	}

	return ! value
}


/**
 * isFunction
 */
function isFunction(value) {
	return typeof value === 'function'
}


/**
 * isObject
 */
function isObject(value) {
	return value && typeof value === 'object' && value.constructor === Object
}


/**
 * isNull
 */
function isNull(value) {
	return value === null
}


/**
 * isUndefined
 */
function isUndefined(value) {
	return value === 'undefined'
}


/**
 * isBoolean
 */
function isBoolean(value) {
	return typeof value === 'boolean'
}


/**
 * isRegExp
 */
function isRegExp(value) {
	return value && typeof value === 'object' && value.constructor === RegExp
}


/**
 * isError
 */
function isError(value) {
	return value instanceof Error && typeof value.message !== 'undefined'
}


/**
 * isSymbol
 */
function isSymbol(value) {
	return typeof value === 'symbol'
}


/**
 * isDate
 */
function isDate(value) {
	return value instanceof Date
}


/**
 * hasOwnProperties
 */
function hasOwnProperties(obj, props) {
	if (!isObject(obj)) {
		return
	}

	return props.filter(p => obj[p]).length == props.length
}


module.exports = {
	isString,
	isNumber,
	isArray,
	isEqual,
	isEmpty,
	isFunction,
	isObject,
	isNull,
	isUndefined,
	isBoolean,
	isRegExp,
	isError,
	isSymbol,
	isDate,
	hasOwnProperties
}
