import {assert, expect, should} from 'chai'
import httpMocks from 'node-mocks-http'
import {ROLES} from './constants'
import Auth, {AuthTheWallError} from '../src/'


describe('Auth', function() {

	it("Accept only parameter object with roles, expiresIn and privateKey property", function() {

		expect(() => Auth()).to.throw(TypeError)

		expect(() => {
			return Auth({
				roles: ROLES,
				privateKey: 'abc',
			})
		}).to.throw(TypeError)

		expect(() => {
			return Auth({
				expiresIn: '2days'
			})
		}).to.throw(TypeError)
	})


	it("Add acl on create", function() {

		const auth = Auth({
			roles: ROLES,
			privateKey: 'abc',
			expiresIn: '2 days',
			acl: [
				{
					routes: '/post/',
					methods: ['POST'],
					roles: ['editor']
				},
				{
					routes: '/users/',
					methods: ['POST', 'DELETE', 'PUT', 'GET'],
					roles: ['admin']
				}
			]
		})

		expect(auth.acl.get()).to.be.an('array')
		expect(auth.acl.get()).to.have.length(2)
	})

	it("Expose modules", function() {
		expect(AuthTheWallError).to.be.an('function')
	})

})
