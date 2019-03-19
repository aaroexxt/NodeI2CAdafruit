//Libraries

console.log("initializing Si4713lib");
console.log("requiring constants");
const LibConstants = require("./const.js");
const lC = LibConstants; //shorthand

console.log("requiring common lib");
const LibCommon = require("../common.js");

console.log("requiring fakeGPIO lib");
const GPIO = require("./fakeGPIO.js").Gpio;

console.log("requiring I2C lib");
const I2C = require('i2c-bus');
const i2cInterface = I2C.openSync(1);
const iI = i2cInterface; //shorthand

class Si4713Driver extends LibCommon.device {
	constructor(pin = -1) {
		this.i2cBuffer = []; //instantiate new i2c buffer

		super(("Si4713#"+Math.random().toFixed(3)*1000), 1); //call super to set parameters

		this.resetpin = pin;
		this.resetGPIO = new GPIO(this.resetpin, "out"); //create the pin
	}
	begin(addr = lC.SI4710_ADDR1) {
		console.log("begin called w/addr "+addr);
		this.i2caddr = addr;

		this.reset();
		this.powerUp();

		//check for chip
		
	}
	reset() {
		if (this.resetpin > 0) { //ensure that pin was created correctly
			this.resetGPIO.writeSync(1);
			setTimeout( () => {
				this.resetGPIO.writeSync(0);
				setTimeout( () => {
					this.resetGPIO.writeSync(1);
				}, 10);
			},10);
		}
	}
	powerUp() {
		
	}
	setupBuffer(buffer = []) {
		this.i2cBuffer = buffer;
	}
}

module.exports = Si4713Driver;