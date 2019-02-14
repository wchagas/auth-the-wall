export default function AuthError(message = '', statusCode = 500) {
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name
	this.message = message
	this.statusCode = statusCode
}
