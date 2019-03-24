//Libraries
const debugMode = false;

//Debugging
const debugLog = (log) => {
	if (debugMode) {
		if (typeof log == "object") {
			console.log(JSON.stringify(log));
		} else {
			console.log(log);
		}
	}
}

debugLog("initializing Si4713lib");
debugLog("requiring constants");
const LibConstants = require("./const.js");
const lC = LibConstants; //shorthand

debugLog("requiring common lib");
const LibCommon = require("../common.js");

debugLog("requiring fakeGPIO lib");
var GPIO = require("./fakeGPIO.js").Gpio;

debugLog("requiring fakeI2C lib");
var I2C = require('./fakeI2C.js');
var i2cInterface = I2C.openSync(3, {forceAccess: true});
var iI = i2cInterface; //shorthand

class Si4713Driver extends LibCommon.device {
	constructor(pin = -1, real = true) {
		super(("Si4713#"+Math.random().toFixed(3)*1000), 1); //call super to set parameters
		this.i2cBuffer = []; //instantiate new i2c buffer

		if (real) { //reload with real libraries
			debugLog("requiring real GPIO lib");
			GPIO = require("onoff").Gpio;

			debugLog("requiring real I2C lib");
			I2C = require('i2c-bus');
			i2cInterface = I2C.openSync(3);
			iI = i2cInterface; //shorthand
		}

		this.resetpin = pin;
		this.resetGPIO = new GPIO(this.resetpin, "out"); //create the pin

		process.on('SIGINT', () => {
			debugLog("unexport gpio");
		  	this.resetGPIO.unexport(); //unexport GPIO
		});
	}

	begin(addr = lC.SI4710_ADDR1) {
		return new Promise( (resolve, reject) => {
			debugLog("begin called w/addr "+addr);
			this.i2caddr = addr;

			this.reset()
			.then(() => this.powerUp().then(() => this.getRev().then(rev => {
				if (rev == 13) {
					debugLog("Si4713 found successfully on address "+this.i2caddr);
					return resolve(true);
				} else {
					debugLog("No si4713 found successfully, rev="+rev);
					return resolve(false);
				}
			})))
			.catch(e => {
				console.error(e);
				reject(e);
			})
		})

		//check for chip
		
	}
	end() {
		debugLog("end: unexporting gpio");
		this.resetGPIO.unexport();
		debugLog("end: freeing i2c bus");
		iI.closeSync();
	}
	reset() {
		debugLog("reset called");
		return new Promise((resolve, reject) => {
			if (this.resetpin > 0) { //ensure that pin was created correctly
				this.resetGPIO.writeSync(1);
				setTimeout( () => {
					this.resetGPIO.writeSync(0);
					setTimeout( () => {
						this.resetGPIO.writeSync(1);
						return resolve();
					}, 25);
				},25);
			}
		})
	}
	powerUp() {
		debugLog("powerUp called");
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
		debugLog("set property: "+property+", value: "+value);
		this.sendCommand([
			lC.SI4710_CMD_SET_PROPERTY,
   			0,
    		property >> 8,
    		property & 0xFF,
    		value >> 8,
    		value & 0xFF
		])
	}

	sendCommand(arrayBuffer = -1) {
		if (typeof buffer != "number") {
			this.i2cBuffer = Buffer.from(arrayBuffer); //create real buffer
		}

		if (debugMode) {
			for (let i=0; i<this.i2cBuffer.length; i++) {
				debugLog("sending i2c command: "+this.i2cBuffer[i]);
			}
		}
		
		try {
			iI.i2cWriteSync(this.i2caddr, this.i2cBuffer.length, this.i2cBuffer); //writes buffer to i2c addr
		} catch(e) {
			console.error("failed to send i2c command: e="+e);
		}
	}
	getRev() {
		return new Promise( (resolve, reject) => {
			this.sendCommand([lC.SI4710_CMD_GET_REV,0]); //request rev

			setTimeout( () => {
				let buffer = Buffer.alloc(9); //new buffer of size 9
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
			    
			    debugLog("Part # Si47"+pn+"-"+fw);
			    
			    debugLog("Firmware 0x"+fw);
			    debugLog("Patch 0x"+patch);
			    debugLog("Chip rev "+chiprev);

			    resolve(pn);
			},100);
		});
	}

	tuneFM(freqKHz = 10190) {
		return new Promise( (resolve, reject) => {
			debugLog("tuning to FM freq "+(freqKHZ/100));
			this.sendCommand([
				lC.SI4713_CMD_TX_TUNE_FREQ,
				0,
				freqKHz >> 8,
				freqKHz
			]);

			this.whenStatusIs(0x81).then(() => resolve())
			.catch( e => reject(e));
		})
	}

	setTXpower(pwr, antcap) {
		this.sendCommand([
			lC.SI4710_CMD_TX_TUNE_POWER,
			0,
			0,
			pwr,
			antcap
		])
	}

	beginRDS(programID) {
		// 66.25KHz (default is 68.25)
		this.setProperty(lC.SI4713_PROP_TX_AUDIO_DEVIATION, 6625); 

		// 2KHz (default)  
		this.setProperty(lC.SI4713_PROP_TX_RDS_DEVIATION, 200); 

		// RDS IRQ 
		this.setProperty(lC.SI4713_PROP_TX_RDS_INTERRUPT_SOURCE, 0x0001); 
		// program identifier
		this.setProperty(lC.SI4713_PROP_TX_RDS_PI, programID);
		// 50% mix (default)
		this.setProperty(lC.SI4713_PROP_TX_RDS_PS_MIX, 0x03);
		// RDSD0 & RDSMS (default)
		this.setProperty(lC.SI4713_PROP_TX_RDS_PS_MISC, 0x1808); 
		// 3 repeats (default)
		this.setProperty(lC.SI4713_PROP_TX_RDS_PS_REPEAT_COUNT, 3); 

		this.setProperty(lC.SI4713_PROP_TX_RDS_MESSAGE_COUNT, 1);
		this.setProperty(lC.SI4713_PROP_TX_RDS_PS_AF, 0xE0E0); // no AF
		this.setProperty(lC.SI4713_PROP_TX_RDS_FIFO_SIZE, 0);

		this.setProperty(lC.SI4713_PROP_TX_COMPONENT_ENABLE, 0x0007);
	}

	setRDSStation(s) {
		let slots = (s.length+3) / 4;

		let sOffset = 0;
		for (let i=0; i<slots; i++) {
			let sSelection = s.substring(sOffset, sOffset+4);
			this.sendCommand([
				lC.SI4710_CMD_TX_RDS_PS,
				i,
				sSelection[0],
				sSelection[1],
				sSelection[2],
				sSelection[3],
				0
			]);
			sOffset+=4;
		}
	}

	setRDSBuffer(s) {
		let slots = (s.length+3) / 4;

		let sOffset = 0;
		for (let i=0; i<slots; i++) {
			let sSelection = s.substring(sOffset, sOffset+4);
			this.sendCommand([
				lC.SI4710_CMD_TX_RDS_BUFF,
				((i == 0) ? 0x06 : 0x04),
				0x20,
				i,
				sSelection[0],
				sSelection[1],
				sSelection[2],
				sSelection[3]
			]);
			sOffset+=4;
		}

  for (uint8_t i=0; i<slots; i++) {
    memset(_i2ccommand, ' ', 8); // clear it with ' '
    memcpy(_i2ccommand+4, s, min(4, strlen(s)));
    s+=4;
    _i2ccommand[8] = 0;
    //Serial.print("Set buff #"); Serial.print(i); 
    //char *slot = (char *)( _i2ccommand+4);
    //Serial.print(" to '"); Serial.print(slot); Serial.println("'");
    _i2ccommand[0] = SI4710_CMD_TX_RDS_BUFF;
    if (i == 0)
      _i2ccommand[1] = 0x06;
    else
      _i2ccommand[1] = 0x04;

    _i2ccommand[2] = 0x20;
    _i2ccommand[3] = i;
    sendCommand(8);
  }

  		debugLog("RDS Enable");
		this.setProperty(lC.SI4713_PROP_TX_COMPONENT_ENABLE, 0x0007); // stereo, pilot+rds
	}

	setGPIOctrl(x) {
		this.sendCommand([lC.SI4710_CMD_GPO_CTL,x]);
	}

	setGPIO(x) {
		this.sendCommand([lC.SI4710_CMD_GPO_SET,x]);
	}

	whenStatusIs(status = 0x81, maxTimeout = 30000) { //maxTimeout is maximum time that function will wait before rejecting
		return new Promise( (resolve, reject) => {
			this.sendCommand([SI4710_CMD_GET_INT_STATUS]);
			let cSInterval = setInterval(() => {
				let buffer = Buffer.alloc(1); //new buffer to alloc
				let amountBytes = iI.i2cReadSync(this.i2caddr, 1, buffer); //read a single status byte
				let res = result[0] & status;
				debugLog("res="+res+", amntBytes="+amountBytes);
				if (res || amountBytes > 0) {
					clearInterval(cSInterval);
					return resolve();
				}
			})
			setTimeout(() => {
				clearInterval(cSInterval);
				return reject();
			}, maxTimeout)
		}) 
	}
}

module.exports = Si4713Driver;