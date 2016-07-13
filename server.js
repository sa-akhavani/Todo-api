var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var todos = [{
	id: '1',
	description: 'Meet Mom',
	completed: 'false'
}, {
	id: '2',
	description: 'Buy Milk',
	completed: 'false'	
}];


app.get('/', function (req, res) {
	res.send('ToDo API root');
});


//GET /todos
app.get('/todos', function(req, res) {
	res.json(todos);
});

//GET /todos/:id

app.listen(port, function() {
	console.log('Express is listening on port' + port + '!');
});