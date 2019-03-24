let runReal = process.argv[2] == "true";

const driver = require("./controller.js");
const scannerLib = require("../scanner.js");


const radio = new driver(26, runReal);
const scanner = new scannerLib(runReal);

scanner.scan(0x3, 0x77).then( () => { //needs to happen before device begin/end because it locks up the i2c bus
	radio.begin().then(connected => {
		if (connected) {
			console.log("Radio connected successfully!");

			console.log("Setting TX power");
			radio.setTXpower(115); //setting tx power
			radio.tuneFM(10190).then( () => {
				console.log("tuned successfully");

				console.log("Beginning RDS");
				radio.beginRDS();
				radio.setRDSStation("AaronRadio");
				radio.setRDSbuffer("Aaron's Radio Station Test");

				var current = 8750;
				var max = 10800;

				function measureFreq(f) {
					radio.readTuneMeasure(f).then( () => {
						console.log("Measuring "+f+"...");
						radio.readTuneStatus().then((status) => {
							console.log("currNoiseLevel: "+status.currNoiseLevel);
							current+=10;
							if (current < max) {
								measureFreq(current); //recurring
							}
						})
					})
				}

				measureFreq(current); //start scan
			}).catch( e => {
				console.error("tune failed, e="+e);
			});
		} else {
			console.log("Radio failed to connect, terminating :(");
			radio.end();
		}
	})
})
.catch( e => {
	console.error("Error scanning: "+e);
})