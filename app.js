// Configure environment variables.
require('dotenv').config();

// Imports.
const express = require('express');
const bodyParser = require('body-parser');

// Application setup.
const app = express();
app.use(express.static('static'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// Parsing out environment variables.
const APPLICATION = process.env.APPLICATION;
const PORT = process.env.PORT;

// Redirect visitors to the dashboard.
app.get('/', function (req, res) {
	res.render('dashboard', {
		clientID: process.env.PAYPAL_CLIENT_ID
	});
});

// Launch the application and begin the server listening.
app.listen(PORT, function () {
	console.log(APPLICATION, 'listening on port', PORT);
});
