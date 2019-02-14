import {assert, expect, should} from 'chai'
import httpMocks from 'node-mocks-http'
import {ROLES} from './constants'
import Auth from '../src/'


describe('Auth', function() {

	it("Accept only parameter object with roles, expireIn and secret property", function() {

		expect(() => Auth.create()).to.throw(TypeError)

		expect(() => {
			return Auth.create({
				roles: ROLES,
				secret: 'abc',
			})
		}).to.throw(TypeError)

		expect(() => {
			return Auth.create({
				expireIn: '2days'
			})
		}).to.throw(TypeError)
	})

})
