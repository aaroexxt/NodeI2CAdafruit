//FakeGPIO.js
//Emulated onoff module from npm so I can develop on my mac
//https://github.com/fivdi/onoff


module.exports = {
	Gpio: function(pin, mode) {
		console.log("new Gpio created; pin="+pin+", mode="+mode);
		this.pin = pin;
		this.mode = mode;
		this.writeSync = function(pwr) {
			console.log("writing to GPIO at pin "+this.pin+", and "+this.mode+" with new power "+pwr);
		}
		this.unexport = function() {
			console.log("unexporting GPIO pin"+this.pin)
		}
	}
}