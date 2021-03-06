import request from 'supertest'
import {assert, expect, should} from 'chai'
import httpMocks from 'node-mocks-http'
import express, {Router} from 'express'
import {ROLES} from './constants'
import AuthTheWall from '../src/'

const app = express()
const router = Router()

const auth = AuthTheWall.Auth({
	roles: ROLES,
	privateKey: 'abc',
	expiresIn: '1 min',
})

const validToken = auth.token.set({
	id: 1,
	role: 'admin'
})

const validEditorToken = auth.token.set({
	id: 1,
	role: 'editor'
})

const posts = {
	1: {
		id:1,
		user: {
			id: 1,
			role: 'editor'
		}
	},
	2: {
		id:2,
		user: {
			id: 1,
			role: 'editor'
		}
	},
	3: {
		id:3,
		user: {
			id: 2,
			role: 'editor'
		}
	},
}

const belongsToEditor = ({req, res, next}) => {

	const post = posts[req.params.id]

	if (!post || req.user.role != 'editor') {
		return req
	}

	if (post.user.id != req.user.id) {
		throw new AuthTheWall.AuthTheWallError(`You can't edit this post`, 401)
	}

	return {req, res, next}
}

auth.acl.add([
	// view single, show all for all users
	{
		routes: '/posts/',
		methods: ['GET'],
		roles: ['guest']
	},
	{
		routes: '/posts/:id',
		methods: ['GET'],
		roles: ['guest']
	},


	// put and edit
	// editor can only manage what he has created
	{
		routes: ['/posts/:id'],
		methods: ['PUT', 'DELETE'],
		roles: ['editor'],
		rules: [
			belongsToEditor
		]
	}
])





describe('Middleware', function() {


	it("Authorization with admin", function(done) {
		app.get('/posts/', auth.middleware, function(req, res) {
			res.status(200).json(req.user)
		})

		request(app)
			.get('/posts/')
			.set('Authorization', `Bearer ${validToken}`)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				expect(res.body).to.have.property('id', 1)
				expect(res.body).to.have.property('role', 'admin')
				if (err) done(err)
				done()
			})
	})




	it("Resource no belongs to user logged", function(done) {
		app.delete('/posts/:id', auth.middleware, function(req, res) {
			res.status(200).json(req.user)
		})

		request(app)
			.delete('/posts/3')
			.set('Authorization', `Bearer ${validEditorToken}`)
			.expect('Content-Type', /json/)
			.expect(401)
			.end(function(err, res) {
				expect(res.body).to.have.property('message', `You can't edit this post`)
				if (err) done(err)
				done()
			})
	})



})
