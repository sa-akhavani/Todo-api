var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var port = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;


app.use(bodyParser.json());



app.get('/', function(req, res) {
	res.send('ToDo API root');
});


//GET /todos?completed=true&q
app.get('/todos', function(req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;


	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		var filteredTodos = _.where(todos, {
			completed: true
		})
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		var filteredTodos = _.where(todos, {
			completed: false
		})
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function(todo) {
			if (todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) != -1)
				return todo;
		});
	}

	res.json(filteredTodos);
});

//GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
});

//----------------------------------------------
//----------------------------------------------

//POST /todos
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

	body.description = body.description.trim()

	body.id = todoNextId;
	todoNextId++;
	todos.push(body);

	res.json(body);
});

//----------------------------------------------
//----------------------------------------------

//DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});

	if (!matchedTodo) {
		res.status(404).json({
			"error": "No todo found with that id"
		})
	} else {
		todos = _.without(todos, matchedTodo);
		res.status(200).send(matchedTodo)
	}
});


//----------------------------------------------
//----------------------------------------------

//PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});
	if (!matchedTodo) {
		return res.status(404).send();
	}

	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);

});



app.listen(port, function() {
	console.log('Express is listening on port ' + port + '!');
});
