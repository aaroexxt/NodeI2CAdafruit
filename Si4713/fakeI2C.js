//FakeI2C.js
//Emulated i2c module from npm so I can develop on my mac
//https://www.npmjs.com/package/i2c-bus#busi2cwritesyncaddr-length-buffer


module.exports = {
	openSync: function(bus_id) {
		console.log("instantiated i2c bus w/bus id "+bus_id);
		return {
			i2cWriteSync: function(addr, len, buffer) {
				console.log("i2cWriteSync called with addr "+addr+", len "+len+", buffer "+JSON.stringify(buffer));
			},
			i2cReadSync: function(addr, len, buffer) {
				console.log("i2cReadSync called with addr"+addr+", len"+len+", buffer "+JSON.stringify(buffer));
				for (var i=0; i<len; i++) {
					buffer[i] = -1;
				}
			},
			writeQuickSync: function(addr, val) {
				console.log("writeQuickSync called with addr "+addr+" val "+val);
				return true;
			},
			i2cFuncsSync: function() {
				return {
					smbusQuick: true
				}
			},
			closeSync: function(bus_id) {
				console.log("closed i2c bus w/bus id "+bus_id);
			}
		}
	}
}