
var express = require('express');
var bodyParser = require('body-parser')
var app = express()

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var form = {
	username: 'usr',
	password: 'pwd'
};

var isIncorrect = false;


app.set('view engine', 'ejs');

// POST /login gets urlencoded bodies
app.post('/login', urlencodedParser, function (req, res) {
	var username = req.body.username;
	var password = req.body.password

	if (!req.body) return res.sendStatus(400)

	if(username == form.username & password == password){
		res.send('welcome, ' + username);
	}

	isIncorrect = true;

	return res.redirect('/');
	
})

app.get('/', (req, res) => {
  res.render('index', {foo: 'FOO'});

  if(isIncorrect) res.send('Login Incorrect');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));