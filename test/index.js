import {assert, expect, should} from 'chai'
import httpMocks from 'node-mocks-http'
import {ROLES} from './constants'
import Auth, {AuthTheWallError} from '../src/'


describe('Auth', function() {

	it("Accept only parameter object with roles, expiresIn and privateKey property", function() {

		expect(() => Auth.create()).to.throw(TypeError)

		expect(() => {
			return Auth.create({
				roles: ROLES,
				privateKey: 'abc',
			})
		}).to.throw(TypeError)

		expect(() => {
			return Auth.create({
				expiresIn: '2days'
			})
		}).to.throw(TypeError)
	})

	it("Expose modules", function() {
		expect(AuthTheWallError).to.be.an('function')
	})

})
