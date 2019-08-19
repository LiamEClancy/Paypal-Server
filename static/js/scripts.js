// A function which asynchronously sets up the page.
let setup = async function (config) {
};

// Parse the client-side configuration file and pass to setup.
$.getJSON('js/config.json', function (config) {
	setup(config);
});
