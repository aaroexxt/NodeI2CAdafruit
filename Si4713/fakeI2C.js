//FakeI2C.js
//Emulated i2c module from npm so I can develop on my mac
//https://www.npmjs.com/package/i2c-bus#busi2cwritesyncaddr-length-buffer


module.exports = {
	openSync: function(bus_id) {
		console.log("instantiated i2c bus w/bus id "+bus_id);
		return {
			i2cWriteSync: function(addr, len, buffer) {
				console.log("i2cWriteSync called with addr "+addr+", len "+len+", buffer "+JSON.stringify(buffer));
			}
		}
	}
}