var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var port = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;


app.use(bodyParser.json());


app.get('/', function (req, res) {
	res.send('ToDo API root');
});


//GET /todos
app.get('/todos', function(req, res) {
	res.json(todos);
});

//GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
	// res.send('Asking for todo with id: ' + todoId);
});

//----------------------------------------------
//----------------------------------------------

//POST /todos
app.post('/todos', function(req, res) {
	var body = req.body;
	// console.log("Description: " + body.description);
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

	body.id = todoNextId;
	todoNextId++;
	todos.push(body);

	res.json(body);
});



app.listen(port, function() {
	console.log('Express is listening on port ' + port + '!');
});