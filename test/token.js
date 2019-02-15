import {assert, expect, should} from 'chai'
import httpMocks from 'node-mocks-http'
import AuthError from '../src/AuthError'
import {ROLES} from './constants'
import Auth from '../src/'

const middlewareTest = Auth({
	roles: ROLES,
	privateKey: 'abc',
	expiresIn: '1min',
})

const middlewareTestExpiredToken = Auth({
	roles: ROLES,
	privateKey: 'abc',
	expiresIn: '0ms',
})


describe('Token', function() {


	it("Token malformed", function() {
		expect(() => middlewareTest.token.get('tests')).to.throw().and.to.satisfy((err) => {
		  return err.name === 'AuthError' && err.statusCode === 401;
		})
	})



	it("Invalid token", function() {
		const expiredToken = middlewareTestExpiredToken.token.set({
			id: 1,
			role: 'admin'
		})
		expect(() => middlewareTestExpiredToken.token.get(expiredToken)).to.throw().and.to.satisfy((err) => {
		  return err.name === 'AuthError' && err.statusCode === 401;
		})
	})



	it("Get token data", function() {
		const token = middlewareTest.token.set({
			id: 1,
			role: 'admin'
		})

		const tokenData  = middlewareTest.token.get(token)

		expect(tokenData).to.be.an('object')
		expect(tokenData).to.have.property('id', 1)
		expect(tokenData).to.have.property('role', 'admin')
	})

})
