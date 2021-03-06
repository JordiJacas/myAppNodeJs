
var express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express()
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

app.use(cors());

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var form = {
  usr: 'pwd',
	usr2: 'pwd2'
};

var isIncorrect = false;


app.set('view engine', 'ejs');

// POST /login gets urlencoded bodies
app.post('/login', urlencodedParser, function (req, res) {
	var username = req.body.username;
	var password = req.body.password

	if (!req.body) return res.sendStatus(400)

	if(form[req.params.username] == req.params.password){
		res.send('welcome, ' + username);
	}

	isIncorrect = true;

	return res.redirect('/');

})

app.get('/', (req, res) => {
  res.render('index', {foo: 'FOO'});

  if(isIncorrect) res.send('Login Incorrect');
});

app.get('/api/login/:username/:password', function (req, res){
    var json = {};

    if(form[req.params.username] == req.params.password){
      json.satatus = "OK";
      res.send(json);
      return;
    }

    json.satatus = "ERROR";
    res.send(json);
});

app.get('/db/api/login/:username/:password', async (req, res) => {
    var json = {};
    var username = req.params.username;
    var password = req.params.password;
    try {
      const client = await pool.connect()
      const result = await client.query("SELECT * FROM test_table WHERE name='"+username+"' AND password='"+password+"'");
      const results = result.rows;
      json.username = username;
      json.password = password;
      //res.render('pages', results );
      if(results[0] != null) {
        json.status = "OK";
      } else {
        json.status = "ERROR";
      }
      res.send(json);
      //res.send(JSON.stringify(results[0].name));
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

app.listen(process.env.PORT || 5000, () => console.log('Example app listening on port 5000!'));
