import {assert, expect, should} from 'chai'
import httpMocks from 'node-mocks-http'
import {ROLES} from './constants'
import Auth from '../src/'

describe('Acl', function() {


	it("Get Auth is a function and return an array", function() {
		const auth = Auth({
			roles: ROLES,
			privateKey: 'abc',
			expiresIn: 'abc',
		})
		expect(auth.acl.get).to.be.an('function')
		expect(auth.acl.get()).to.be.an('array')
	})



	it("Error if pass invalid params", function() {
		const auth = Auth({
			roles: ROLES,
			privateKey: 'abc',
			expiresIn: 'abc',
		})

		expect(auth.acl.add).to.be.an('function')
		expect(() => auth.acl.add()).to.throw(TypeError)
		expect(() => auth.acl.add([])).to.throw(TypeError)
	})



	it("Error if not pass required properties", function() {
		const auth = Auth({
			roles: ROLES,
			privateKey: 'abc',
			expiresIn: 'abc',
		})

		expect(() => {
			return auth.acl.add([
				{
					// empty
				}
			])
		}).to.throw(TypeError)
	})



	it("Add acl and return all data", function() {
		const auth = Auth({
			roles: ROLES,
			privateKey: 'abc',
			expiresIn: 'abc',
		})

		const aclAdded = auth.acl.add([
			{
				routes: '/post/',
				methods: ['POST'],
				roles: ['guest', 'editor', 'admin']
			}
		])

		expect(aclAdded).to.be.an('array')
		expect(aclAdded).to.have.length(1)
	})




	it("Get acl", function() {
		const auth = Auth({
			roles: ROLES,
			privateKey: 'abc',
			expiresIn: 'abc',
		})

		auth.acl.add([
			{
				routes: '/post/',
				methods: ['POST'],
				roles: ['guest', 'editor', 'admin']
			}
		])

		expect(auth.acl.get).to.be.an('function')
		expect(auth.acl.get()).to.be.an('array')
		expect(auth.acl.get()).to.have.length(1)
	})




	it("Find ", function() {
		const auth = Auth({
			roles: ROLES,
			privateKey: 'abc',
			expiresIn: 'abc',
		})

		const add = [
			{
				routes: '/post/',
				methods: ['POST'],
				roles: ['guest', 'editor', 'admin']
			},
			{
				routes: ['/post/', '/post/:id'],
				methods: ['GET', 'POST'],
				roles: ['editor', 'admin']
			}
		]

		const req = {
			route: {
				path: '/:id'
			},
			originalUrl: '/post/1',
			params: {id:1},
			query: {}
		}

		auth.acl.add(add)

		req.method = 'POST'
		const finded = auth.acl.find(req)
		expect(finded).to.eql(add[1])

		req.method = 'DELETE'
		const notFound = auth.acl.find(req)
		expect(notFound).to.equal(false)
	})




	it("HasPermission", function() {
		const auth = Auth({
			roles: ROLES,
			privateKey: 'abc',
			expiresIn: 'abc',
		})


		const rules = [
			{
				routes: '/post/',
				methods: ['POST'],
				roles: ['guest', 'editor']
			},
			{
				routes: ['/post/', '/post/:id'],
				methods: ['GET', 'POST'],
				roles: ['editor'],
				hierarchy: false,
				rules: [
					(res) => res,
					(res) => res,
				]
			}
		]

		auth.acl.add(rules)

		const first = auth.acl.find({
			route: {
				path: '/'
			},
			originalUrl: '/post/',
			params: {},
			query: {},
			method: 'POST'
		})

		const last = auth.acl.find({
			route: {
				path: '/:id'
			},
			originalUrl: '/post/1',
			params: {id:1},
			query: {},
			method: 'POST'
		})

		expect(auth.acl.hasPermission(rules[0], 'editor', first.roles)).to.equal(true)
		expect(auth.acl.hasPermission(rules[0], 'guest', first.roles)).to.equal(true)

		expect(auth.acl.hasPermission(rules[1], 'admin', first.roles)).to.equal(false)
		expect(auth.acl.hasPermission(rules[1], 'editor', first.roles)).to.equal(true)
	})



	it("Normalize path", function() {

		const auth = Auth({
			roles: ROLES,
			privateKey: 'abc',
			expiresIn: 'abc',
		})

		expect(auth.acl.normalizePath('/users/:id', '/users/2/', 1)).to.equal('/users/:id')
		expect(auth.acl.normalizePath('/admin/users/:id', '/admin/users/2', 1)).to.equal('/admin/users/:id')

		expect(auth.acl.normalizePath('/:id', '/users/2', 1)).to.equal('/users/:id')
		expect(auth.acl.normalizePath('/:id', '/admin/users/2', 1)).to.equal('/admin/users/:id')
		expect(auth.acl.normalizePath('/:id/', '/admin/users/2/', 1)).to.equal('/admin/users/:id/')
		expect(auth.acl.normalizePath('/:id', '')).to.equal('/:id')
		expect(auth.acl.normalizePath('/:id?/:slug?', '/users/2/2/', 2)).to.equal('/users/:id?/:slug?')
		expect(auth.acl.normalizePath('/:id?/:slug?', '/users/2', 1)).to.equal('/users/:id?/:slug?')
		expect(auth.acl.normalizePath('/:id?/:slug?', '/admin/users/', 0)).to.equal('/admin/users/:id?/:slug?')
	})

})
