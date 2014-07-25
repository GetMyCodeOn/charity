var mongo = require('mongodb');

var Server = mongo.Server, 
	Db = mongo.Db, 
	BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('projectsdb', server);

db.open(function(err, db) {
	if(!err) {
		console.log("Connected to 'projectsdb' database");
		db.collection('projects', {strict:true}, function(err, collection) {
			if (err) {
				console.log("The 'projects' collection does not exist. Creating it with sample data");
				populateDB();
			}
		});
	}
});


exports.findById = function(req, res) {
	console.log('Retrieving project ' + id);
	db.collection('projects', function(err, collection) {
		collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, item) {
			res.send(item);
		});
	});
};

exports.findAll = function(req, res) {
    db.collection('projects', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};


exports.addProject = function(req, res) {
	var project = req.body;
	console.log('Adding project: ' + JSON.stringify(project));
	db.collection('projects', function(err, collection) {
		collection.insert(project, function(err, result) {
			if (err) {
				res.send({'error': 'Wow, this is awkward, our pet monkey has escaped and stolen the spanner we use to fix Askes bike and our server'});
			}
			else {
				console.log('Huzzaaa: ' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
};

exports.updateProject = function(req, res) {
	var id = req.params.id;
	var project = req.body;
	console.log('Updating project ' + id);
	console.log(JSON.stringify(project));
	db.collection('projects', function(err, collection) {
		collection.update({'_id': new BSON.ObjectID(id)}, project, function(err, result) {
			if(err) {
				console.log('Dang it, something went wrong when updating project: ' + err);
				res.send({'error': 'Something went wrong'});
			} else {
				console.log('' + result + ' document(s) updated');
				res.send(project);
			}
		});
	});
};

exports.deleteProject = function(req, res) {
	var id = req.params.id;
	console.log('Deleting project: ' + id);
	db.collection('projects', function(err, collection) {
		collection.remove({'_id': new BSON.OBJECTID(id)}), function(err, result) {
			if (err) {
				res.send({'error': 'An error has occurred - ' + err});
			}
			else {
				console.log('' + result + 'document(s) deleted');
				res.send(req.body);
			}
		};
	});
};



//--------------------------------------------------------------------------------------------------------------------*/
//fills database with fake database, if there is no data in it.
//Will only run once. 

var populateDB = function() {
 
    var projects = [
    {
        name: "Donkey Sanctuary",
        description: "A fantastic opportunity to help build a donkey spa to give the donkeys at Kent donkey sanctuary a touch of the luxury",
        duration: "3 weekends",
        people: "5*3 hours",
        date: "5th of August",
        ressources: "3 shovels, 4 donkey nail files", 
        location: "Kent Donkey Sanctuary", 
        charity: "Donkey'R'Us",
        picture: "saint_cosme.jpg"
    },
    {
        name: "Surprise Spider Petting Zoo",
        description: "A hands on project to help build a surprise Spider Petting Zoo at King's Cross Station to give unwitting commuters the opportunity to discover the love of spider petting, they didn't even know they had", 
        duration: "5 workdays",
        people: "10*4 hours",
        date: "Month of August",
        ressources: "Spiders, slingshots, and spider food",
        location: "King's Cross Station", 
        charity: "Spidertouchers",
        picture: "saint_cosme.jpg"
    }];
 
    db.collection('projects', function(err, collection) {
        collection.insert(projects, function(err, result) {});
    });
 
};