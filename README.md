

# ![Express Auth and ACL](assets/logo_32.png) AuthTheWall

`AuthTheWall` is a middleware for express with supports to the Bearer Authentication and ACL (Access Control List).


### Motivation
Validate requests is a common and often tedious thing! AuthTheWall was built to facilitate basic validations and to be flexible for complex things.

### Quick Start

```
npm install auth-the-wall --save
```

### Getting Started

Create an instance and pass the settings by parameter:

```
import Auth from 'auth-the-wall'

const auth = Auth({
	privateKey: '0GoGzOdDNuUOitQuxmIR1TOHOEbOmYHB',
	expiresIn: '2 days',
	hierarchy: false,
	roles: [
		'admin',
		'manager',
		'editor'
	],
	acl: [
		{
			routes: '/posts/:id',
			methods: ['PUT', 'DELETE'],
			roles: ['editor'],
			rules: []
		}
	]
})

```

Now use the middleware in your routes:
```
app.delete('/posts/:id', auth.middleware, (req, res) => {
    console.log(req.user)
})
```


### Add Resource
You can add routes at any time by using the instance:
```
import Auth from 'auth-the-wall'
const auth = Auth({ ... })

auth.addResources([
	{
		routes: ['/managers/:id?'],
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		roles: ['admin'],
		rules: []
	}
])
```

### Create Your Rules

By default we will only validate for groups (see more in group session), but in many cases you will need more than that, for example, you want to ensure that users of the "editor" group can only manage their posts, then make a method that does the validation and push in acl.rules, see an example:

```
import AuthTheWall, {AuthTheWallError} from 'auth-the-wall'

const auth = Auth({ ... })

const postBelongsToEditor = async ({req, res}) => {

	const isOwner = await model.Post.findOne({
		where : {
			id: req.params.id,
			userId: req.user.id
		}
	})

	if (!isOwner) {
		throw new AuthTheWallError('Permission denied', 401)
	}

	// Attention, return the parameters so that the next rules have access to parameters!
	return {req, res}
}

auth.addResources([
	{
		routes: ['/auth/:id?'],
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		roles: ['admin'],
		rules: [
			postBelongsToEditor
		]
	}
])
```

>**Attention:**
- acl.rules must be an array
- each function must receive and return {res, req}
- for errors use the class AuthTheWallError: `throw new AuthTheWallError('Permission denied', 401)`


### Bearer Authentication

You need to define **at least ** an id and role in the token creation:

```
import Auth from 'auth-the-wall'
const auth = Auth({ ... })

const token = auth.token.set({
	id: 1,
	role: 'admin',
	other: '...'
})
```

Send the token to the client. Now the client will have access to the restricted area, just pass the token in the request:

**CLIENT SIDE**
```
axios.get(endpoint, {
	headers: {
		Authorization: 'Bearer ${TOKEN}'
	}
})
```

Requests that contains a valid Header Authorization will allow access to the data in the token inside: `req.user:`


```
app.use('/posts/:id', auth.middleware, (req, res) => {
	console.log(req.user) // result: { id: 1, role: 'admin', other: '...'}
})
```

### Properties

- **privateKey**: the secret key used to create the token.

- **expiresIn**: number of seconds or string of time span [zeit/ms](https://github.com/zeit/ms).
  > Eg: `60`, `"2 days"`, `"10h"`, `"7d"`. A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds unit is used by default (`"120"` is equal to `"120ms"`).

- **roles**: User groups. The sooner, more permissions. Each item is inherited from the next item.
  > Eg: ´['admin', 'manager', 'editor']` admin inherited permissions of manager, then manager inherited of editor.

- **acl**: Array of objects containing rules by routes:

	- **routes**: the path used to compare permissions (possibility to use array)
	```
	routes: ['/posts/:id', '/posts/:id?/comments/:id?']
	app.use('/posts/:id?', auth.middleware, (req, res) => {})
	app.use('/posts/:id?/comments/:id?', auth.middleware, (req, res) => {})			
	```

	- **methods**: HTTP methods
	```
	methods: ['POST', 'PUT', 'DELETE']
	```

	- **roles**: Groups that have access to routes
	```
 	roles: ['manager'] // manager and admin will be allowed
	```

	- **rules**: Custom validations, pass an array with functions
	```
	rules: [
		async ({req, res}) => {

		   const isOwner = await model.Post.findOne({
			   where : {
				   id: req.params.id,
				   userId: req.user.id
			   }
		   })

		   if (!isOwner) {
			   // Use AuthTheWallError(youMessage, statusCode)
			   throw new AuthTheWallError('Permission denied', 401)
		   }

		   // Attention, return the entry so that the next rules have access to the parameters
		   return {req, res}
	   }
	]
	```

***

#### License
Copyright (c) 2019 Willy Chagas
Licensed under the [MIT license](LICENSE).


***

Project created by [Willy Chagas](https://atah.com.br).
