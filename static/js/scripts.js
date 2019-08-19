// A function which asynchronously sets up the page.
let setup = async function (config) {
	paypal.Buttons({

		// Set up the transaction
		createOrder: async function () {
			let data = await $.post('/create-transaction');
			return data.orderID;
		},

		// Capture the funds from the transaction
		onApprove: async function (data) {
			let status = await $.post('/approve-transaction', data);
			console.log(status);
			if (status === 'OK') {
				console.log('Transaction completed successfully.');
			} else {
				console.log('Transaction failed.');
			}
		}
	}).render('#paypal-button-container');
};

// Parse the client-side configuration file and pass to setup.
$.getJSON('js/config.json', function (config) {
	setup(config);
});
