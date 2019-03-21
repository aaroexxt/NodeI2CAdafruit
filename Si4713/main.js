let runReal = process.argv[2] == "true";

const driver = require("./controller.js");
const scannerLib = require("../scanner.js");


const radio = new driver(26, runReal);
const scanner = new scannerLib(runReal);

scanner.scan(0x3, 0x77).then( () => { //needs to happen before device begin/end because it locks up the i2c bus
	radio.begin();
})
.catch( e => {
	console.error("Error scanning: "+e);
})



setTimeout( () => {
	console.log("terminating device");
	radio.end();
}, 5000);