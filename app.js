'use strict';

// Configure environment variables.
require('dotenv').config();

// Imports.
const express = require('express');
const bodyParser = require('body-parser');
const paypalCheckout = require('@paypal/checkout-server-sdk');

// Middleware for enabling async routes with Express.
const asyncMiddleware = fn => (req, res, next) => {
	Promise.resolve(fn(req, res, next))
  .catch(next);
};

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

// Field variables.
let client;

// Redirect visitors to the dashboard.
app.get('/', function (req, res) {
	res.render('dashboard', {
		clientID: process.env.PAYPAL_CLIENT_ID
	});
});

app.post('/create-transaction', asyncMiddleware(async (req, res, next) => {
	const request = new paypalCheckout.orders.OrdersCreateRequest();
	request.prefer('return=representation');
	request.requestBody({
		intent: 'CAPTURE',
		purchase_units: [{
			amount: {
				currency_code: 'USD',
				value: '22.00'
			}
		}]
	});

	let order;
	try {
		order = await client.execute(request);
	} catch (err) {
		// Handle any errors from the call
		console.error(err);
		return res.send(500);
	}

	// Return a successful response to the client with the order ID
	res.status(200).json({
		orderID: order.result.id
	});
}));

app.post('/approve-transaction', asyncMiddleware(async (req, res, next) => {
	const orderID = req.body.orderID;

	const request = new paypalCheckout.orders.OrdersCaptureRequest(orderID);
	request.requestBody({});

	try {
		const capture = await client.execute(request);
		console.log(capture);
		res.sendStatus(200);
	}	catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
}));

// Launch the application and begin the server listening.
app.listen(PORT, function () {
	console.log(APPLICATION, 'listening on port', PORT);

	let clientID = process.env.PAYPAL_CLIENT_ID;
	let clientSecret = process.env.PAYPAL_CLIENT_SECRET;
	let environment = new paypalCheckout.core.SandboxEnvironment(clientID, clientSecret);
	client = new paypalCheckout.core.PayPalHttpClient(environment);
});
