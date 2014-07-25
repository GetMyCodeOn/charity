/*var http = require('http');
http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');

}).listen(3000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');
*/

var express = require('express'), 
	projects = require('./routes/projects');

var app = express(),
	stylus = require('stylus'),
  	nib = require('nib');

 function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(stylus.middleware(
  { src: __dirname + '/public', compile: compile
  }
));
app.use(express.static(__dirname + '/public'));

//line 14--32 are new additions

app.configure(function () {
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
});

app.get('/', function (req, res) {
  res.render('index',
  { title : 'Home' }
  );
});

app.get('/projects', projects.findAll);
app.get('/projects/:id', projects.findById);
app.post('/projects', projects.addProject);
app.put('/projects:id', projects.updateProject);
app.delete('/projects:id', projects.deleteProject);

app.listen(3000);
console.log('listening on port 3000');