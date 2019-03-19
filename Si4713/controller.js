//Libraries

console.log("initializing Si4713lib");
console.log("requiring constants");
const LibConstants = require("./const.js");
const lC = LibConstants; //shorthand

console.log("requiring common lib");
const LibCommon = require("../common.js");

console.log("requiring fakeGPIO lib");

class Si4713Driver extends LibCommon.device {
	constructor(pin = -1) {
		super(("Si4713#"+Math.random().toFixed(3)*1000), 1); //call super to set parameters

		this.resetpin = pin;
	}
	begin(addr = lC.SI4710_ADDR1) {
		console.log("begin called w/addr "+addr);
		this.i2caddr = addr;

		this.reset();
		this.powerUp();
	}
	reset() {

	}
}

module.exports = Si4713Driver;