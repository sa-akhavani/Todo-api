var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var todos = [{
	id: 1,
	description: 'Meet Mom',
	completed: 'false'
}, {
	id: 2,
	description: 'Buy Milk',
	completed: 'false'	
}, {
	id: 3,
	description: 'Feed Dog',
	completed: 'true'	
}];


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
	var matchedTodo;

	todos.forEach(function (todo) {
		if (todo.id === todoId)
			matchedTodo = todo;
	});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
	// res.send('Asking for todo with id: ' + todoId);
});

app.listen(port, function() {
	console.log('Express is listening on port ' + port + '!');
});