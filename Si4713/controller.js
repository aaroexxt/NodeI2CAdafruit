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
const I2C = require('./fakeI2C.js');
const i2cInterface = I2C.openSync(1);
const iI = i2cInterface; //shorthand

class Si4713Driver extends LibCommon.device {
	constructor(pin = -1) {
		super(("Si4713#"+Math.random().toFixed(3)*1000), 1); //call super to set parameters

		this.i2cBuffer = []; //instantiate new i2c buffer

		this.resetpin = pin;
		this.resetGPIO = new GPIO(this.resetpin, "out"); //create the pin
	}
	begin(addr = lC.SI4710_ADDR1) {
		console.log("begin called w/addr "+addr);
		this.i2caddr = addr;

		this.reset()
		.then(() => this.powerUp().then(() => this.getRev().then(rev => console.log("CHIP REV (SHOULD BE 13)=="+rev))))
		.catch(e => console.error)

		//check for chip
		
	}
	reset() {
		return new Promise((resolve, reject) => {
			if (this.resetpin > 0) { //ensure that pin was created correctly
				this.resetGPIO.writeSync(1);
				setTimeout( () => {
					this.resetGPIO.writeSync(0);
					setTimeout( () => {
						this.resetGPIO.writeSync(1);
						return resolve();
					}, 10);
				},10);
			}
		})
	}
	powerUp() {
		return new Promise( (resolve, reject) => {
			// CTS interrupt disabled
		    // GPO2 output disabled
		    // Boot normally
		    // xtal oscillator ENabled
		    // FM transmit
			this.sendCommand([lC.SI4710_CMD_POWER_UP, 0x12, 0x50]); //send startup command

			// configuration! see page 254
		    this.setProperty(lC.SI4713_PROP_REFCLK_FREQ, 32768);  // crystal is 32.768
		    this.setProperty(lC.SI4713_PROP_TX_PREEMPHASIS, 0); // 74uS pre-emph (USA std)
		    this.setProperty(lC.SI4713_PROP_TX_ACOMP_GAIN, 10); // max gain?
		    //setProperty(SI4713_PROP_TX_ACOMP_ENABLE, 0x02); // turn on limiter, but no dynamic ranging
		    this.setProperty(lC.SI4713_PROP_TX_ACOMP_ENABLE, 0x0); // turn on limiter and AGC

		    setTimeout( () => resolve(), 100);
		})
	}
	setProperty(property, value) {
		console.log("set property: "+property+", value: "+value);
		this.sendCommand([
			lC.SI4710_CMD_SET_PROPERTY,
   			0,
    		property >> 8,
    		property & 0xFF,
    		value >> 8,
    		value & 0xFF
		])
	}
	sendCommand(buffer = -1) {
		if (typeof buffer != "number") {
			this.i2cBuffer = buffer;
		}

		for (let i=0; i<this.i2cBuffer.length; i++) {
			console.log("sending i2c command: "+this.i2cBuffer[i]);
		}
		
		iI.i2cWriteSync(this.i2caddr, this.i2cBuffer.length, this.i2cBuffer); //writes buffer to i2c addr
	}
	getRev() {
		return new Promise( (resolve, reject) => {
			this.sendCommand([lC.SI4710_CMD_GET_REV,0]); //request rev

			setTimeout( () => {
				let buffer = [0,0,0,0,0,0,0,0,0];
				iI.i2cReadSync(this.i2caddr, 9, buffer); //read into buffer

			    //do nothing with first buffer byte
			    let pn = buffer[1];
			    let fw =  buffer[2];
			    fw <<= 8;
			    fw |= buffer[3];
			    let patch = buffer[4];
			    patch <<= 8;
			    patch |= buffer[5];
			    let cmp = buffer[6];
			    cmp <<= 8;
			    cmp |= buffer[7];
			    let chiprev = buffer[8];
			    
			    console.log("Part # Si47"+pn+"-"+fw);
			    
			    console.log("Firmware 0x"+fw);
			    console.log("Patch 0x"+patch);
			    console.log("Chip rev "+chiprev);

			    resolve(pn);
			},100);
		});
	}
}

module.exports = Si4713Driver;