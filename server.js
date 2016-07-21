var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt');

var app = express();
var port = process.env.PORT || 3000;
var todoNextId = 1;


app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('ToDo API root');
});


//GET /todos?completed=true&q=sageHar
app.get('/todos', function(req, res) {
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.json(todos);
	}).catch(function(e) {
		res.status(500).send();
	})

});

//GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function(todo) {
		if (!!todo) {
			res.json(todo);
		} else {
			res.status(404).send();
		}

	}).catch(function(e) {
		res.status(500).json(e);
	})

});

//----------------------------------------------
//----------------------------------------------

//POST /todos
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}).catch(function(e) {
		res.status(400).json(e)
	});

});

//----------------------------------------------
//----------------------------------------------

//DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function(numOfDeletes) {
		if (numOfDeletes === 0) {
			res.status(404).json({
				error: 'No Todo with that id'
			});
		} else {
			res.status(204).send();
		}
	}).catch(function(e) {
		res.status(500).send();
	})
});


//----------------------------------------------
//----------------------------------------------

//PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id);
	var body = _.pick(req.body, 'description', 'completed');

	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	db.todo.findById(todoId).then(function(todo) {
		if (todo) {
			todo.update(attributes).then(function(todo) {
				res.json(todo.toJSON())
			}, function(e) {
				res.status(400).send(e);
			})
		} else {
			res.status(404).send();
		}
	}, function() {
		res.status(500).send();
	})
});


//--------------------------------------------------------
//--------------------------------------------------------


// POST /users
app.post('/users', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function(user) {
		res.json(user.toPublicJSON());
	}).catch(function(e) {
		res.status(400).json(e);
	})
});

// POST /users/login
app.post('/users/login', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.authenticate(body).then(function(user) {

		var token = user.generateToken('authentication');
		if (token) {
			res.header('Auth', token).json(user.toPublicJSON());
		} else {
			res.status(401).send();
		}

	}).catch(function(e) {
		res.status(401).send();
	});
})

db.sequelize.sync({
	force: true
}).then(function() {
	app.listen(port, function() {
		console.log('Express is listening on port ' + port + '!');
	});
});