//---------CONFIG AND LIBRARIES-----------------

//Requiring express library
const express = require('express')
//Initialising express library
const app = express()

//Requiring file system library
const fs = require('fs');

//Requiring body parser library
//This adds a body property to the request parameter of every app.get and app.post
const bodyParser = require('body-parser');
//Initialising body-parser library
app.use('/', bodyParser())
app.use(bodyParser.urlencoded({
	extended: false
}))

//Setting PUG view engine
app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));

//Requiring postgres library
const pg = require('pg')

//------ROUTES-------

app.get('/', function(req, res){
	res.render("addmessage");
})

//---POSTGRES CONNECTION------

var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard';

//----WRITE MESSAGES IN DB------

app.post('/', function(req, res){
	
	var inputtitle = req.body.title;
	var inputmessage = req.body.message;

	console.log("This is what I receive from the form: "+inputtitle+" "+inputmessage);

	pg.connect(connectionString, function (err, client, done){
		
		if(err){
			console.log(err);
		}
		
		//INSERT USER INFO
		client.query(`INSERT INTO messages 
					(title, body) 
					VALUES ($1, $2)`, 
					[inputtitle, inputmessage], function(err, users){
					if(err){
						console.log(err);
					}
			console.log("User info got inserted");
			done();
			pg.end();
		});
	});
})

//-------SHOW ALL MESSAGES IN /ALLMESSAGES

app.get('/allmessages', function(req, res){
	
	pg.connect(connectionString, function (err, client, done){
		
		if(err){
			throw(err);
		}
		
		//INSERT USER INFO
		client.query(`SELECT * FROM messages`,
					function(err, messages){
					var output = messages.rows;
			console.log("This is the output: "+output);
			res.render("allmessages", {info: output})
			done();
			pg.end();
		});
	});
})

//------------DEFINING PORT 8080 FOR SERVER----------------------
var server = app.listen(8080, () => {
	console.log('Yo, this http://localhost is running:' + server.address().port);
});
